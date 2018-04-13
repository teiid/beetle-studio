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

import { Connection } from "@connections/shared/connection.model";

export class ConnectionTable {
  private keng__id: string;
  private connection: Connection;
  private isSelected = false;

  /**
   * @param {Object} json the JSON representation of a ConnectionTable
   * @returns {ConnectionTable} the new ConnectionTable (never null)
   */
  public static create( json: object = {} ): ConnectionTable {
    const connTable = new ConnectionTable();
    connTable.setValues( json );
    return connTable;
  }

  constructor() {
    // nothing to do
  }

  /**
   * @returns {string} the property id
   */
  public getId(): string {
    return this.keng__id;
  }

  /**
   * @returns {Connection} the connection
   */
  public getConnection(): Connection {
    return this.connection;
  }

  /**
   * @param {string} id the property id
   */
  public setId( id?: string ): void {
    this.keng__id = id ? id : null;
  }

  /**
   * @param {Connection} conn the connection
   */
  public setConnection( conn?: Connection ): void {
    this.connection = conn ? conn : null;
  }

  /**
   * @returns {boolean} true if selected
   */
  public get selected(): boolean {
    return this.isSelected;
  }

  /**
   * @param {boolean} selected 'true' if selected
   */
  public set selected( selected: boolean ) {
    this.isSelected = selected;
  }

  /**
   * Set all object values using the supplied View json
   * @param {Object} values
   */
  public setValues(values: object = {}): void {
    Object.assign(this, values);
  }

}
