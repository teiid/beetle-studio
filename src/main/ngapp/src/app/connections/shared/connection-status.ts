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

export class ConnectionStatus {

  private readonly activeState = "ACTIVE";
  private readonly failedState = "FAILED";
  private readonly loadingState = "LOADING";
  private readonly missingState = "MISSING";

  private connectionName: string;
  private errors: string[];
  private schemaState: string;
  private schemaModelName: string;
  private schemaVdbName: string;
  private vdbName: string;
  private vdbState: string;

  /**
   * @param {Object} json the JSON representation of a connection status
   * @returns {ConnectionStatus} the new connection status (never null)
   */
  public static create( json: object = {} ): ConnectionStatus {
    const status = new ConnectionStatus();
    status.setValues( json );
    return status;
  }

  /**
   * Creates a Loading status
   * @param {string} connName the connection name
   * @returns {ConnectionStatus} the new connection status (never null)
   */
  public static createLoadingStatus( connName: string ): ConnectionStatus {
    const status = new ConnectionStatus();
    status.setValues(
      {
        "connectionName": connName,
        "vdbState": "LOADING",
        "schemaState": "MISSING",
        "errors": []
      } );
    return status;
  }

  /**
   * @returns {string} the connection name or `null` if not set
   */
  public getConnectionName(): string {
    return this.connectionName;
  }

  /**
   * @returns {string[]} the errors or `null` if not set
   */
  public getErrors(): string[] {
    return this.errors;
  }

  /**
   * @returns {string} the schema model name or `null` if not set
   */
  public getSchemaModelName(): string {
    return this.schemaModelName;
  }

  /**
   * @returns {string} the schema VDB name or `null` if not set
   */
  public getSchemaVdbName(): string {
    return this.schemaVdbName;
  }

  /**
   * @returns {string} the deployed VDB name or `null` if not set
   */
  public getServerVdbName(): string {
    return this.vdbName;
  }

  /**
   * @returns {boolean} `true` if the workspace schema is available
   */
  public isSchemaAvailable(): boolean {
    return this.schemaState && this.schemaState.toUpperCase() === this.activeState;
  }

  /**
   * @returns {boolean} `true` if the workspace schema is in a failed state
   */
  public isSchemaFailed(): boolean {
    return this.schemaState && this.schemaState.toUpperCase() === this.failedState;
  }

  /**
   * @returns {boolean} `true` if the workspace schema is loading
   */
  public isSchemaLoading(): boolean {
    return this.schemaState && this.schemaState.toUpperCase() === this.loadingState;
  }

  /**
   * @returns {boolean} `true` if the workspace schema is missing
   */
  public isSchemaMissing(): boolean {
    return this.schemaState && this.schemaState.toUpperCase() === this.missingState;
  }

  /**
   * @returns {boolean} `true` if the server VDB is active
   */
  public isServerVdbActive(): boolean {
    return this.vdbState && this.vdbState.toUpperCase() === this.activeState;
  }

  /**
   * @returns {boolean} `true` if the server VDB is in a failed state
   */
  public isServerVdbFailed(): boolean {
    return this.vdbState && this.vdbState.toUpperCase() === this.failedState;
  }

  /**
   * @returns {boolean} `true` if the server VDB is loading
   */
  public isServerVdbLoading(): boolean {
    return this.vdbState && this.vdbState.toUpperCase() === this.loadingState;
  }

  /**
   * @returns {boolean} `true` if the server VDB is missing
   */
  public isServerVdbMissing(): boolean {
    return this.vdbState && this.vdbState.toUpperCase() === this.missingState;
  }

  /**
   * Set all object values using the supplied connection status JSON.
   * @param {Object} json the JSON
   */
  public setValues( json: object = {} ): void {
    Object.assign( this, json );
  }

  /**
   * Require the static create method to be called from outside this class.
   */
  private constructor() {
    // nothing to do
  }

}
