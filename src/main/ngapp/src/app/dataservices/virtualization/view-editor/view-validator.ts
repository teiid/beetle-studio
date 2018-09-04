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
import { Message } from "@dataservices/virtualization/view-editor/editor-views/message-log/message";
import { Problem } from "@dataservices/virtualization/view-editor/editor-views/message-log/problem";
import { ViewDefinition } from "@dataservices/shared/view-definition.model";
import { Composition } from "@dataservices/shared/composition.model";

export class ViewValidator {

  /**
   * Validates the stated of the specified view definition.
   *
   * @param {ViewDefinition} viewDefn the view definition whose state is being validated.
   * @returns {Message[]} the validation messages (never `null` but can be empty)
   */
  public static validate( viewDefn: ViewDefinition ): Message[] {
    const messages: Message[] = [];

    if ( !viewDefn || viewDefn === null ) {
      messages.push(Message.create( Problem.ERR0110));
    }
    else {
      // View must have a name
      if ( !viewDefn.getName() || viewDefn.getName().length === 0 ) {
        messages.push( Message.create( Problem.ERR0110 ) );
      }

      // View must have at least one source
      if ( !viewDefn.getSourcePaths() || viewDefn.getSourcePaths().length === 0 ) {
        messages.push( Message.create( Problem.ERR0120 ) );
      }

      // View with 2 or more sources must have a composition
      if ( viewDefn.getSourcePaths().length > 1 ) {
        // View with 2 or more sources must have a composition
        if ( viewDefn.getCompositions().length === 0 ) {
          messages.push( Message.create( Problem.ERR0130 ) );
          // Warning message that there is an 'orpaned source' (not associated with a composition)
        } else {
          const sources = viewDefn.getSourcePaths();
          for ( const source of sources ) {
            if ( !this.hasAssociatedComposition(source, viewDefn.getCompositions()) ) {
              messages.push( Message.create( Problem.WARN0100 ) );
              break;
            }
          }
        }
      }
    }

    return messages;
  }

  /**
   * Determine if the supplied source is used in any of the supplied compositions
   * @param source
   * @param compositions
   */
  private static hasAssociatedComposition( source: string, compositions: Composition[] ): boolean {
    let hasComposition = false;
    for ( const comp of compositions ) {
      const leftSrc = comp.getLeftSourcePath();
      const rightSrc = comp.getRightSourcePath();
      if ( leftSrc === source || rightSrc === source ) {
        hasComposition = true;
        break;
      }
    }
    return hasComposition;
  }

}
