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
import { Connection } from "@connections/shared/connection.model";
import { SchemaNode } from "@connections/shared/schema-node.model";
import { LoggerService } from "@core/logger.service";
import { DataservicesConstants } from "@dataservices/shared/dataservices-constants";
import { Dataservice } from "@dataservices/shared/dataservice.model";
import { QueryResults } from "@dataservices/shared/query-results.model";
import { VdbService } from "@dataservices/shared/vdb.service";
import { View } from "@dataservices/shared/view.model";
import { ViewValidator } from "@dataservices/virtualization/view-editor/view-validator";
import { ViewEditorPart } from "@dataservices/virtualization/view-editor/view-editor-part.enum";
import { Message } from "@dataservices/virtualization/view-editor/editor-views/message-log/message";
import { ViewEditorEvent } from "@dataservices/virtualization/view-editor/event/view-editor-event";
import { ViewEditorEventType } from "@dataservices/virtualization/view-editor/event/view-editor-event-type.enum";
import { ViewEditorSaveProgressChangeId } from "@dataservices/virtualization/view-editor/event/view-editor-save-progress-change-id.enum";
import { VdbsConstants } from "@dataservices/shared/vdbs-constants";
import { Command } from "@dataservices/virtualization/view-editor/command/command";
import { RemoveSourceCommand } from "@dataservices/virtualization/view-editor/command/remove-source-command";
import { UpdateViewDescriptionCommand } from "@dataservices/virtualization/view-editor/command/update-view-description-command";
import { UpdateViewNameCommand } from "@dataservices/virtualization/view-editor/command/update-view-name-command";
import { AddSourceCommand } from "@dataservices/virtualization/view-editor/command/add-source-command";
import { AddSourcesCommand } from "@dataservices/virtualization/view-editor/command/add-sources-command";
import { RemoveSourcesCommand } from "@dataservices/virtualization/view-editor/command/remove-sources-command";
import { UndoManager } from "@dataservices/virtualization/view-editor/command/undo-redo/undo-manager";
import { CommandFactory } from "@dataservices/virtualization/view-editor/command/command-factory";

@Injectable()
export class ViewEditorService {

  /**
   * An event fired when the state of the service has changed.
   *
   * @type {EventEmitter<ViewEditorEvent>}
   */
  @Output() public editorEvent: EventEmitter< ViewEditorEvent > = new EventEmitter();

  private _editorConfig: string;
  private _editorView: View;
  private _editorVirtualization: Dataservice;
  private _errorMsgCount = 0;
  private _infoMsgCount = 0;
  private readonly _logger: LoggerService;
  private _messages: Message[] = [];
  private _previewResults: QueryResults;
  private _readOnly = false;
  private readonly _undoMgr: UndoManager;
  private readonly _vdbService: VdbService;
  private _warningMsgCount = 0;

  constructor( logger: LoggerService,
               vdbService: VdbService ) {
    this._logger = logger;
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
      this._logger.error( "unhandled message type of '" + msg.type + "'");
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
        this._logger.error( "unhandled message type of '" + deleted[ 0 ].type + "'");
      }

