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

/**
 * View model
 */
export class View {
  private name: string;
  private connection: Connection;
  private catalogName: string;
  private schemaName: string;
  private isSelected = false;

  constructor() {
    // nothing to do
  }

  /**
   * @returns {string} the table name
   */
  public getName(): string {
    return this.name;
  }

  /**
   * @param {string} name the table name
   */
  public setName( name?: string ): void {
    this.name = name ? name : null;
  }

  /**
   * @returns {Connection} the connection for the table
   */
  public getConnection(): Connection {
    return this.connection;
  }

  /**
   * @param {string} connection the connection for the table
   */
  public setConnection( connection?: Connection ): void {
    this.connection = connection ? connection : null;
  }

  /**
   * @returns {string} the catalog name for the table
   */
  public getCatalogName(): string {
    return this.catalogName;
  }

  /**
   * @param {string} catalogName the connection name for the table
   */
  public setCatalogName( catalogName?: string ): void {
    this.catalogName = catalogName ? catalogName : null;
  }

  /**
   * @returns {string} the schema name for the table
   */
  public getSchemaName(): string {
    return this.schemaName;
  }

  /**
   * @param {string} schemaName the schema name for the table
   */
  public setSchemaName( schemaName?: string ): void {
    this.schemaName = schemaName ? schemaName : null;
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

}
