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
import { CommandUtils } from "@dataservices/virtualization/view-editor/command/command-utils";

export class RemoveSourcesCommand extends Command {

  /**
   * The command identifier.
   *
   * @type {string}
   */
  public static readonly id = "RemoveSourcesCommand";

  /**
   * The name of the command argument whose value is the removed sources.
   *
   * @type {string}
   */
  public static readonly removedSources = CommandUtils.sources;

  /**
   * @param {string | SchemaNode} removedSources the JSON representation of the sources or the schema nodes of the sources
   *                              being removed (cannot be `null` or empty)
   */
  public constructor( removedSources: string | SchemaNode[] ) {
    super( RemoveSourcesCommand.id, ViewEditorI18n.removeSourcesCommandName );

    let arg: string;

    if ( typeof removedSources === "string" ) {
      arg = removedSources as string;
    } else {
      arg = CommandUtils.toJsonValue( removedSources as SchemaNode[] );
    }

    this._args.set( RemoveSourcesCommand.removedSources, arg );
  }

  /**
   * @returns {{}[] | Error} an array of { connectionName: string, path: string } objects or an error if unable to parse
   */
  public decodeSourcesArg(): {}[] | Error {
    return CommandUtils.parseSourcesArg( this.getArg( RemoveSourcesCommand.removedSources ) as string );
  }

}
