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
import { AddSourceCommand } from "@dataservices/virtualization/view-editor/command/add-source-command";
import { AddSourcesCommand } from "@dataservices/virtualization/view-editor/command/add-sources-command";
import { RemoveSourceCommand } from "@dataservices/virtualization/view-editor/command/remove-source-command";
import { RemoveSourcesCommand } from "@dataservices/virtualization/view-editor/command/remove-sources-command";

export class CommandUtils {

  /**
   * @param {Command} cmd the command being checked (cannot be `null`)
   * @returns {boolean} `true` if the command changes the view sources
   */
  public static isViewSourcesChangedEvent( cmd: Command ): boolean {
    switch ( cmd.id ) {
      case AddSourceCommand.id:
      case AddSourcesCommand.id:
      case RemoveSourceCommand.id:
      case RemoveSourcesCommand.id: {
        return true;
      }
      default: {
        return false;
      }
    }
  }

}
