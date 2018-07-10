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
import { Command } from "@dataservices/virtualization/view-editor/command/command";

export class Undoable {

  private readonly _redoCmd: Command;
  private readonly _undoCmd: Command;

  /**
   * Constructs an undoable. !! ** The undo and redo commands should not be `null` *** !!
   * @param {Command} undoCmd the undo command (should not be `null`)
   * @param {Command} redoCmd the redo command (should not be `null`)
   */
  public constructor( undoCmd: Command,
                      redoCmd: Command ) {
    this._undoCmd = undoCmd;
    this._redoCmd = redoCmd;
  }

  /**
   * @returns {Command} the redo command (never `null`)
   */
  public get redoCommand(): Command {
    return this._redoCmd;
  }

  /**
   * @returns {{}} a JSON representation of this undoable
   */
  public toJSON(): {} {
    return {
      undo: this.undoCommand.toJSON(),
      redo: this.redoCommand.toJSON()
    };
  }

  /**
   * @returns {string} a string representation of this undoable
   */
  public toString(): string {
    return "undo: " + this.undoCommand.toString() + ", redo: " + this.redoCommand.toString();
  }

  /**
   * @returns {Command} the undo command (never `null`)
   */
  public get undoCommand(): Command {
    return this._undoCmd;
  }

}
