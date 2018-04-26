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

import { OdataColumn } from "@dataservices/odata-control/odata-column.model";

export class OdataEntity {

  private _name: string;

  /* The available columns for the entity */
  private _columns: Array<OdataColumn> = [];

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
   * @returns columns
   */
  public get columns(): OdataColumn[] {
    return this._columns;
  }

  /**
   * Sets the columns
   */
  public set columns(columns: OdataColumn[]) {
    this._columns = columns;
  }
}
