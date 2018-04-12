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

import { ConnectionStatus } from "@connections/shared/connection-status";
import { Connection } from "@connections/shared/connection.model";

/**
 * ConnectionSummary model.
 */
export class ConnectionSummary {

  private connection: Connection;
  private status: ConnectionStatus;

  /**
   * @param {Object} json the JSON representation of a ConnectionSummary
   * @returns {ConnectionSummary} the new ConnectionSummary (never null)
   */
  public static create( json: object = {} ): ConnectionSummary {
    const connSummary = new ConnectionSummary();
    for (const field of Object.keys(json)) {
      if (field === "connection") {
        // length of 2 or shorter - no object.  TODO: better way to do this?
        if (JSON.stringify(json[field]).length > 2) {
          connSummary.setConnection(Connection.create(json[field]));
        }
      } else if (field === "status") {
        // length of 2 or shorter - no object.  TODO: better way to do this?
        if (JSON.stringify(json[field]).length > 2) {
          connSummary.setStatus(ConnectionStatus.create(json[field]));
        }
      }
    }
    return connSummary;
  }

  constructor() {
    // nothing to do
  }

  /**
   * @returns {Connection} the connection
   */
  public getConnection(): Connection {
    return this.connection;
  }

  /**
   * @returns {boolean} 'true' if a status exists
   */
  public hasStatus(): boolean {
    return (this.status && this.status !== null);
  }

  /**
   * @returns {ConnectionStatus} the status
   */
  public getStatus(): ConnectionStatus {
    return this.status;
  }

  /**
   * @param {Connection} connection the named connection
   */
  public setConnection( connection: Connection ): void {
    this.connection = connection;
  }

  /**
   * @param {ConnectionStatus} status the named vdbStatus
   */
  public setStatus( status: ConnectionStatus ): void {
    this.status = status;
  }

  /**
   * Set all object values using the supplied ConnectionSummary json
   * @param {Object} values
   */
  public setValues(values: object = {}): void {
    Object.assign(this, values);
  }

}
