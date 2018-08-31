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
import { LoadingState } from "@shared/loading-state.enum";
import "codemirror/addon/display/placeholder.js";
import "codemirror/addon/selection/active-line.js";
import "codemirror/mode/sql/sql.js";
import { NgxDataTableConfig, TableConfig } from "patternfly-ng";
import { SqlView } from "@dataservices/shared/sql-view.model";
import { SelectionService } from "@core/selection.service";

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: "app-sql-control",
  templateUrl: "./sql-control.component.html",
  styleUrls: ["./sql-control.component.css"]
})
export class SqlControlComponent implements OnInit {

  @Input() public quicklook = false;
  @Input() public selectedViews: SqlView[] = [];
  @Input() public serviceViews: SqlView[] = [];
  @Input() public viewSql = "";

  public ngxConfig: NgxDataTableConfig;
  public tableConfig: TableConfig;

  public ngxViewConfig: NgxDataTableConfig;
  public viewTableConfig: TableConfig;

  public columns: any[] = [];
  public viewColumns: any[] = [];
  public rows: any[] = [];

  public config = {
    lineNumbers: true,
    mode: "text/x-sql",
    placeholder: "Enter the SQL, then click Submit",
    styleActiveLine: true,
    tabSize: 4,
    theme: "mdn-like" };

  private dataserviceService: DataserviceService;
  private logger: LoggerService;
  private selectionService: SelectionService;
  private showResults = false;
  private queryResultsLoading: LoadingState;
  private queryResults: QueryResults;
  private queryMap: Map<string, string> = new Map<string, string>();
  private previousViewName: string;

  constructor( dataserviceService: DataserviceService, logger: LoggerService,
               selectionService: SelectionService ) {
    this.dataserviceService = dataserviceService;
    this.logger = logger;
    this.selectionService = selectionService;
  }

  public ngOnInit(): void {
    this.queryMap.clear();
    this.setQueryText();
    this.queryMap.set(this.viewName, this.queryText);
    this.previousViewName = this.viewName;
    this.submitCurrentQuery();

    this.viewColumns = [
      {
        draggable: false,
        name: "Views",
        prop: "name",
        resizeable: true,
        sortable: true,
        width: "100"
      }
    ];

    this.ngxConfig = {
      reorderable: true,
      scrollbarH: true,
      scrollbarV: false,
      selectionType: "single",
      sortable: true
    } as NgxDataTableConfig;

    this.tableConfig = {
      // nothing to do
    } as TableConfig;

    this.ngxViewConfig = {
      reorderable: false,
      selected: this.selectedViews,
      selectionType: "'single'",
      sorts: [ { prop: "name", dir: "asc" } ],
    } as NgxDataTableConfig;

    this.viewTableConfig = {
      // nothing to do
    } as TableConfig;
  }

  /*
   * Handle View selection from the view table
   */
  public selectionChange( $event ): void {
    // Save query for current selection first
    this.queryMap.set(this.previousViewName, this.queryText);

    // View table is single select so use first element
    const selected: SqlView[] = $event.selected;
    const view: SqlView = selected[ 0 ];

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
    this.submitQuery(this.queryText, this.selectionService.getSelectedVirtualization().getId(), 15, 0);
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
    return !this.selectedViews ? "" : this.selectedViews[0].name;
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

    for ( let rowIndex = 0; rowIndex < rowData.length; rowIndex++ ) {
      const row = rowData[ rowIndex ];
      const data = row.getData();

      const dataRow = {};
      dataRow[ rowNumHeader ] = rowIndex + 1;

      for (let colIndex = 0; colIndex < data.length; colIndex++) {
        const label = columnData[ colIndex ].getLabel();
        dataRow[ label ] = data[ colIndex ];
      }

      this.rows.push( dataRow );
      firstTime = false;
    }

    // setup row number column
    const column = { canAutoResize: true,
                     draggable: false,
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
    // Setup data columns
    //
    for ( const colData of columnData ) {
      const label = colData.getLabel();
      const col = { canAutoResize: true,
                    draggable: false,
                    name: label.toUpperCase(),
                    prop: label,
                    resizable: true,
                    sortable: true };
      this.columns.push( col );
    }
  }

}
