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

import { ColumnData } from "@dataservices/shared/column-data.model";
import { RowData } from "@dataservices/shared/row-data.model";

/**
 * QueryResults model
 */
export class QueryResults {

  private columns: ColumnData[] = [];
  private rows: RowData[] = [];

  /**
   * Constructor
   * @param {object} json the representation of the QueryResults
   */
  constructor(json: object = {}) {
    for (const field of Object.keys(json)) {
      if (field === "columns") {
        const jsonColumns = json[field];
        const cols: ColumnData[] = [];
        for (const arr of jsonColumns) {
          const col: ColumnData = new ColumnData(arr);
          cols.push(col);
        }
        this.setColumns(cols);
      } else if (field === "rows") {
        const jsonRows = json[field];
        const rows: RowData[] = [];
        for (const arr of jsonRows) {
          const row: RowData = new RowData(arr);
          rows.push(row);
        }
        this.setRows(rows);
      }
    }
  }

  /**
   * @returns {ColumnData[]} the column data
   */
  public getColumns(): ColumnData[] {
    return this.columns;
  }

  /**
   * @param {ColumnData[]} columns the column data (optional)
   */
  public setColumns( columns?: ColumnData[] ): void {
    this.columns = columns ? columns : null;
  }

  /**
   * @returns {RowData[]} the row data
   */
  public getRows(): RowData[] {
    return this.rows;
  }

  /**
   * @param {RowData[]} rows the row data (optional)
   */
  public setRows( rows?: RowData[] ): void {
    this.rows = rows ? rows : null;
  }

}
