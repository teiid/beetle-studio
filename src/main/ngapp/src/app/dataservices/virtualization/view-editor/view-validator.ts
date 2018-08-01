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

export class ViewValidator {

  /**
   * Validates the stated of the specified view definition.
   *
   * @param {ViewDefinition} viewDefn the view definition whose state is being validated.
   * @returns {Message[]} the validation messages (never `null` but can be empty)
   */
  public static validate( viewDefn: ViewDefinition ): Message[] {
    const messages: Message[] = [];

    if ( viewDefn ) {
      if ( !viewDefn.getName() || viewDefn.getName().length === 0 ) {
        messages.push( Message.create( Problem.ERR0110 ) );
      }

      if ( !viewDefn.getSourcePaths() || viewDefn.getSourcePaths().length === 0 ) {
        messages.push( Message.create( Problem.ERR0120 ) );
      }
    }

    return messages;
  }

}
