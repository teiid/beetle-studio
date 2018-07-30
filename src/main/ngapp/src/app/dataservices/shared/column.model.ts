
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

export class Column {

  private isSelected = false;
  private keng__id: string;
  private Datatype: string;
  private size: number;

  /**
   * @param {Object} json the JSON representation of a Column
   * @returns {Column} the new Column (never null)
   */
  public static create( json: object = {} ): Column {
    const column = new Column();
    column.setValues( json );
    return column;
  }

  constructor() {
    // nothing to do
  }

  /**
   * @returns {string} the column name
   */
  public getName(): string {
    return this.keng__id;
  }

  /**
   * @param {string} name the column name
   */
  public setName( name?: string ): void {
    this.keng__id = name ? name : null;
  }

  /**
   * @returns {string} the column type
   */
  public getDatatype(): string {
    return this.Datatype;
  }

  /**
   * @param {string} name the column type
   */
  public setDatatype( type: string ): void {
    this.Datatype = type;
  }

  /**
   * @returns {number} the column size
   */
  public getSize(): number {
    return this.size;
  }

  /**
   * @param {number} size the column size
   */
  public setSize( size: number ): void {
    this.size = size;
  }

  /**
   * @returns {boolean} 'true' if column isSelected
   */
  public get selected(): boolean {
    return this.isSelected;
  }

  /**
   * @param {boolean} selected the column isSelected state
   */
  public setSelected( selected: boolean ): void {
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
