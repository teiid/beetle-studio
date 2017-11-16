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
 * SchemaInfo model - returned from the komodo rest call.  The type of info will be
 * 'Catalog' or 'Schema'.
 */
export class SchemaInfo {
  private name: string;
  private type: string;
  private schemaNames: string[];

  /**
   * @param {Object} json the JSON representation of a Template
   * @returns {TemplateDefinition} the new TemplateDefinition (never null)
   */
  public static create( json: object = {} ): SchemaInfo {
    const template = new SchemaInfo();
    template.setValues( json );
    return template;
  }

  constructor() {
    // nothing to do
  }

  /**
   * @returns {string} the info name
   */
  public getName(): string {
    return this.name;
  }

  /**
   * @returns {string} the info type
   */
  public getType(): string {
    return this.type;
  }

  /**
   * @returns {string[]} the array of schema Names
   */
  public getSchemaNames(): string[] {
    return this.schemaNames;
  }

  /**
   * @param {string} name the info name
   */
  public setId( name?: string ): void {
    this.name = name ? name : null;
  }

  /**
   * @param {string} type the info type
   */
  public setType( type?: string ): void {
    this.type = type ? type : null;
  }

  /**
   * @param {string[]} schemaNames the array of schema names
   */
  public setSchemaNames( schemaNames?: string[] ): void {
    this.schemaNames = schemaNames ? schemaNames : null;
  }

  /**
   * Set all object values using the supplied Template json
   * @param {Object} values
   */
  public setValues(values: object = {}): void {
    Object.assign(this, values);
  }

}
