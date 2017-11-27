import { Component, OnInit } from "@angular/core";
import { LoggerService } from "@core/logger.service";
import { ColumnData } from "@dataservices/shared/column-data.model";
import { DataserviceService } from "@dataservices/shared/dataservice.service";
import { QueryResults } from "@dataservices/shared/query-results.model";
import { RowData } from "@dataservices/shared/row-data.model";
import { LoadingState } from "@shared/loading-state.enum";

@Component({
  selector: "app-sql-control",
  templateUrl: "./sql-control.component.html",
  styleUrls: ["./sql-control.component.css"]
})
export class SqlControlComponent implements OnInit {

  private dataserviceService: DataserviceService;
  private logger: LoggerService;
  private showResults = false;
  private queryResultsLoading: LoadingState;
  private queryTxt: string;
  private queryResults: QueryResults;
  private data: any[] = [];

  constructor( dataserviceService: DataserviceService, logger: LoggerService ) {
    this.dataserviceService = dataserviceService;
    this.logger = logger;
  }

  public ngOnInit(): void {
    this.queryTxt = this.getDataserviceInitialQueryText();
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
    return this.queryTxt;
  }

  /**
   * Set the SQL text
   */
  public set queryText( sql: string ) {
    this.queryTxt = sql;
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

  /*
  * the selected data service query text
  */
  private getDataserviceInitialQueryText(): string {
    const dataservice = this.dataserviceService.getSelectedDataservice();
    const modelName = dataservice.getServiceViewModel();
    const serviceView = dataservice.getServiceViewName();

    if ( !modelName || !serviceView ) {
      return "SELECT * FROM ";
    }

    return "SELECT * FROM " + modelName + "." + serviceView + ";";
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

    const columns: ColumnData[] = results.getColumns();
    const rows: RowData[] = results.getRows();

    //
    // Get the column titles
    //
    const columnTitles = [];
    for ( const column of columns ) {
      const colLabel: string = column.getLabel();
      columnTitles.push(colLabel);
    }

    //
    // Define the row data
    //
    this.data = [];
    let rowData;
    for ( const row of rows ) {
      rowData = row.getData();
      const dataRow = {};
      for (let i = 0; i < rowData.length; i++) {
        dataRow[columnTitles[i]] = rowData[i];
      }
      this.data.push(dataRow);
    }
  }

}
