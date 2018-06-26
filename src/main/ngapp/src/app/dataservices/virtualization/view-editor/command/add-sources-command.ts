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
import { RemoveSourcesCommand } from "@dataservices/virtualization/view-editor/command/remove-sources-command";

export class AddSourcesCommand extends Command {

  /**
   * The command identifier.
   *
   * @type {string}
   */
  public static readonly id = "AddSourcesCommand";

  /**
   * The name of the command argument whose value is the sources that are being added.
   *
   * @type {string}
   */
  public static readonly addedSources = CommandUtils.sources;

  /**
   * @param {string | SchemaNode} addedSources the JSON representation of the sources or the schema nodes of the sources
   *                              being added (cannot be `null` or empty)
   */
  public constructor( addedSources: string | SchemaNode[] ) {
    super( AddSourcesCommand.id, ViewEditorI18n.addSourcesCommandName );

    let arg: string;

    if ( typeof addedSources === "string" ) {
      arg = addedSources as string;
    } else {
      arg = CommandUtils.toJsonValue( addedSources as SchemaNode[] );
    }

    this._args.set( AddSourcesCommand.addedSources, arg );
  }

  /**
   * @returns {{}[] | Error} an array of { connectionName: string, path: string } objects or an error if unable to parse
   */
  public decodeSourcesArg(): {}[] | Error {
    return CommandUtils.parseSourcesArg( this.getArg( RemoveSourcesCommand.removedSources ) as string );
  }

}
