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

/**
 * The JDBC table filter model.
 */
export class JdbcTableFilter {
  private dataSourceName: string;
  private catalogFilter = "%";
  private schemaFilter = "%";
  private tableFilter = "%";

  /**
   * @param {Object} json the JSON representation of a JdbcTableFilter
   * @returns {JdbcTableFilter} the new JdbcTableFilter (never null)
   */
  public static create( json: object = {} ): JdbcTableFilter {
    const template = new JdbcTableFilter();
    template.setValues( json );
    return template;
  }

  constructor() {
    // nothing to do
  }

  /**
   * @returns {string} the connection name
   */
  public getConnectionName(): string {
    return this.dataSourceName;
  }

  /**
   * @returns {string} the catalog filter
   */
  public getCatalogFilter(): string {
    return this.catalogFilter;
  }

  /**
   * @returns {string} the schema filter
   */
  public getSchemaFilter(): string {
    return this.schemaFilter;
  }

  /**
   * @returns {string} the table filter
   */
  public getTableFilter(): string {
    return this.tableFilter;
  }

  /**
   * @param {string} name the connection name
   */
  public setConnectionName( name: string ): void {
    this.dataSourceName = name;
  }

  /**
   * @param {string} filter the catalog filter
   */
  public setCatalogFilter( filter?: string ): void {
    this.catalogFilter = filter ? filter : "%";
  }

  /**
   * @param {string} filter the schema filter
   */
  public setSchemaFilter( filter?: string ): void {
    this.schemaFilter = filter ? filter : "%";
  }

  /**
   * @param {string} filter the table filter
   */
  public setTableFilter( filter?: string ): void {
    this.tableFilter = filter ? filter : "%";
  }

  /**
   * Set all object values using the supplied Template json
   * @param {Object} values
   */
  public setValues(values: object = {}): void {
    Object.assign(this, values);
  }

}
