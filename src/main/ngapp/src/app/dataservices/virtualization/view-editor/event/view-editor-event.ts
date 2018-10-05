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

import { ViewEditorPart } from "@dataservices/virtualization/view-editor/view-editor-part.enum";
import { ViewEditorEventType } from "@dataservices/virtualization/view-editor/event/view-editor-event-type.enum";

export class ViewEditorEvent {

  private readonly _args: any[] = [];
  private readonly _source: ViewEditorPart;
  private readonly _type: ViewEditorEventType;

  /**
   * Factory method to create an event.
   *
   * @param {ViewEditorPart} source the source of the event
   * @param {ViewEditorEventType} type the type of event
   * @param {object[]} args the optional args
   * @returns {ViewEditorEvent} the created event
   */
  public static create( source: ViewEditorPart,
                        type: ViewEditorEventType,
                        args?: any[] ): ViewEditorEvent {
    return new ViewEditorEvent( source, type, args );
  }

  private constructor( source: ViewEditorPart,
                       type: ViewEditorEventType,
                       args?: any[] ) {
    this._source = source;
    this._type = type;

    if ( args ) {
      this._args = args;
    }
  }

  /**
   * @returns {any[]} the optional args to the event (never `null` but can be empty)
   */
  public get args(): any[] {
    return this._args;
  }

  /**
   * @returns {ViewEditorPart} the event source
   */
  public get source(): ViewEditorPart {
    return this._source;
  }

  /**
   * @returns {boolean} `true` if the canvas editor part was the source of the event
   */
  public sourceIsCanvas(): boolean {
    return this.source === ViewEditorPart.CANVAS;
  }

  /**
   * @returns {boolean} `true` if the editor was the source of the event
   */
  public sourceIsEditor(): boolean {
    return this.source === ViewEditorPart.EDITOR;
  }

  /**
   * @returns {boolean} `true` if the header editor part was the source of the event
   */
  public sourceIsHeader(): boolean {
    return this.source === ViewEditorPart.HEADER;
  }

  /**
   * @returns {boolean} `true` if the message log part was the source of the event
   */
  public sourceIsMessageLog(): boolean {
    return this.source === ViewEditorPart.MESSAGE_LOG;
  }

  /**
   * @returns {boolean} `true` if the preview editor part was the source of the event
   */
  public sourceIsPreview(): boolean {
    return this.source === ViewEditorPart.PREVIEW;
  }

  /**
   * @returns {boolean} `true` if the properties editor part was the source of the event
   */
  public sourceIsProperties(): boolean {
    return this.source === ViewEditorPart.PROPERTIES;
  }

  /**
   * @returns {boolean} `true` if the projected columns editor part was the source of the event
   */
  public sourceIsProjectedSymbols(): boolean {
    return this.source === ViewEditorPart.PROJECTED_COLUMNS;
  }

  /**
   * @returns {string} a string representation of the event
   */
  public toString(): string {
    let text = `event type: ${this.type}, source: ${this.source}, args: `;
    let firstTime = true;

    if ( this.args && this.args.length !== 0 ) {
      for ( const arg of this.args ) {
        if ( firstTime ) {
          firstTime = false;
        } else {
          text += ", ";
        }

        text += arg;
      }
    }

    return text;
  }

  /**
   * @returns {ViewEditorEventType} the event type
   */
  public get type(): ViewEditorEventType {
    return this._type;
  }

  /**
   * @returns {boolean} `true` if the type is {@link ViewEditorEventType.CANVAS_SELECTION_CHANGED}
   */
  public typeIsCanvasSelectionChanged(): boolean {
    return this.type === ViewEditorEventType.CANVAS_SELECTION_CHANGED;
  }

  /**
   * @returns {boolean} `true` if the type is {@link ViewEditorEventType.EDITED_VIEW_SET}
   */
  public typeIsEditedViewSet(): boolean {
    return this.type === ViewEditorEventType.EDITED_VIEW_SET;
  }

  /**
   * @returns {boolean} `true` if the type is {@link ViewEditorEventType.EDITOR_CONFIG_CHANGED}
   */
  public typeIsEditorConfigChanged(): boolean {
    return this.type === ViewEditorEventType.EDITOR_CONFIG_CHANGED;
  }

  /**
   * @returns {boolean} `true` if the type is {@link ViewEditorEventType.EDITOR_VIEW_SAVE_PROGRESS_CHANGED}
   */
  public typeIsEditorViewSaveProgressChanged(): boolean {
    return this.type === ViewEditorEventType.EDITOR_VIEW_SAVE_PROGRESS_CHANGED;
  }

  /**
   * @returns {boolean} `true` if the type is {@link ViewEditorEventType.LOG_MESSAGE_ADDED}
   */
  public typeIsLogMessageAdded(): boolean {
    return this.type === ViewEditorEventType.LOG_MESSAGE_ADDED;
  }

  /**
   * @returns {boolean} `true` if the type is {@link ViewEditorEventType.LOG_MESSAGE_DELETED}
   */
  public typeIsLogMessageDeleted(): boolean {
    return this.type === ViewEditorEventType.LOG_MESSAGE_DELETED;
  }

  /**
   * @returns {boolean} `true` if the type is {@link ViewEditorEventType.LOG_MESSAGES_CLEARED}
   */
  public typeIsLogMessagesCleared(): boolean {
    return this.type === ViewEditorEventType.LOG_MESSAGES_CLEARED;
  }

  /**
   * @returns {boolean} `true` if the type is {@link ViewEditorEventType.PREVIEW_RESULTS_CHANGED}
   */
  public typeIsPreviewResultsChanged(): boolean {
    return this.type === ViewEditorEventType.PREVIEW_RESULTS_CHANGED;
  }

  /**
   * @returns {boolean} `true` if the type is {@link ViewEditorEventType.READONLY_CHANGED}
   */
  public typeIsReadonlyChanged(): boolean {
    return this.type === ViewEditorEventType.READONLY_CHANGED;
  }

  /**
   * @returns {boolean} `true` if the type is {@link ViewEditorEventType.RESTORE_EDITOR_STATE}.
   */
  public typeIsRestoreEditorState(): boolean {
    return this.type === ViewEditorEventType.READONLY_CHANGED;
  }

  /**
   * @returns {boolean} `true` if the type is {@link ViewEditorEventType.SHOW_EDITOR_PART}
   */
  public typeIsShowEditorPart(): boolean {
    return this.type === ViewEditorEventType.SHOW_EDITOR_PART;
  }

  /**
   * @returns {boolean} `true` if the type is {@link ViewEditorEventType.VIEW_STATE_CHANGED}
   */
  public typeIsViewStateChanged(): boolean {
    return this.type === ViewEditorEventType.VIEW_STATE_CHANGED;
  }

  /**
   * @returns {boolean} `true` if the type is `ViewEditorEventType.CREATE_SOURCE`
   */
  public typeIsCreateSource(): boolean {
    return this.type === ViewEditorEventType.CREATE_SOURCE;
  }

  /**
   * @returns {boolean} `true` if the type is `ViewEditorEventType.CREATE_COMPOSITION`
   */
  public typeIsCreateComposition(): boolean {
    return this.type === ViewEditorEventType.CREATE_COMPOSITION;
  }

  /**
   * @returns {boolean} `true` if the type is `ViewEditorEventType.DELETE_NODE`
   */
  public typeIsDeleteNode(): boolean {
    return this.type === ViewEditorEventType.DELETE_NODE;
  }

}
