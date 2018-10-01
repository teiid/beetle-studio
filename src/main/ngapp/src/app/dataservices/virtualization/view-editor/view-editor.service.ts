/**
 * @license
 * Copyright 2017 JBoss Inc
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { EventEmitter, Injectable, Output } from "@angular/core";
import { LoggerService } from "@core/logger.service";
import { Dataservice } from "@dataservices/shared/dataservice.model";
import { QueryResults } from "@dataservices/shared/query-results.model";
import { VdbService } from "@dataservices/shared/vdb.service";
import { ViewValidator } from "@dataservices/virtualization/view-editor/view-validator";
import { ViewEditorPart } from "@dataservices/virtualization/view-editor/view-editor-part.enum";
import { Message } from "@dataservices/virtualization/view-editor/editor-views/message-log/message";
import { ViewEditorEvent } from "@dataservices/virtualization/view-editor/event/view-editor-event";
import { ViewEditorEventType } from "@dataservices/virtualization/view-editor/event/view-editor-event-type.enum";
import { ViewEditorProgressChangeId } from "@dataservices/virtualization/view-editor/event/view-editor-save-progress-change-id.enum";
import { VdbsConstants } from "@dataservices/shared/vdbs-constants";
import { Command } from "@dataservices/virtualization/view-editor/command/command";
import { UpdateViewDescriptionCommand } from "@dataservices/virtualization/view-editor/command/update-view-description-command";
import { UpdateViewNameCommand } from "@dataservices/virtualization/view-editor/command/update-view-name-command";
import { AddSourcesCommand } from "@dataservices/virtualization/view-editor/command/add-sources-command";
import { RemoveSourcesCommand } from "@dataservices/virtualization/view-editor/command/remove-sources-command";
import { UndoManager } from "@dataservices/virtualization/view-editor/command/undo-redo/undo-manager";
import { CommandFactory } from "@dataservices/virtualization/view-editor/command/command-factory";
import { Undoable } from "@dataservices/virtualization/view-editor/command/undo-redo/undoable";
import { ViewEditorI18n } from "@dataservices/virtualization/view-editor/view-editor-i18n";
import { AddCompositionCommand } from "@dataservices/virtualization/view-editor/command/add-composition-command";
import { RemoveCompositionCommand } from "@dataservices/virtualization/view-editor/command/remove-composition-command";
import { ViewDefinition } from "@dataservices/shared/view-definition.model";
import { ViewEditorState } from "@dataservices/shared/view-editor-state.model";
import { DataserviceService } from "@dataservices/shared/dataservice.service";
import { SelectionService } from "@core/selection.service";

@Injectable()
export class ViewEditorService {

  /**
   * An event fired when the state of the service has changed.
   *
   * @type {EventEmitter<ViewEditorEvent>}
   */
  @Output() public editorEvent: EventEmitter< ViewEditorEvent > = new EventEmitter();

  private _editorConfig: string;
  private _editorView: ViewDefinition;
  private _editorVirtualization: Dataservice;
  private _errorMsgCount = 0;
  private _infoMsgCount = 0;
  private readonly _logger: LoggerService;
  private _messages: Message[] = [];
  private _previewResults: QueryResults;
  private _previewSql = "";
  private _readOnly = false;
  private _shouldFireEvents = true;
  private _undoMgr: UndoManager;
  private readonly _dataserviceService: DataserviceService;
  private readonly _selectionService: SelectionService;
  private readonly _vdbService: VdbService;
  private _warningMsgCount = 0;
  private _selection: string[] = [];
  private _originalView: ViewDefinition = null;

  constructor( logger: LoggerService,
               dataserviceService: DataserviceService,
               selectionService: SelectionService,
               vdbService: VdbService ) {
    this._logger = logger;
    this._dataserviceService = dataserviceService;
    this._selectionService = selectionService;
    this._vdbService = vdbService;
    this._undoMgr = new UndoManager();
  }

  /**
   * @param {Message} msg the message being added
   * @param {ViewEditorPart} source the source that is adding the message
   */
  public addMessage( msg: Message,
                     source: ViewEditorPart ): void {
    this._messages.push( msg );

    if ( msg.isError() ) {
      this._errorMsgCount++;
    } else if ( msg.isWarning() ) {
      this._warningMsgCount++;
    } else if ( msg.isInfo() ) {
      this._infoMsgCount++;
    } else {
      this._logger.error( "[ViewEditorService.addMessage] unhandled message type of '" + msg.type + "'");
    }

    this.fire( ViewEditorEvent.create( source, ViewEditorEventType.LOG_MESSAGE_ADDED, [ msg ] ) );
  }

  /**
   * @returns {boolean} `true` if there is an available undo action
   */
  public canRedo(): boolean {
    return !this.isReadOnly() && this._undoMgr.canRedo();
  }

  /**
   * @returns {boolean} `true` if there is an available redo action
   */
  public canUndo(): boolean {
    return !this.isReadOnly() && this._undoMgr.canUndo();
  }

  /**
   * Clears all log messages.
   *
   * @param {ViewEditorPart} source the source that is deleting the message
   * @param {string} context an optional context
   */
  public clearMessages( source: ViewEditorPart,
                        context?: string ): void {
    this._messages = [];
    this._errorMsgCount = 0;
    this._warningMsgCount = 0;
    this._infoMsgCount = 0;

    if ( context ) {
      this.fire( ViewEditorEvent.create( source, ViewEditorEventType.LOG_MESSAGES_CLEARED, [ context ] ) );
    } else {
      this.fire( ViewEditorEvent.create( source, ViewEditorEventType.LOG_MESSAGES_CLEARED ) );
    }
  }

  /**
   * @param {string} msgId the ID of the message being deleted
   * @param {ViewEditorPart} source the source that is deleting the message
   */
  public deleteMessage( msgId: string,
                        source: ViewEditorPart ): void {
    const index = this._messages.findIndex( ( msg ) => msg.id === msgId );

    if ( index !== -1 ) {
      const deleted = this._messages.splice( index, 1 );

      if ( deleted[ 0 ].isError() ) {
        this._errorMsgCount++;
      } else if ( deleted[ 0 ].isWarning() ) {
        this._warningMsgCount++;
      } else if ( deleted[ 0 ].isInfo() ) {
        this._infoMsgCount++;
      } else {
        this._logger.error( "[ViewEditorService.deleteMessage] unhandled message type of '" + deleted[ 0 ].type + "'");
      }

      this.fire( ViewEditorEvent.create( source, ViewEditorEventType.LOG_MESSAGE_DELETED, [ deleted[ 0 ] ] ) );
    }
  }

  /**
   * @param {ViewEditorEvent} event the event to broadcast
   */
  public fire( event: ViewEditorEvent ): void {
    this._logger.debug( "[ViewEditorService.fire] firing event: " + event );

    if (this._shouldFireEvents ) {
      this.editorEvent.emit( event );

      // validate view when first set or when its state changes
      if ( event.typeIsViewStateChanged() || event.typeIsEditedViewSet() ) {
        this.validateView( event.type );
      }
    }
  }

  /**
   * Fires a `ViewEditorEventType.VIEW_STATE_CHANGED`.
   *
   * @param {ViewEditorPart} source the source of the event
   * @param {Command} command the command that was executed on the view being edited
   */
  public fireViewStateHasChanged( source: ViewEditorPart,
                                  command: Command ): void {
    // update view model
    this.updateViewState( command );

    // add to undo manager
    const tempCmd = CommandFactory.createUndoable( command );

    if ( tempCmd instanceof Undoable ) {
      const undoable = tempCmd as Undoable;
      this._undoMgr.add( undoable );
    }

    // broadcast view change
    this.fire( ViewEditorEvent.create( source, ViewEditorEventType.VIEW_STATE_CHANGED, [ command ] ) );
  }

  /**
   * @returns {string} the editor's CSS class
   */
  public getEditorConfig(): string {
    return this._editorConfig;
  }

  /**
   * @param {string} viewName the view name
   * @returns {string} the ID used to persist the editor state
   */
  private getEditorStateId(viewName: string): string {
    const serviceVdbName = this._editorVirtualization.getServiceVdbName().toLowerCase();
    return serviceVdbName + "." + viewName;
  }

  /**
   * @returns {ViewDefinition} the view being edited or `null` if not set
   */
  public getEditorView(): ViewDefinition {
    return this._editorView;
  }

  /**
   * @returns {Dataservice} the virtualization of the view being edited or `null` if not set
   */
  public getEditorVirtualization(): Dataservice {
    return this._editorVirtualization;
  }

  /**
   * @returns {number} the number of error messages
   */
  public getErrorMessageCount(): number {
    return this._errorMsgCount;
  }

  /**
   * @returns {Message[]} the error messages
   */
  public getErrorMessages(): Message[] {
    return this._messages.filter( ( msg ) => msg.isError() );
  }

  /**
   * @returns {number} the number of informational messages
   */
  public getInfoMessageCount(): number {
    return this._infoMsgCount;
  }

  /**
   * @returns {Message[]} the informational messages
   */
  public getInfoMessages(): Message[] {
    return this._messages.filter( ( msg ) => msg.isInfo() );
  }

  /**
   * @returns {number} the message count (includes error, warning, and info messages)
   */
  public getMessageCount(): number {
    return this.getMessages().length;
  }

  /**
   * @returns {Message[]} the log messages (error, warning, and info)
   */
  public getMessages(): Message[] {
    return this._messages;
  }

  /**
   * @returns {string} the preview sql
   */
  public getPreviewSql(): string {
    return this._previewSql;
  }

  /**
   * @returns {QueryResults} the preview results or `null` if not set
   */
  public getPreviewResults(): QueryResults {
    return this._previewResults;
  }

  /**
   * A label that changes dynamically based on the next available redo command.
   *
   * @returns {string} a short description suitable for use in a redo action
   */
  public getRedoActionTooltip(): string {
    return this._undoMgr.redoLabel();
  }

  /**
   * A label that changes dynamically based on the next available undo command.
   *
   * @returns {string} a short description suitable for use in an undo action
   */
  public getUndoActionTooltip(): string {
    return this._undoMgr.undoLabel();
  }

  /**
   * @returns {number} the number of warning messages
   */
  public getWarningMessageCount(): number {
    return this._warningMsgCount;
  }

  /**
   * @returns {Message[]} the warning messages
   */
  public getWarningMessages(): Message[] {
    return this._messages.filter( ( msg ) => msg.isWarning() );
  }

  /**
   * @returns {boolean} `true` if the editor has unsaved changes
   */
  public hasChanges(): boolean {
    let hasChanged = false;
    if ( this._editorView && this._editorView !== null ) {
      hasChanged = !this._editorView.isEqual(this._originalView);
    }
    return hasChanged;
  }

  /**
   * @returns {boolean} `true` if the editor view can be saved
   */
  public canSaveView(): boolean {
    return this._editorView && this._editorView.getName() && this._editorView.getName().length > 0;
  }

  /**
   * @returns {boolean} `true` if editor is readonly or has not been set
   */
  public isReadOnly(): boolean {
    return this._readOnly;
  }

  /**
   * Executes the current redo command.
   */
  public redo(): void {
    if ( this.canRedo() ) {
      const redoCmd = this._undoMgr.popRedoCommand();
      this.updateViewState( redoCmd );
      this.fire( ViewEditorEvent.create( ViewEditorPart.EDITOR, ViewEditorEventType.VIEW_STATE_CHANGED, [ redoCmd ] ) );
    } else {
      this._logger.error( "[ViewEditorService.redo] Redo called when there is not a redo command available" );
    }
  }

  private restoreUndoables(): void {
    if ( this.getEditorVirtualization() && this.getEditorView() ) {
      // fire editor state in progress event
      this.fire( ViewEditorEvent.create( ViewEditorPart.EDITOR,
                                         ViewEditorEventType.RESTORE_EDITOR_STATE,
                                         [ ViewEditorProgressChangeId.IN_PROGRESS ] ) );

      const self = this;
      const editorId = this.getEditorStateId(this._editorView.getName());
      let errorMsg: string;

      this._logger.debug( "[ViewEditorService.restoreEditorState]: getViewEditorState for " + editorId );
      this._dataserviceService.getViewEditorState( editorId ).subscribe(
        ( resp ) => {
          const undoables = resp["undoables"];
          if ( undoables && undoables.length !== 0 ) {
            for ( const json of undoables ) {
              const temp = CommandFactory.decodeUndoable( json );

              if ( temp instanceof Undoable ) {
                const undoable = temp as Undoable;

                // update view
                // this.updateViewState( undoable.redoCommand );

                // add command to undo/redo manager
                this._undoMgr.add( undoable );
              } else {
                const error = temp as Error;
                errorMsg = ViewEditorI18n.errorRestoringViewEditorState + error.message;
              }
            }
          }
        }, ( error ) => {
          errorMsg = error.message ? error.message
                                   : error.status ? `${error.status} - ${error.statusText}`
                                                  : ViewEditorI18n.serverError;
          self._logger.error( "Unable to restore editor state '" + editorId + "'. Error: " + error );
        }, () => {
          const args = errorMsg ? [ ViewEditorProgressChangeId.COMPLETED_FAILED, errorMsg ]
                                : [ ViewEditorProgressChangeId.COMPLETED_SUCCESS ];

          // fire restore completed
          this.fire( ViewEditorEvent.create( ViewEditorPart.EDITOR,
                                             ViewEditorEventType.RESTORE_EDITOR_STATE,
                                             [ args ] ) );
        }
      );
    }
  }

  /**
   * Saves the current editor state.
   */
  public saveEditorState(): void {
    // fire save in progress event
    this.fire( ViewEditorEvent.create( ViewEditorPart.EDITOR,
      ViewEditorEventType.EDITOR_VIEW_SAVE_PROGRESS_CHANGED,
      [ ViewEditorProgressChangeId.IN_PROGRESS ] ) );

    // Save the current editorState
    const viewName = this._editorView.getName();
    const editorId = this.getEditorStateId(viewName);

    // ViewEditorState contains Undoables array plus current ViewDefinition
    const editorState = new ViewEditorState();
    editorState.setId(editorId);
    editorState.setUndoables(this._undoMgr.toArray());
    editorState.setViewDefinition(this._editorView);

    const editorStates: ViewEditorState[] = [];
    editorStates.push(editorState);

    const dataserviceName = this._selectionService.getSelectedVirtualization().getId();

    const self = this;
    this._dataserviceService.saveViewEditorStatesRefreshViews( editorStates, dataserviceName ).subscribe( () => {
        // reset original view to saved state
        self._originalView = ViewDefinition.create(this._editorView.toJSON());
        // any change to service view undeploys active serviceVdb
        self.undeploySelectedVirtualization();
        // fire save editor state succeeded event
        self.fire( ViewEditorEvent.create( ViewEditorPart.EDITOR,
                                           ViewEditorEventType.EDITOR_VIEW_SAVE_PROGRESS_CHANGED,
                                           [ ViewEditorProgressChangeId.COMPLETED_SUCCESS ] ) );
      }, () => {
        // fire save editor state failed event
        self.fire( ViewEditorEvent.create( ViewEditorPart.EDITOR,
                                           ViewEditorEventType.EDITOR_VIEW_SAVE_PROGRESS_CHANGED,
                                           [ ViewEditorProgressChangeId.COMPLETED_FAILED ] ) );
      }
    );
  }

  /**
   * Undeploy the selected virtualization (only if it is active)
   */
  public undeploySelectedVirtualization(): void {
    this._logger.debug( "[ViewEditorService.undeploySelectedVirtualization]" );
    const selectedVirt = this._selectionService.getSelectedVirtualization();
    if (selectedVirt && selectedVirt !== null &&
                        (selectedVirt.serviceDeploymentActive || selectedVirt.serviceDeploymentFailed)) {
      const serviceVdbName = selectedVirt.getServiceVdbName();
      const self = this;
      this._vdbService.undeployVdb( serviceVdbName ).subscribe( () => {
          self._dataserviceService.updateDataserviceStates();
          self._logger.debug( "[ViewEditorService.undeploySelectedVirtualization] - completed" );
        }, () => {
          self._logger.error( "[ViewEditorService.undeploySelectedVirtualization] - error with undeploy" );
        }
      );
    }
  }

  /**
   * Sets the view being edited. This is called when the editor is first constructed and can only be called once.
   * Subsequent calls are ignored.
   *
   * @param {string} newCssClass the editor's CSS class
   */
  public setEditorConfig( newCssClass: string ): void {
    if ( this._editorConfig !== newCssClass ) {
      this._editorConfig = newCssClass;
      this.fire( ViewEditorEvent.create( ViewEditorPart.EDITOR, ViewEditorEventType.EDITOR_CONFIG_CHANGED, [ newCssClass ] ) );
    }
  }

  /**
   * Sets the view being edited. This should only be called once. Subsequent calls are ignored. Fires a
   * `ViewEditorEventType.VIEW_CHANGED` event having the view definition as an argument.
   *
   * @param {ViewDefinition} viewDefn the view definition being edited
   * @param {ViewEditorPart} source the source making the update
   */
  public setEditorView( viewDefn: ViewDefinition,
                        source: ViewEditorPart ): void {
    this._editorView = viewDefn;
    this._selection = [];
    if ( viewDefn !== null ) {
      this._originalView = ViewDefinition.create(viewDefn.toJSON());
    } else {
      this._originalView = null;
    }
    this.resetUndoManager();
    // Notify components that view has been reset
    this.fire( ViewEditorEvent.create( source, ViewEditorEventType.EDITED_VIEW_SET, [ this._editorView ] ) );
    // Reset the preview panel for this view
    this.updatePreviewResults();
  }

  /**
   * Sets the virtualization whose view is being edited. This is called when the editor is first constructed and can
   * only be called once. Subsequent calls are ignored.
   *
   * @param {Dataservice} virtualization the virtualization of the view being edited
   */
  public setEditorVirtualization( virtualization: Dataservice ): void {
    if ( !this._editorVirtualization ) {
      this._editorVirtualization = virtualization;
    } else {
      this._logger.debug( "setEditorVirtualization called more than once" );
    }
  }

  /**
   * Update the preview results for the current view.  This issues a query against the preview VDB and sets
   * the previewResults
   */
  public updatePreviewResults( sourcePath?: string ): void {
    // Clear preview results
    this.setPreviewResults(null, null, ViewEditorPart.EDITOR);

    if ( !this._editorView || this._editorView === null ) {
      return;
    }
    let querySql = "";
    if ( sourcePath != null && !sourcePath.startsWith(AddCompositionCommand.id) ) {
      // Fetch new results for source table
      querySql = this._editorView.getPreviewSql(sourcePath);

    } else {
      // Fetch new results for view
      querySql = this._editorView.getPreviewSql();

    }
    const self = this;
    // Resets all of the views in the service VDB
    this._vdbService.queryVdb(querySql, VdbsConstants.PREVIEW_VDB_NAME, 15, 0)
      .subscribe(
        (queryResult) => {
          self.setPreviewResults(querySql, queryResult, ViewEditorPart.EDITOR);
        },
        (error) => {
          this._logger.error( "[ViewEditorService.updatePreviewResults] - error getting results" );
        }
      );
  }

  /**
   * Sets the preview results. Fires a `ViewEditorEventType.PREVIEW_RESULTS_CHANGED` event having the results as an
   * argument.
   *
   * @param {string} sql the preview query
   * @param {QueryResults} results the new preview results
   * @param {ViewEditorPart} source the source making the update
   */
  public setPreviewResults( sql: string,
                            results: QueryResults,
                            source: ViewEditorPart ): void {
    this._previewSql = sql;
    this._previewResults = results;
    this.fire( ViewEditorEvent.create( source, ViewEditorEventType.PREVIEW_RESULTS_CHANGED ) );
  }

  /**
   * Sets the readonly property of the editor. Fires a `ViewEditorEventType.READONLY_CHANGED` event having the
   * readonly property as an argument.
   *
   * @param {boolean} newReadOnly the new readonly value
   * @param {ViewEditorPart} source the source making the update
   */
  public setReadOnly( newReadOnly: boolean,
                      source: ViewEditorPart ): void {
    if ( this._readOnly !== newReadOnly ) {
      this._readOnly = newReadOnly;
      this.fire( ViewEditorEvent.create( source, ViewEditorEventType.READONLY_CHANGED, [ newReadOnly ] ) );
    }
  }

  /**
   * Executes the current undo command.
   */
  public undo(): void {
    if ( this.canUndo() ) {
      const undoCmd = this._undoMgr.popUndoCommand();
      this.updateViewState( undoCmd );
      this.fire( ViewEditorEvent.create( ViewEditorPart.EDITOR, ViewEditorEventType.VIEW_STATE_CHANGED, [ undoCmd ] ) );
    } else {
      this._logger.error( "[ViewEditorService.undo] Undo called when there is not an undo command available" );
    }
  }

  private updateViewState( cmd: Command ): void {
    switch ( cmd.id ) {
      case AddSourcesCommand.id: {
        const addSourcesCmd = cmd as AddSourcesCommand;
        const paths = addSourcesCmd.getSourcePaths();

        for ( const path of paths ) {
          this.getEditorView().addSourcePath( path );
        }

        break;
      }
      case AddCompositionCommand.id: {
        const addCompositionCmd = cmd as AddCompositionCommand;
        const composition = addCompositionCmd.getComposition();

        this.getEditorView().addComposition( composition );

        // Adds left and right source paths if not on composition already
        const lhSourcePath = composition.getLeftSourcePath();
        const rhSourcePath = composition.getRightSourcePath();
        this.getEditorView().addSourcePath(lhSourcePath);
        this.getEditorView().addSourcePath(rhSourcePath);

        break;
      }
      case RemoveSourcesCommand.id: {
        const removeSourcesCmd = cmd as RemoveSourcesCommand;
        const paths = removeSourcesCmd.getSourcePaths();

        for ( const path of paths ) {
          this.getEditorView().removeSourcePath( path );
        }

        // Remove any compositions that have a left or right source equal to one of the removed sources
        const comps = this.getEditorView().getCompositions();
        for ( const comp of comps ) {
          let remove = false;
          const leftSource = comp.getLeftSourcePath();
          const rightSource = comp.getRightSourcePath();
          for ( const removedPath of paths ) {
            if ( removedPath === leftSource || removedPath === rightSource ) {
              remove = true;
              break;
            }
          }
          if ( remove ) {
            this.getEditorView().removeComposition(comp.getName());
          }
        }

        break;
      }
      case RemoveCompositionCommand.id: {
        const removeCompositionCmd = cmd as RemoveCompositionCommand;
        const composition = removeCompositionCmd.getComposition();
        this.getEditorView().removeComposition(composition.getName());
        break;
      }
      case UpdateViewDescriptionCommand.id: {
        this.getEditorView().setDescription( cmd.getArg( UpdateViewDescriptionCommand.newDescription ) );
        break;
      }
      case UpdateViewNameCommand.id: {
        this.getEditorView().setName( cmd.getArg( UpdateViewNameCommand.newName ) );
        break;
      }
      default: {
        this._logger.error( "The '" + cmd.id + "' was not handled by updateViewState");
        break;
      }
    }
  }

  private validateView( context?: string ): void {
    const messages = ViewValidator.validate( this.getEditorView() );

    // clear message log
    if ( this.getMessageCount() !== 0 ) {
      this.clearMessages( ViewEditorPart.EDITOR, context );
    }

    // add new messages
    if ( messages.length !== 0 ) {
      for ( const msg of messages ) {
        this.addMessage( msg, ViewEditorPart.EDITOR );
      }
    }
  }

  /**
   * Access the current selection
   */
  public getSelection(): string[] {
    return this._selection;
  }

  /**
   * Update the node selection
   */
  public select(selection: string[]): void {
    if (!selection)
      selection = [];

    this._selection = selection;

    let msg = "View Editor selection updated to: [ ";
    this._selection.forEach((id) => {
      msg = msg + id + " ";
    });

    msg = msg + "]";

    this._logger.debug(msg);
  }

  public hasSelection(): boolean {
    return this._selection.length > 0;
  }

  /**
   * Reset the UndoManager
   */
  private resetUndoManager(): void {
    this._undoMgr = new UndoManager();
  }
}
