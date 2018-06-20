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
import { ViewEditorI18n } from "@dataservices/virtualization/view-editor/view-editor-i18n";

export class NoOpCommand extends Command {

  /**
   * The command identifier.
   *
   * @type {string}
   */
  public static readonly id = "NoOpCommand";

  /**
   * The shared instance of the no op command.
   *
   * @type {NoOpCommand}
   */
  public static readonly NO_OP = new NoOpCommand();

  private constructor() {
    super( NoOpCommand.id, ViewEditorI18n.noOpCommandName );
  }

  /**
   * Overridden to ensure an empty map is always returned.
   *
   * @returns {Map<string, any>} an empty map
   */
  public get args(): Map< string, any > {
    return new Map< string, any >();
  }

  /**
   * Overridden to ensure `undefined` is always returned.
   *
   * @param {string} argName the name of the arg being requested
   * @returns {string} undefined always
   */
  public getArg( argName: string ): any {
    return undefined;
  }

  /**
   * Overridden to ensure `null` is returned. Must be overridden if the setter is overridden.
   *
   * @returns {Command} `null` always
   */
  public get undoCommand(): Command {
    return null;
  }

  /**
   * Overridden to ensure undo command cannot be set.
   *
   * @param {Command} cmd the new undo command (not used)
   */
  public set undoCommand( cmd: Command ) {
    // do nothing
  }

}