      this.fire( ViewEditorEvent.create( source, ViewEditorEventType.LOG_MESSAGE_DELETED, [ deleted[ 0 ] ] ) );
    }
  }

  /**
   * @param {ViewEditorEvent} event the event to broadcast
   */
  public fire( event: ViewEditorEvent ): void {
    this._logger.debug( "firing event: " + event );
    this.editorEvent.emit( event );

    // validate view when first set or when its state changes
    if ( event.typeIsViewStateChanged() || event.typeIsEditedViewSet() ) {
      this.validateView( event.type );
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
    this._undoMgr.add( CommandFactory.createUndoable( command ) );

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
   * @returns {View} the view being edited or `null` if not set
   */
  public getEditorView(): View {
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
   * @returns {string} the router link of the virtualization
   */
  public getVirtualizationLink(): string {
    return DataservicesConstants.virtualizationPath;
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
    // TODO implement hasChanges
    return true;
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
      console.error( "redo cmd=" + redoCmd.toString() );
      this.updateViewState( redoCmd );
      this.fire( ViewEditorEvent.create( ViewEditorPart.EDITOR, ViewEditorEventType.VIEW_STATE_CHANGED, [ redoCmd ] ) );
    } else {
      this._logger.error( "Redo called when there is not a redo command available" );
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
   * `ViewEditorEventType.VIEW_CHANGED` event having the view as an argument.
   *
   * @param {View} view the view being edited
   * @param {ViewEditorPart} source the source making the update
   */
  public setEditorView( view: View,
                        source: ViewEditorPart ): void {
    if ( !this._editorView ) {
      this._editorView = view;
      this.fire( ViewEditorEvent.create( source, ViewEditorEventType.EDITED_VIEW_SET, [ this._editorView ] ) );
    } else {
      this._logger.debug( "setEditorView called more than once" );
    }
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
  public updatePreviewResults( ): void {
    // Clear preview results
    this.setPreviewResults(null, ViewEditorPart.EDITOR);

    // Fetch new results
    const viewSql = this._editorView.getSql();
    const self = this;
    // Resets all of the views in the service VDB
    this._vdbService.queryVdb(viewSql, VdbsConstants.PREVIEW_VDB_NAME, 15, 0)
      .subscribe(
        (queryResult) => {
          self.setPreviewResults(queryResult, ViewEditorPart.EDITOR);
        },
        (error) => {
          alert("error getting results");
        }
      );
  }

  /**
   * Sets the preview results. Fires a `ViewEditorEventType.PREVIEW_RESULTS_CHANGED` event having the results as an
   * argument.
   *
   * @param {QueryResults} results the new preview results
   * @param {ViewEditorPart} source the source making the update
   */
  public setPreviewResults( results: QueryResults,
                            source: ViewEditorPart ): void {
    this._previewResults = results;
    this.fire( ViewEditorEvent.create( source, ViewEditorEventType.PREVIEW_RESULTS_CHANGED, [ results ] ) );
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
      this._logger.error( "Undo called when there is not an undo command available" );
    }
  }

  private updateViewState( cmd: Command ): void {
    switch ( cmd.id ) {
      case AddSourceCommand.id: {
        const sourceId = cmd.getArg( AddSourceCommand.addedSourceId );
        // TODO need to get the schema node here
        // this.getEditorView().addSource( schemaNode );
        break;
      }
      case AddSourcesCommand.id: {
        const sourcesIds = cmd.getArg( AddSourcesCommand.addedSourcesIds );
        // TODO need to get the schema nodes here
        // this.getEditorView().addSources( schemaNodes );
        break;
      }
      case RemoveSourceCommand.id: {
        this.getEditorView().removeSource( cmd.getArg( RemoveSourceCommand.removedSourceId ) );
        break;
      }
      case RemoveSourcesCommand.id: {
        this.getEditorView().removeSource( cmd.getArg( RemoveSourcesCommand.removedSourcesIds) );
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
    if ( this.getMessageCount() !== 0 && messages.length !== 0 ) {
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
   * Save the current View.
   * Currently, this regenerates *all* of the views.
   */
  public saveView(connections: Connection[]): void {
    // Fire save in progress event
    this.fire( ViewEditorEvent.create( ViewEditorPart.EDITOR, ViewEditorEventType.EDITOR_VIEW_SAVE_PROGRESS_CHANGED,
                                                         [ ViewEditorSaveProgressChangeId.IN_PROGRESS ] ) );

    const serviceVdbName = this._editorVirtualization.getServiceVdbName();
    const serviceVdbModelName = this._editorVirtualization.getServiceViewModel();

    // Accumulate the view information
    // TODO: The below assumes once source per view.  Needs to be expanded in future
    const viewNames: string[] = [];
    const sourceNodes: SchemaNode[] = [];

    // Add the current editor view name and source Node
    viewNames.push(this._editorView.getName());
    sourceNodes.push(this._editorView.getSources()[0]);

    // Add existing views and source nodes.  skip the view being edited
    for ( const view of this._editorVirtualization.getViews() ) {
      if ( viewNames.indexOf(view.getName()) === -1 ) {
        viewNames.push(view.getName());
        sourceNodes.push(view.getSources()[0]); // Currently limited to one source per view
      }
    }

    // Resets all of the views in the service VDB
    this._vdbService.compositeSetVdbModelViews(serviceVdbName,
                                               serviceVdbModelName,
                                               viewNames,
                                               sourceNodes,
                                               connections)
      .subscribe(
        () => {
          // Fire save completed success event
          this.fire( ViewEditorEvent.create( ViewEditorPart.EDITOR, ViewEditorEventType.EDITOR_VIEW_SAVE_PROGRESS_CHANGED,
                                                               [ ViewEditorSaveProgressChangeId.COMPLETED_SUCCESS ] ) );
        },
        () => {
          // Fire save completed failed event
          this.fire( ViewEditorEvent.create( ViewEditorPart.EDITOR, ViewEditorEventType.EDITOR_VIEW_SAVE_PROGRESS_CHANGED,
                                                               [ ViewEditorSaveProgressChangeId.COMPLETED_FAILED ] ) );
        }
      );
  }

}
