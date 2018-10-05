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
 * ProjectedColumn model - to hold the column info for projected view columns
 */
export class ProjectedColumn {

  private name: string;
  private type: string;
  public selected = false;

  /**
   * @param {Object} json the JSON representation of ProjectedColumn
   * @returns {ProjectedColumn} the new ProjectedColumn (never null)
   */
  public static create( json: object = {} ): ProjectedColumn {
    const projCol = new ProjectedColumn();
    for (const field of Object.keys(json)) {
      if (field === "name") {
        projCol.setName(json[field]);
      } else if (field === "type") {
        projCol.setType(json[field]);
      } else if (field === "selected") {
        projCol.selected = json[field];
      }
    }
    return projCol;
  }

  constructor() {
    // nothing to do
  }

  /**
   * @returns {string} the column name
   */
  public getName(): string {
    return this.name;
  }

  /**
   * @param {string} name the column name
   */
  public setName( name?: string ): void {
    this.name = name ? name : null;
  }

  /**
   * @returns {string} the column type
   */
  public getType(): string {
    return this.type;
  }

  /**
   * @param {string} type the column type
   */
  public setType( type?: string ): void {
    this.type = type ? type : "";
  }

  /**
   * Determine if the supplied ProjectedColumn is equal to this
   * @param {ProjectedColumn} otherCol the other column
   */
  public isEqual( otherCol: ProjectedColumn ): boolean {
    let equal = false;
    if (this.getName() === otherCol.getName() &&
        this.getType() === otherCol.getType() &&
        this.selected === otherCol.selected ) {
      equal = true;
    }
    return equal;
  }

}
