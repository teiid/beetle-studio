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
import { UndoNode } from "@dataservices/virtualization/view-editor/command/undo-redo/undo-node";
import { Undoable } from "@dataservices/virtualization/view-editor/command/undo-redo/undoable";
import { Command } from "@dataservices/virtualization/view-editor/command/command";
import { ViewEditorI18n } from "@dataservices/virtualization/view-editor/view-editor-i18n";

export class UndoManager {

  private currentIndex: UndoNode = null;
  private readonly rootNode: UndoNode;

  public constructor() {
    this.rootNode = new UndoNode();
    this.currentIndex = this.rootNode;
  }

  /**
   * Removes all undoables.
   */
  public clear(): void {
    this.currentIndex = this.rootNode;
  }

  /**
   * @param {Undoable} undoable the undoable being added (cannot be `null`)
   */
  public add( undoable: Undoable ): void {
    const node = new UndoNode( undoable );
    this.currentIndex.right = node;
    node.left = this.currentIndex;
    this.currentIndex = node;
  }

  /**
   * @returns {boolean} `true` if there is a redo command can be executed
   */
  public canRedo(): boolean {
    return this.currentIndex.right !== null;
  }

  /**
   * @returns {boolean} `true` if there is an undo command can be executed
   */
  public canUndo(): boolean {
    return this.currentIndex !== this.rootNode;
  }

  private moveLeft(): void {
    if ( this.currentIndex.left == null ) {
      throw new RangeError( "Cannot move left since internal index is null." );
    }

    this.currentIndex = this.currentIndex.left;
  }

  private moveRight(): void {
    if ( this.currentIndex.right == null ) {
      throw new RangeError( "Cannot move right since internal index is null." );
    }

    this.currentIndex = this.currentIndex.right;
  }

  /**
   * Calling this method does not affect the undo manager command stack. If the redo method will be executed call
   * the `popRedoCommand` method instead.
   *
   * @returns {Command} the current redo command to execute (never `null`)
   * @throws {RangeError} if there is not an available redo command
   */
  public peekRedoCommand(): Command {
    if ( !this.canRedo() ) {
      throw new RangeError( "Cannot redo since index is out of range." );
    }

    return this.currentIndex.right.undoable.redoCommand;
  }

  /**
   * Calling this method does not affect the undo manager command stack. If the undo method will be executed call
   * the `popUndoCommand` method instead.
   *
   * @returns {Command} the available undo command
   * @throws {RangeError} if there is not an undo command
   */
  public peekUndoCommand(): Command {
    if ( !this.canUndo() ) {
      throw new RangeError( "Cannot undo since index is out of range." );
    }

    return this.currentIndex.undoable.undoCommand;
  }

  /**
   * Removes the current redo command from the redo command stack.
   *
   * @returns {Command} the current redo command to execute (never `null`)
   * @throws {RangeError} if there is not an available redo command
   */
  public popRedoCommand(): Command {
    if ( !this.canRedo() ) {
      throw new RangeError( "Cannot redo since index is out of range." );
    }

    this.moveRight();
    return this.currentIndex.undoable.redoCommand;
  }

  /**
   * Removes the current undo command from the undo command stack.
   *
   * @returns {Command} the current undo command to execute (never `null`)
   * @throws {RangeError} if there is not an undo command
   */
  public popUndoCommand(): Command {
    if ( !this.canUndo() ) {
      throw new RangeError( "Cannot undo since index is out of range." );
    }

    const cmd = this.currentIndex.undoable.undoCommand;
    this.moveLeft();
    return cmd;
  }

  /**
   * @returns {string} a short description, suitable for use in tooltips, of the next available redo command
   */
  public redoLabel(): string {
    let label = ViewEditorI18n.redoActionTooltip;

    if ( this.canRedo() ) {
      label += " " + this.peekRedoCommand().name;
    }

    return label;
  }

  /**
   * @returns {string} a short description, suitable for use in tooltips, of the next available undo command
   */
  public undoLabel(): string {
    let label = ViewEditorI18n.undoActionTooltip;

    if ( this.canUndo() ) {
      label += " " + this.peekUndoCommand().name;
    }

    return label;
  }

}
