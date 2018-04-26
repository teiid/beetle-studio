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

 /*
  *Will contain:
  * column
  * condition ( one of odata.conditions )
  * value
  */
export class OdataWhere {

  private _column: OdataColumn;
  private _condition: string = '';
  private _value: string = '';

  public error: string = null;

  /**
   * @returns column
   */
  public get column(): OdataColumn {
    return this._column;
  }

  public set column(column: OdataColumn) {
    this._column = column;
  }

  /**
   * @returns the condition
   */
  public get condition(): string {
    return this._condition;
  }

  public set condition(condition: string) {
    this._condition = condition;
  }

  /**
   * @returns value
   */
  public get value(): string {
    return this._value;
  }

  public set value(value: string) {
    this._value = value;
  }

}
