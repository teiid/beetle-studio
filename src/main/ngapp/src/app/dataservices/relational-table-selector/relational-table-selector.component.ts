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

import { Component, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from "@angular/core";
import { Input } from "@angular/core";
import { EventEmitter } from "@angular/core";
import { Output } from "@angular/core";
import { ConnectionTable } from "@connections/shared/connection-table.model";
import { Connection } from "app/connections/shared/connection.model";
import { ConnectionService } from "app/connections/shared/connection.service";
import { LoggerService } from "app/core/logger.service";
import { TableSelector } from "app/dataservices/shared/table-selector";
import { WizardService } from "app/dataservices/shared/wizard.service";
import { LoadingState } from "app/shared/loading-state.enum";
import {
  Filter,
  FilterConfig, FilterField, FilterType, NgxDataTableConfig, TableConfig, TableEvent,
  ToolbarConfig
} from "patternfly-ng";

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: "app-relational-table-selector",
  templateUrl: "./relational-table-selector.component.html",
  styleUrls: ["./relational-table-selector.component.css"]
})

export class RelationalTableSelectorComponent implements OnInit, TableSelector {

  private static readonly tableFilterId = "tableFilter";

  @ViewChild("tableCellTemplate") public tableCellTemplate: TemplateRef< any >;
  @Input() public connection: Connection;
  @Output() public tableSelectionAdded: EventEmitter<ConnectionTable> = new EventEmitter<ConnectionTable>();
  @Output() public tableSelectionRemoved: EventEmitter<ConnectionTable> = new EventEmitter<ConnectionTable>();

  public tableColumns: any[];
  public tableFiltersText = "";
  public tableFilterConfig: FilterConfig;
  public ngxTableConfig: NgxDataTableConfig;
  public tableTableConfig: TableConfig;
  public tableToolbarConfig: ToolbarConfig;

  public selectedAllRows = false;

  private connectionService: ConnectionService;
  private wizardService: WizardService;
  private logger: LoggerService;
  private tables: ConnectionTable[] = [];
  private filteredTables: ConnectionTable[] = [];
  private tableFilter = "";
  private tableLoadingState: LoadingState = LoadingState.LOADING;

  constructor(connectionService: ConnectionService, wizardService: WizardService, logger: LoggerService ) {
    this.connectionService = connectionService;
    this.wizardService = wizardService;
    this.logger = logger;
  }

  public ngOnInit(): void {
    this.tableColumns = [
      {
        cellTemplate: this.tableCellTemplate,
        comparator: "nameComparator",
        draggable: false,
        name: "Tables",
        prop: "keng__id",
        resizeable: false,
        sortable: true,
        width: "300"
      }
    ];

    this.ngxTableConfig = {
      footerHeight: 24,
      messages: this.tableTableMessages,
      selectionType: "checkbox",
    } as NgxDataTableConfig;

    this.tableFilterConfig = {
      fields: [
        {
          id: RelationalTableSelectorComponent.tableFilterId,
          title: "Name",
          placeholder: "Filter by name...",
          type: FilterType.TEXT
        }
      ] as FilterField[],
      appliedFilters: [],
      resultsCount: this.filteredTables.length,
      totalCount: this.tables.length
    } as FilterConfig;

    this.tableToolbarConfig = {
      filterConfig: this.tableFilterConfig
    } as ToolbarConfig;

    this.tableTableConfig = {
      showCheckbox: true,
      toolbarConfig: this.tableToolbarConfig
    } as TableConfig;

    // Load the connection tables for a connection
    this.setConnection(this.connection);
  }

  /*
   * Set the connection for this relational table selector.  Setting the connection triggers loading
   * of the tables.
   * @param {Connection} conn the relational connection
   */
  public setConnection(conn: Connection): void {
    // Load the tables for the connection
    this.tables = [];
    this.filteredTables = [];
    this.selectedAllRows = false;
    this.tableLoadingState = LoadingState.LOADING;
    const self = this;
    this.connectionService
      .getConnectionTables(conn.getId())
      .subscribe(
        (connTables) => {
          for ( const table of connTables ) {
            table.setConnection(conn);
            self.tables.push(table);
            self.filteredTables.push(table);
          }
          // select any of the tables that are already selected
          self.setInitialTableSelections();
          self.tableLoadingState = LoadingState.LOADED_VALID;
        },
        (error) => {
          self.logger.error("[RelationalTableSelectorComponent] Error getting tables: %o", error);
          self.tableLoadingState = LoadingState.LOADED_INVALID;
        }
      );
  }

  /**
   * Called when the table is sorted.
   * @param {string} thisName the name being sorted
   * @param {string} thatName the name being compared to
   * @returns {number} -1 if less than, 0 if equal, or 1 if greater than
   */
  public nameComparator( thisName: string,
                         thatName: string ): number {
    return thisName.localeCompare( thatName );
  }

  /**
   * Determine if tables are loading
   */
  public get tablesLoading( ): boolean {
    return this.tableLoadingState === LoadingState.LOADING;
  }

  /**
   * Determine if tables are loaded, valid and not empty
   */
  public get tablesLoadedValidNotEmpty( ): boolean {
    return (this.tableLoadingState === LoadingState.LOADED_VALID) && this.tables.length > 0;
  }

