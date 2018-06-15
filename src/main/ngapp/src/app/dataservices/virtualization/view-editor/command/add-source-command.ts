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

export class AddSourceCommand extends Command {

  /**
   * The command identifier.
   *
   * @type {string}
   */
  public static readonly id = "AddSourceCommand";

  /**
   * The name of the command argument whose value is the identifier of the added source.
   *
   * @type {string}
   */
  public static readonly addedSourceId = "addedSourceId";

  /**
   * @param {string} addedSourceId the ID of the source being added (cannot be `null` or empty)
   */
  public constructor( addedSourceId: string ) {
    super( AddSourceCommand.id, ViewEditorI18n.addSourceCommandName );
    this._args.set( AddSourceCommand.addedSourceId, addedSourceId );
  }

}
