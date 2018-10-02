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
import { CommandType } from "@dataservices/virtualization/view-editor/command/command-type.enum";

export class UpdateViewNameCommand extends Command {

  /**
   * The command identifier.
   *
   * @type {string}
   */
  public static readonly id = CommandType.UPDATE_VIEW_NAME_COMMAND;

  /**
   * The name of the command argument whose value is the new name of the view.
   *
   * @type {string}
   */
  public static readonly newName = "newName";

  /**
   * The name of the command argument whose value is the replaced name of the view.
   *
   * @type {string}
   */
  public static readonly oldName = "oldName";

  /**
   * @param {string} newViewName the new view name (can be `null` or empty)
   * @param {string} oldViewName the view name being replaced (can be `null` or empty)
   */
  public constructor( newViewName: string,
                      oldViewName: string ) {
    super( UpdateViewNameCommand.id, ViewEditorI18n.updateViewNameCommandName );

    if ( newViewName ) {
      this._args.set( UpdateViewNameCommand.newName, newViewName );
    }

    if ( oldViewName ) {
      this._args.set( UpdateViewNameCommand.oldName, oldViewName );
    }
  }

}
