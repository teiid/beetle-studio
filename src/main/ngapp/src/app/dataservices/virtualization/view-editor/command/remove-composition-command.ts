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
import { Composition } from "@dataservices/shared/composition.model";

export class RemoveCompositionCommand extends Command {

  /**
   * The command identifier.
   *
   * @type {string}
   */
  public static readonly id = "RemoveCompositionCommand";

  /**
   * The name of the command argument whose value is the compositions being removed.
   *
   * @type {string}
   */
  public static readonly removedComposition = "removedComposition";

  private static readonly delim = ", ";

  /**
   * Constructor
   * 'removedCompositionName' must be an array of Compositions -OR- stringified composition
   *
   * @param {string | Composition} removedComposition the Composition object, or the stringified composition being
   *                               removed (cannot be `null` or empty)
   * @param {string} id the command id.  If not supplied, an id is generated.
   */
  public constructor( removedComposition: string | Composition, id: string ) {
    super( RemoveCompositionCommand.id, ViewEditorI18n.removeCompositionCommandName );

    let arg: string;

    if ( typeof removedComposition === "string" ) {
      arg = removedComposition as string;
    } else {
      arg = JSON.stringify(removedComposition);
    }

    this._args.set( RemoveCompositionCommand.removedComposition, arg );
    this._args.set( Command.identArg, id);
  }

  /**
   * @returns {string} the composition
   */
  public getComposition(): Composition {
    const compStr = this.getArg( RemoveCompositionCommand.removedComposition ) as string;
    const comp = Composition.create(JSON.parse(compStr));
    return comp;
  }

  /**
   * @param {Composition} composition the Composition to use in generating the id
   * @returns {string} a unique identifier of this command
   */
  public getId(composition?: Composition): string {
    let argValue = this.getArg( Command.identArg ) as string;
    if (composition)
      argValue = argValue + Command.identDivider + JSON.stringify(composition);

    return argValue;
  }

}
