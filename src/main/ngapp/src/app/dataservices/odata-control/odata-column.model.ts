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

export class OdataColumn {

  private _name: string;

  private _type: string;

  private _sort: string;

  /**
   * @returns name
   */
  public get name(): string {
    return this._name;
  }

  /**
   * Sets the name
   */
  public set name(name: string) {
    this._name = name;
  }

  /**
   * @returns type
   */
  public get type(): string {
    return this._type;
  }

  /**
   * Sets the type
   */
  public set type(type: string) {
    this._type = type;
  }

  /**
   * @returns sort
   */
  public get sort(): string {
    return this._sort;
  }

  /**
   * Sets the sort type
   */
  public set sort(sort: string) {
    this._sort = sort;
  }
}
