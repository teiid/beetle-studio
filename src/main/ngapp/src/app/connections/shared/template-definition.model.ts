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

export class TemplateDefinition {
  private keng__id: string;
  private isJdbc: boolean;
  private entries: string[];

  /**
   * @param {Object} json the JSON representation of a Template
   * @returns {TemplateDefinition} the new TemplateDefinition (never null)
   */
  public static create( json: object = {} ): TemplateDefinition {
    const template = new TemplateDefinition();
    template.setValues( json );
    return template;
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
   * @returns {boolean} 'true' if jdbc
   */
  public getJdbc(): boolean {
    return this.isJdbc;
  }

  /**
   * @returns {string[]} the array of entries
   */
  public getEntries(): string[] {
    return this.entries;
  }

  /**
   * @param {string} id the property id
   */
  public setId( id?: string ): void {
    this.keng__id = id ? id : null;
  }

  /**
   * @param {boolean} jdbc 'true' if template is jdbc
   */
  public setJdbc( jdbc?: boolean ): void {
    this.isJdbc = jdbc ? jdbc : null;
  }

  /**
   * @param {string[]} entries the array of entries
   */
  public setEntries( entries?: string[] ): void {
    this.entries = entries ? entries : null;
  }

  /**
   * Set all object values using the supplied Template json
   * @param {Object} values
   */
  public setValues(values: object = {}): void {
    Object.assign(this, values);
  }

}