  /**
   * Determine if tables are loaded, valid but empty
   */
  public get tablesLoadedValidEmpty( ): boolean {
    return (this.tableLoadingState === LoadingState.LOADED_VALID) && this.tables.length === 0;
  }

  /**
   * Determine if tables are loaded and invalid
   */
  public get tablesLoadedInvalid( ): boolean {
    return this.tableLoadingState === LoadingState.LOADED_INVALID;
  }

  public get tableTableMessages(): { emptyMessage: string; totalMessage: string | string } {
    const numAll = this.tables.length;
    const numFiltered = this.filteredTables.length;
    let msg: string;

    if ( numAll === numFiltered ) {
      if ( this.tableFilter.length === 0 ) {
        msg = numAll === 1 ? "table" : "tables";
      } else {
        msg = numAll === 1 ? "matched table" : "matched tables";
      }
    } else {
      msg = numFiltered === 1 ? "matched table" : "matched tables";
    }

    return {
      // message shows in an empty row in table
      emptyMessage: "",

      // footer total message
      totalMessage: msg
    };
  }

  /**
   * Callback when key is pressed in table column filter.
   */
  public tableFilterChanged( $event ): void {
    this.tableFiltersText = "";

    $event.appliedFilters.forEach( ( filter ) => {
      this.tableFiltersText += filter.field.title + " : " + filter.value + "\n";
    } );

    this.applyTableFilters( $event.appliedFilters );
  }

  /*
   * Get all tables
   * @returns {ConnectionTable[]} the current tables for the selected schema
   */
  public getTables(): ConnectionTable[] {
    return this.tables;
  }

  /*
   * Determine if any tables are currently selected
   * @returns {boolean} true if one or more tables are selected
   */
  public hasSelectedTables(): boolean {
    for ( const table of this.tables ) {
      if ( table.selected ) {
        return true;
      }
    }

    return false;
  }

  /*
   * Get the array of currently selected ConnectionTables
   * @returns {ConnectionTable[]} the array of selected ConnectionTables
   */
  public getSelectedTables(): ConnectionTable[] {
    return this.tables.filter( ( table ) => table.selected );
  }

  /*
   * Handler for changes in table selection
   */
  public selectedTableChanged( $event: TableEvent ): void {
    const table: ConnectionTable = $event.row;

    if ( table ) {
      if ( table.selected ) {
        this.tableSelectionAdded.emit( table );
      } else {
        this.tableSelectionRemoved.emit( table );
      }
    } else {
      if ( $event.selectedRows.length === 0 ) {
        this.tables.forEach( ( tbl ) => {
          this.tableSelectionRemoved.emit( tbl );
        } );
      } else {
        this.tables.forEach( ( tbl ) => {
          this.tableSelectionAdded.emit( tbl );
        } );
      }
    }
  }

  /**
   * Deselects the table if one with a matching name and connection is currently selected
   * @param {ConnectionTable} table
   */
  public deselectTable(table: ConnectionTable): void {
    const connName = table.getConnection().getId();
    const tableName = table.getId();

    for (const theTable of this.tables) {
      const theConnName = theTable.getConnection().getId();
      const theTableName = theTable.getId();
      if (theConnName === connName && theTableName === tableName) {
        theTable.selected = false;

        // need to set column header checkbox state
        let enable = true;

        for ( const filteredTable of this.filteredTables ) {
          if ( !filteredTable.selected ) {
            enable = false;
            break;
          }
        }

        if ( this.selectedAllRows !== enable ) {
          this.selectedAllRows = enable;
        }

        break;
      }
    }
  }

  private applyTableFilters( filters: Filter[] ): void {
    this.filteredTables = [];

    if ( filters && filters.length > 0 ) {
      this.tables.forEach( ( item ) => {
        if ( this.matchesFilters( item, filters ) ) {
          this.filteredTables.push( item );
        }
      } );
    } else {
      this.filteredTables = this.tables;
    }

    this.tableToolbarConfig.filterConfig.resultsCount = this.filteredTables.length;
  }

  private isSelected( selectedTables: ConnectionTable[],
                      table: ConnectionTable ): boolean {
    for ( const selected of selectedTables ) {
      if ( selected.getId() === table.getId() ) {
        return true;
      }
    }

    return false;
  }

  private matchesFilter( item: any,
                         filter: Filter ): boolean {
    let matches = true;

    if ( filter.field.id === RelationalTableSelectorComponent.tableFilterId ) {
      const pattern = "^" + filter.value.replace( "*", ".*" );
      matches = item.name.match( pattern ) !== null;
    }

    return matches;
  }

  private matchesFilters( item: any,
                          filters: Filter[] ): boolean {
    let matches = true;

    filters.forEach( ( filter ) => {
      if ( !this.matchesFilter( item, filter ) ) {
        matches = false;
        return matches;
      }
    });

    return matches;
  }

  private setInitialTableSelections(): void {
    let enableSelectAll = true;

    for ( const table of this.tables ) {
      const tableName = table.getId();
      const connName = table.getConnection().getId();

      for ( const initialTable of this.wizardService.getSelectedConnectionTables() ) {
        const iTableName = initialTable.getId();
        const iConnName = initialTable.getConnection().getId();
        if (iConnName === connName && iTableName === tableName ) {
          table.selected = true;
          break;
        }
      }

      if ( !table.selected ) {
        enableSelectAll = false;
      }
    }

    this.selectedAllRows = enableSelectAll;
  }

}
