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

export abstract class Command {

  /**
   * The name of the JSON key used to store the arguments.
   * @type {string}
   */
  public static readonly argsPropJson = "args";

  /**
   * The name of the JSON key used to store an argument.
   * @type {string}
   */
  public static readonly argNameJson = "name";

  /**
   * The name of the JSON key used to store an argument value.
   * @type {string}
   */
  public static readonly argValueJson = "value";

  /**
   * The name of the JSON key used to store the command identifier.
   * @type {string}
   */
  public static readonly idPropJson = "id";

  protected _args = new Map< string, string >();
  protected readonly  _id: string;
  protected readonly _name: string;
  protected _undoCommand: Command = null;

  protected constructor( id: string,
                         name: string ) {
    this._id = id;
    this._name = name;
  }

  /**
   * @returns {Map<string, string>} the arguments to the command (never `null` but can be empty)
   */
  public get args(): Map< string, string > {
    return this._args;
  }

  private argsToArray(): object[] {
    const result = [];

    this.args.forEach( ( value, key ) => {
      result.push( { [ Command.argNameJson ]: key, [ Command.argValueJson ]: value } );
    } );

    return result;
  }

  /**
   * @returns {boolean} `true` if an undo command exists
   */
  public canUndo(): boolean {
    return this.undoCommand != null;
  }

  /**
   * @returns {string} the unique identifier of the command (never `null` or empty)
   */
  public get id(): string {
    return this._id;
  }

  /**
   * @param {string} argName the name of the arg whose value is being requested
   * @returns {string} the arg value or `undefined` if not found
   */
  public getArg( argName: string ): string {
    return this._args.get( argName );
  }

  /**
   * @returns {string} a short name of the command (never `null` or empty)
   */
  public get name(): string {
    return this._name;
  }

  /**
   * @returns {{}} a JSON representation of the command
   */
  public toJSON(): {} {
    return {
      id: this.id,
      args: this.argsToArray()
    };
  }

  /**
   * @returns {string} a string representation of the command
   */
  public toString(): string {
    let text = `${this.id}`;
    let firstTime = true;

    if ( this.args.size !== 0 ) {
      text += ", ";

      this.args.forEach( ( value, key ) => {
        if ( firstTime ) {
          firstTime = false;
        } else {
          text += ", ";
        }

        text += key + "=" + value;
      } );
    } else {
      text += "[]";
    }

    return text;
  }

  /**
   * @returns {Command} the command to run that will undo this command (can be `null`)
   */
  public get undoCommand(): Command {
    return this._undoCommand;
  }

  /**
   * @param {Command} cmd the undo command or `null` if removing an existing one
   */
  public set undoCommand( cmd: Command ) {
    this._undoCommand = cmd;
  }

}
