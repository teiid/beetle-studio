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

import { SchemaNode } from "@connections/shared/schema-node.model";
import { ViewEditorI18n } from "@dataservices/virtualization/view-editor/view-editor-i18n";
import { Command } from "@dataservices/virtualization/view-editor/command/command";

export class RemoveSourcesCommand extends Command {

  /**
   * The command identifier.
   *
   * @type {string}
   */
  public static readonly id = "RemoveSourcesCommand";

  /**
   * The name of the command argument whose value is the paths of the sources being removed.
   *
   * @type {string}
   */
  public static readonly removedSourcePaths = "removedSourcePaths";

  private static readonly delim = ", ";

  /**
   * Constructor
   * 'removedSources' must be an array of SchemaNodes -OR-
   * string of the source paths (comma delimited) - path form: "connection=aConn/schema=aSchema/table=aTable"
   *
   * @param {string | SchemaNode} removedSources the string representation of the sources or the schema nodes of the sources
   *                              being removed (cannot be `null` or empty)
   * @param {string} id the command id (cannot be 'null' or empty)
   */
  public constructor( removedSources: string | SchemaNode[], id: string ) {
    super( RemoveSourcesCommand.id, ViewEditorI18n.removeSourcesCommandName );

    let arg: string;

    if ( typeof removedSources === "string" ) {
      arg = removedSources as string;
    } else {
      arg = "";
      const sources = removedSources as SchemaNode[];
      let firstTime = true;

      sources.forEach( ( source ) => {
        if ( firstTime ) {
          firstTime = false;
        } else {
          arg += ", ";
        }

        // Prepend the connection to the schema node path
        arg += "connection=" + source.getConnectionName() + "/" + source.getPath();
      } );
    }

    this._args.set( RemoveSourcesCommand.removedSourcePaths, arg );
    this._args.set( Command.identArg, id);
  }

  /**
   * @returns {string[]} an array of the paths of the sources being added
   */
  public getSourcePaths(): string[] {
    const argValue = this.getArg( RemoveSourcesCommand.removedSourcePaths ) as string;
    return argValue.split( RemoveSourcesCommand.delim );
  }

  /**
   * @returns {string} the json payload for this command
   */
  public getPayload(sourcePath?: string): string {
    if (sourcePath)
      return sourcePath;
    return this.getArg( Command.identArg ) as string;
  }

  /**
   * @returns {string} a unique identifier of this command
   */
  public getId(sourcePath?: string): string {
    return this.getArg( Command.identArg ) as string;
  }
}
