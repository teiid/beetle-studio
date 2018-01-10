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

import { Input, ViewEncapsulation } from "@angular/core";
import { Component, OnInit } from "@angular/core";
import { LoggerService } from "@core/logger.service";
import { ColumnData } from "@dataservices/shared/column-data.model";
import { DataserviceService } from "@dataservices/shared/dataservice.service";
import { QueryResults } from "@dataservices/shared/query-results.model";
import { RowData } from "@dataservices/shared/row-data.model";
import { Table } from "@dataservices/shared/table.model";
import { LoadingState } from "@shared/loading-state.enum";
import "codemirror/addon/display/placeholder.js";
import "codemirror/addon/selection/active-line.js";
import "codemirror/mode/sql/sql.js";

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: "app-sql-control",
  templateUrl: "./sql-control.component.html",
  styleUrls: ["./sql-control.component.css"]
})
export class SqlControlComponent implements OnInit {

  @Input() public quicklook = false;
  @Input() public selectedViews: Table[] = [];
  @Input() public serviceViews: Table[] = [];
  @Input() public viewSql = "";

  public columns: any[] = [];
  public rows: any[] = [];

  public config = {
    lineNumbers: true,
    mode: "text/x-sql",
    placeholder: "Enter the SQL, then click Submit",
    styleActiveLine: true,
    tabSize: 4,
    theme: "mdn-like" };

  public customClasses = {
    sortAscending: "fa fa-sort-asc",
    sortDescending: "fa fa-sort-desc"
  };

  private dataserviceService: DataserviceService;
  private logger: LoggerService;
  private showResults = false;
  private queryResultsLoading: LoadingState;
  private queryResults: QueryResults;
  private queryMap: Map<string, string> = new Map<string, string>();
  private previousViewName: string;

  constructor( dataserviceService: DataserviceService, logger: LoggerService ) {
    this.dataserviceService = dataserviceService;
    this.logger = logger;
  }

  public ngOnInit(): void {
    this.queryMap.clear();
    this.setQueryText();
    this.queryMap.set(this.viewName, this.queryText);
    this.previousViewName = this.viewName;
    this.submitCurrentQuery();
  }

  /*
   * Handle View selection from the view table
   */
  public onViewSelect( {selected} ): void {
    // Save query for current selection first
    this.queryMap.set(this.previousViewName, this.queryText);

    // View table is single select so use first element
    const view: Table = selected[ 0 ];

    this.selectedViews = [];
    this.selectedViews.push(view);

    this.setQueryText();
    this.previousViewName = this.viewName;
    this.submitCurrentQuery();
  }

  /*
   * Submit the currently entered SQL
   */
  public submitCurrentQuery( ): void {
    this.submitQuery(this.queryText, this.dataserviceService.getSelectedDataservice().getId(), 15, 0);
  }

  /*
   * Determines if the results table should be shown
   */
  public get showResultsTable( ): boolean {
    return this.showResults;
  }

  /**
   * Get the SQL text
   */
  public get queryText( ): string {
    return this.viewSql;
  }

  /**
   * Set the SQL text
   */
  public set queryText( sql: string ) {
    this.viewSql = sql;
  }

  /**
   * Determine if query is running
   */
  public get queryRunning( ): boolean {
    return ( this.queryResultsLoading != null && (this.queryResultsLoading === LoadingState.LOADING) );
  }

  /**
   * Determine if query has run successfully
   */
  public get queryRanValid( ): boolean {
    return ( this.queryResultsLoading != null && (this.queryResultsLoading === LoadingState.LOADED_VALID) );
  }

  /**
   * Determine if query has run but was not successful
   */
  public get queryRanInvalid( ): boolean {
    return ( this.queryResultsLoading != null && (this.queryResultsLoading === LoadingState.LOADED_INVALID) );
  }

  public get viewName(): string {
    return !this.selectedViews ? "" : this.selectedViews[0].getName();
  }

  /*
   * Sets the query text based on the selected dataservice
   */
  public setQueryText( ): void {
    const mapEntry = this.queryMap.get(this.viewName);
    if (mapEntry) {
      this.viewSql = mapEntry;
    } else {
      this.viewSql = "SELECT * FROM " + this.viewName + ";";
    }
  }

  /*
   * Submits the query
   */
  private submitQuery(sqlQuery: string, dataserviceName: string, limit: number, offset: number): void {
    this.queryResultsLoading = LoadingState.LOADING;
    this.queryResults = null;
    const self = this;
    this.dataserviceService
      .queryDataservice(sqlQuery, dataserviceName, limit, offset)
      .subscribe(
        (queryResult) => {
          self.refreshData(queryResult);
          self.queryResultsLoading = LoadingState.LOADED_VALID;
        },
        (error) => {
          self.logger.error("[SqlControlComponent] Error getting query results: %o", error);
          self.queryResultsLoading = LoadingState.LOADED_INVALID;
        }
      );
  }

  /*
   * Refresh the Query results
   * @param {QueryResults} results the results for a query
   */
  private refreshData(results: QueryResults): void {
    this.queryResults = results;
    if (!results) {
      return;
    }

    this.columns.length = 0;
    this.rows.length = 0;

    const columnData: ColumnData[] = results.getColumns();
    const rowData: RowData[] = results.getRows();

    //
    // Define the row data
    //
    let firstTime = true;
    const rowNumHeader = "ROW #";
    // const widths: Map< string, number > = new Map< string, number >();

    for ( let rowIndex = 0; rowIndex < rowData.length; rowIndex++ ) {
      const row = rowData[ rowIndex ];
      const data = row.getData();

      const dataRow = {};
      dataRow[ rowNumHeader ] = rowIndex + 1;

      for (let colIndex = 0; colIndex < data.length; colIndex++) {
        const label = columnData[ colIndex ].getLabel();
        dataRow[ label ] = data[ colIndex ];

        // size column to largest width data of first 50 rows
        // if ( rowIndex < 50 ) {
        //   const value = "" + dataRow[ label ];
        //   const width = value.length;
        //   const labelWidth = label.length
        //
        //   if ( firstTime ) {
        //     const max = Math.max( width, labelWidth );
        //     widths.set( label, max );
        //   } else {
        //     const currVal: number = widths.get( label );
        //     const max = Math.max( width, currVal, labelWidth );
        //     widths.set( label, max );
        //   }
        // }
      }

      this.rows.push( dataRow );
      firstTime = false;
    }

    // setup row number column
    const column = { canAutoResize: true,
                     draggable: false,
                     // flexGrow: rowNumHeader.length,
                     maxWidth: 60,
                     minWidth: 60,
                     name: rowNumHeader,
                     prop: rowNumHeader,
                     resizable: true,
                     sortable: true,
                     width: 60,
                     cellClass: "row-number-column"};
    this.columns.push( column );

    //
    // Setup columns
    //
    for ( let i = 0; i < columnData.length; i++) {
      const colData = columnData[ i ];
      const label = colData.getLabel();
      // const width = widths.get( label );
      const column = { canAutoResize: true,
                       draggable: false,
                       // flexGrow: width,
                       name: label.toUpperCase(),
                       prop: label,
                       resizable: true,
                       sortable: true };
      this.columns.push( column );
    }
  }

}
