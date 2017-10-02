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

import { NewConnection } from '@connections/shared/new-connection.model';

export class NewActivity {

  name: string;
  description: string;
  sourceConnection: NewConnection = new NewConnection();
  targetConnection: NewConnection = new NewConnection();

  /**
   * Constructor
   */
  constructor() {
    // nothing to do
  }

  /**
   * @returns {string} the activity name (can be null)
   */
  public getName(): string {
    return this.name;
  }

  /**
   * @returns {string} the activity description (can be null)
   */
  public getDescription(): string {
    return this.description;
  }

  /**
   * @returns {NewConnection} the source connection (can be null)
   */
  public getSourceConnection(): NewConnection {
    return this.sourceConnection;
  }

  /**
   * @returns {NewConnection} the target connection (can be null)
   */
  public getTargetConnection(): NewConnection {
    return this.targetConnection;
  }

  /**
   * @param {string} name the activity name (optional)
   */
  public setName( name?: string ): void {
    this.name = name ? name : null;
  }

  /**
   * @param {string} description the activity description (optional)
   */
  public setDescription( description?: string ): void {
    this.description = description ? description : null;
  }

  /**
   * @param {NewConnection} sourceConnection the source connection (optional)
   */
  public setSourceConnection( sourceConnection?: NewConnection ): void {
    this.sourceConnection = sourceConnection ? sourceConnection : null;
  }

  /**
   * @param {NewConnection} targetConnection the target connection (optional)
   */
  public setTargetConnection( targetConnection?: NewConnection ): void {
    this.targetConnection = targetConnection ? targetConnection : null;
  }

  // overrides toJSON - we do not want the name supplied in the json body.
  public toJSON() {
    return {
      sourceConnection: this.sourceConnection,
      targetConnection: this.targetConnection
    };
  }
}
