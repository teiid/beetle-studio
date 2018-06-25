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

import { ViewEditorI18n } from "@dataservices/virtualization/view-editor/view-editor-i18n";
import { Command } from "@dataservices/virtualization/view-editor/command/command";

export class AddSourcesCommand extends Command {

  /**
   * The command identifier.
   *
   * @type {string}
   */
  public static readonly id = "AddSourcesCommand";

  /**
   * The name of the command argument whose value is the IDs of the sources that are being added.
   *
   * @type {string}
   */
  public static readonly addedSourcesIds = "addedSourcesIds";

  /**
   * @param {string} addedSourcesIds the IDs of the sources being added (cannot be `null` or empty)
   */
  public constructor( addedSourcesIds: string[] ) {
    super( AddSourcesCommand.id, ViewEditorI18n.addSourcesCommandName );

    // concatenate IDs using comma as delimiter
    let args = "";
    let firstTime = true;

    addedSourcesIds.forEach( ( id ) => {
      if ( firstTime ) {
        firstTime = false;
      } else {
        args += Command.idsDelimiter;
      }

      args += id;
    } );

    this._args.set( AddSourcesCommand.addedSourcesIds, args );
  }

}
