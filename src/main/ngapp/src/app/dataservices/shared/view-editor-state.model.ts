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

import { ViewDefinition } from "@dataservices/shared/view-definition.model";
import { CommandFactory } from "@dataservices/virtualization/view-editor/command/command-factory";
import { Undoable } from "@dataservices/virtualization/view-editor/command/undo-redo/undoable";

/**
 * ViewEditorState model
 */
export class ViewEditorState {
  private id: string;
  private undoables: Undoable[] = [];
  private viewDefinition: ViewDefinition;

  /**
   * @param {Object} json the JSON representation of a ViewEditorState
   * @returns {ViewEditorState} the new ViewEditorState (never null)
   */
  public static create( json: object = {} ): ViewEditorState {
    const editorState = new ViewEditorState();
    for (const field of Object.keys(json)) {
      if (field === "id") {
        editorState.setId(json[field]);
      } else if (field === "undoables") {
        const undos = json[field];
        const undoableArray: Undoable[] = [];
        for ( const jsonUndo of undos ) {
          const undoable = CommandFactory.decodeUndoable( jsonUndo ) as Undoable;
          undoableArray.push(undoable);
        }
        editorState.setUndoables(undoableArray);
      } else if (field === "viewDefinition") {
        const viewDefn = ViewDefinition.create(json[field]);
        editorState.setViewDefinition(viewDefn);
      }
    }
    return editorState;
  }

  constructor() {
    // nothing to do
  }

  /**
   * @returns {string} the editor state id
   */
  public getId(): string {
    return this.id;
  }

  /**
   * @param {string} id the editor state id
   */
  public setId( id?: string ): void {
    this.id = id ? id : null;
  }

  /**
   * @returns {ViewDefinition} the editor state view definition
   */
  public getViewDefinition(): ViewDefinition {
    return this.viewDefinition;
  }

  /**
   * @param {ViewDefinition} viewDefn the editor state view definition
   */
  public setViewDefinition( viewDefn?: ViewDefinition ): void {
    this.viewDefinition = viewDefn ? viewDefn : null;
  }

  /**
   * @returns {Undoable[]} the editor state undoables array
   */
  public getUndoables(): Undoable[] {
    return this.undoables;
  }

  /**
   * @param {Undoable[]} undoables the editor state undoables array
   */
  public setUndoables( undoables: Undoable[] ): void {
    this.undoables = undoables;
  }

  /**
   * @returns {{}} a JSON representation of the ViewEditorState
   */
  public toJSON(): {} {
    const undoablesJson = [];
    this.undoables.forEach( ( undoable ) => undoablesJson.push( undoable.toJSON() ) );

    return {
      id: this.id,
      undoables: undoablesJson,
      viewDefinition: this.viewDefinition.toJSON()
    };
  }

  /**
   * @returns {string} a string representation of the event
   */
  public toString(): string {
    const text = `id: ${this.id}`;
    return text;
  }

}
