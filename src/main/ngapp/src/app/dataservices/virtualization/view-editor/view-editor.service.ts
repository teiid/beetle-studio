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
import { ViewEditorPart } from "@dataservices/virtualization/view-editor/view-editor-part.enum";
import { Message } from "@dataservices/virtualization/view-editor/editor-views/message-log/message";
import { ViewEditorEvent } from "@dataservices/virtualization/view-editor/event/view-editor-event";
import { ViewEditorEventType } from "@dataservices/virtualization/view-editor/event/view-editor-event-type.enum";
import { ViewStateChangeId } from "@dataservices/virtualization/view-editor/event/view-state-change-id.enum";
import { ViewEditorSaveProgressChangeId } from "@dataservices/virtualization/view-editor/event/view-editor-save-progress-change-id.enum";

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
  private _logger: LoggerService;
  private _messages: Message[] = [];
  private _previewResults: QueryResults;
  private _readOnly = false;
  private _vdbService: VdbService;
  private _viewIsValid = false;
  private _warningMsgCount = 0;

  constructor( logger: LoggerService, vdbService: VdbService ) {
    this._logger = logger;
    this._vdbService = vdbService;
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
  }

  /**
   * Fires a `ViewEditorEventType.VIEW_STATE_CHANGED`.
   *
   * @param {ViewEditorPart} source the source of the event
   * @param {ViewStateChangeId} changeId the ID of the type of view state change that occurred
   * @param {object[]} args the optional args
   */
  public fireViewStateHasChanged( source: ViewEditorPart,
                                  changeId: ViewStateChangeId,
                                  args?: any[] ): void {
    const data = [ changeId ];

    if ( args && args.length !== 0 ) {
      for ( const arg of args ) {
        data.push( arg );
      }
    }

    this.fire( ViewEditorEvent.create( source, ViewEditorEventType.VIEW_STATE_CHANGED, data ) );
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
   * @returns {boolean} `true` if the view is valid
   */
  public viewIsValid(): boolean {
    return this._viewIsValid;
  }

  /**
   * Save the current View.
   * Currently, this regenerates *all* of the views.
   */
  public saveView(connections: Connection[]): void {
    // Fire save in progress event
    this.fire( ViewEditorEvent.create( ViewEditorPart.EDITOR, ViewEditorEventType.EDITOR_VIEW_SAVE_PROGRESS_CHANGED,
                                                         [ ViewEditorSaveProgressChangeId.IN_PROGESS ] ) );

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
        (wasSuccess) => {
          // Fire save completed success event
          this.fire( ViewEditorEvent.create( ViewEditorPart.EDITOR, ViewEditorEventType.EDITOR_VIEW_SAVE_PROGRESS_CHANGED,
                                                               [ ViewEditorSaveProgressChangeId.COMPLETED_SUCCESS ] ) );
        },
        (error) => {
          // Fire save completed failed event
          this.fire( ViewEditorEvent.create( ViewEditorPart.EDITOR, ViewEditorEventType.EDITOR_VIEW_SAVE_PROGRESS_CHANGED,
                                                               [ ViewEditorSaveProgressChangeId.COMPLETED_FAILED ] ) );
        }
      );
  }

}
