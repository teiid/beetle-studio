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
import { Problem } from "@dataservices/virtualization/view-editor/editor-views/message-log/problem";

export class Message {

  // Property names
  public static readonly CONTEXT_PROP_NAME = "_context";
  public static readonly DESCRIPTION_PROP_NAME = "_description";
  public static readonly ID_PROP_NAME = "_id";
  public static readonly TYPE_PROP_NAME = "_type";

  private readonly _context: string;
  private readonly _description: string;
  private readonly _id: string;
  private readonly _type: MessageType;

  /**
   * Factory method to create a message using a problem.
   *
   * @param {Problem} problem the unique message identifier
   * @param {string} context the object context or path that generated the message (optional)
   */
  public static create( problem: Problem,
                        context?: string ): Message {
    return Message.doCreate( problem.id, problem.type, problem.description, context );
  }

  /**
   * Factory method to create a message.
   *
   * @param {string} id the unique message identifier
   * @param {MessageType} type the message type
   * @param {string} description the message description
   * @param {string} context the object context or path that generated the message (optional)
   */
  private static doCreate( id: string,
                           type: MessageType,
                           description: string,
                           context?: string ): Message {
    return new Message( id, type, description, context );
  }

  private constructor( id: string,
                       type: MessageType,
                       description: string,
                       context?: string ) {
    this._id = id;
    this._type = type;
    this._context = context;

    if ( description ) {
      this._description = description.trim();
    } else {
      this._description = "";
    }
  }

  /**
   * @returns {string} the object context or path (can be `null`)
   */
  public get context(): string {
    return this._context;
  }

  /**
   * @returns {string} the message description
   */
  public get description(): string {
    return this._description;
  }

  /**
   * @returns {string} the unique message identifier
   */
  public get id(): string {
    return this._id;
  }

  /**
   * @returns {boolean} `true` if an error message
   */
  public isError(): boolean {
    return this._type === MessageType.ERROR;
  }

  /**
   * @returns {boolean} `true` if an informational message
   */
  public isInfo(): boolean {
    return this._type === MessageType.INFO;
  }

  /**
   * @returns {boolean} `true` if a warning message
   */
  public isWarning(): boolean {
    return this._type === MessageType.WARNING;
  }

  /**
   * @returns {string} a string representation of the event
   */
  public toString(): string {
    let result = `message id: ${this.id}, type: ${this.type}, description: ${this.description}`;

    if ( this.context ) {
      result += ", context: " + this.context;
    }

    return result;
  }

  /**
   * @returns {string} the message type
   */
  public get type(): MessageType {
    return this._type;
  }

}
