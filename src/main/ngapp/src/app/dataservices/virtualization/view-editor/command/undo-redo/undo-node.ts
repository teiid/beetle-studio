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

import { Undoable } from "@dataservices/virtualization/view-editor/command/undo-redo/undoable";

export class UndoNode {

  private _left: UndoNode = null;
  private _right: UndoNode = null;
  private readonly _undoable: Undoable;

  public constructor( undoable?: Undoable ) {
    if ( undoable ) {
      this._undoable = undoable;
    }
  }

  /**
   * @returns {UndoNode} the node to the left or `null`
   */
  public get left(): UndoNode {
    return this._left;
  }

  /**
   * @param {UndoNode} node the new left node
   */
  public set left( node: UndoNode ) {
    this._left = node;
  }

  /**
   * @returns {UndoNode} the node to the right or `null`
   */
  public get right(): UndoNode {
    return this._right;
  }

  /**
   * @param {UndoNode} node the new right node
   */
  public set right( node: UndoNode ) {
    this._right = node;
  }

  /**
   * @returns {Undoable} the undoable associated with this node (never `null`)
   */
  public get undoable(): Undoable {
    return this._undoable;
  }

}
