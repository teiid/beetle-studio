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
import { MessageType } from "@dataservices/virtualization/view-editor/editor-views/message-log/message-type.enum";
import { ViewEditorI18n } from "@dataservices/virtualization/view-editor/view-editor-i18n";

export class Problem {

  public static readonly ERR0100 = new Problem( "ERR0100", MessageType.ERROR, ViewEditorI18n.error0100 );
  public static readonly ERR0110 = new Problem( "ERR0110", MessageType.ERROR, ViewEditorI18n.error0110 );
  public static readonly ERR0120 = new Problem( "ERR0120", MessageType.ERROR, ViewEditorI18n.error0120 );

  private readonly _id: string;
  private readonly _description: string;
  private readonly _type: MessageType;

  public constructor( id: string,
                      type: MessageType,
                      description: string ) {
    this._id = id;
    this._type = type;
    this._description = description;
  }

  /**
   * @returns {string} the description
   */
  public get description(): string {
    return this._description;
  }

  /**
   * @returns {string} the identifier
   */
  public get id(): string {
    return this._id;
  }

  /**
   * @returns {string} the type
   */
  public get type(): MessageType {
    return this._type;
  }

}
