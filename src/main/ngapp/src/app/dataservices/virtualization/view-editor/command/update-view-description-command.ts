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

export class UpdateViewDescriptionCommand extends Command {

  /**
   * The command identifier.
   *
   * @type {string}
   */
  public static readonly id = CommandType.UPDATE_VIEW_DESCRIPTION_COMMAND;

  /**
   * The name of the command argument whose value is the new description of the view.
   *
   * @type {string}
   */
  public static readonly newDescription = "newDescription";

  /**
   * The name of the command argument whose value is the replaced description of the view.
   *
   * @type {string}
   */
  public static readonly oldDescription = "oldDescription";

  /**
   * @param {string} newViewDescription the new view description (can be `null` or empty)
   * @param {string} oldViewDescription the view description being replaced (can be `null` or empty)
   */
  public constructor( newViewDescription: string,
                      oldViewDescription: string ) {
    super( UpdateViewDescriptionCommand.id, ViewEditorI18n.updateViewDescriptionCommandName );

    if ( newViewDescription ) {
      this._args.set( UpdateViewDescriptionCommand.newDescription, newViewDescription );
    }

    if ( oldViewDescription ) {
      this._args.set( UpdateViewDescriptionCommand.oldDescription, oldViewDescription );
    }
  }

}
