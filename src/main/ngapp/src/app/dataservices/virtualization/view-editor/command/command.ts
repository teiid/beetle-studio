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
   * The name of the JSON key used to store the command identifier.
   *
   * @type {string}
   */
  public static readonly idPropJson = "id";

  /**
   * The identifier used for the id argument
   */
  public static readonly identArg = "ObjectId";

  /**
   * Divider symbol between the command ident and source paths
   */
  public static readonly identDivider = "_-_";

  protected readonly _args = new Map< string, any >();
  protected readonly _id: string;
  protected readonly _name: string;

  protected constructor( id: string,
                         name: string ) {
    this._id = id;
    this._name = name;
  }

  /**
   * @returns {Map<string, any>} a copy of the arguments to the command (never `null` but can be empty)
   */
  public get args(): Map< string, any > {
    const copy = new Map< string, any >();

    this._args.forEach( ( value, key ) => {
      copy.set( key, value );
    } );

    return copy;
  }

  private argsToJson(): {} {
    const result = {};

    this.args.forEach( ( value, key ) => {
      if ( !this.isTransient( key ) ) {
        result[ key ] = value;
      }
    } );

    return result;
  }

  /**
   * @param {string} argName the name of the arg whose value is being requested
   * @returns {any} the arg value or `undefined` if not found
   */
  public getArg( argName: string ): any {
    return this._args.get( argName );
  }

  /**
   * @returns {string} the unique identifier of the command (never `null` or empty)
   */
  public get id(): string {
    return this._id;
  }

  // noinspection JSMethodCanBeStatic
  /**
   * @param {string} argName the name of the argument being checked
   * @returns {boolean} `true` if the argument should not be serialized
   */
  protected isTransient( argName: string ): boolean {
    return false;
  }

  /**
   * Subclasses need to override if they do not have an associated undo command.
   *
   * @returns {boolean} `true` if the command is undoable
   */
  public isUndoable(): boolean {
    return true;
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
      args: this.argsToJson()
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

        text += key + "=" + String( value );
      } );
    } else {
      text += ", []";
    }

    return text;
  }

}
