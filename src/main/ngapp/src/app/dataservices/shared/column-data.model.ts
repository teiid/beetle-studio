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
 * The ColumnData model
 */
export class ColumnData {

  private name: string;
  private label: string;
  private type: string;

  /**
   * Constructor
   * @param {Object} json the JSON representation of ColumnData
   */
  constructor(json: object = {}) {
    for (const field of Object.keys(json)) {
      this[field] = json[field];
    }
  }

  /**
   * @returns {string} the column name
   */
  public getName( ): string {
    return this.name;
  }

  /**
   * @returns {string} the column label
   */
  public getLabel( ): string {
    return this.label;
  }

  /**
   * @returns {string} the column type
   */
  public getType( ): string {
    return this.type;
  }

}
