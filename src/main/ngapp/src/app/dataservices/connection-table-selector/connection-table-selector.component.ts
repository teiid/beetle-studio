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

import { Component, EventEmitter, OnInit, Output, TemplateRef, ViewChild, ViewEncapsulation } from "@angular/core";
import { Connection } from "@connections/shared/connection.model";
import { ConnectionService } from "@connections/shared/connection.service";
import { LoggerService } from "@core/logger.service";
import { JdbcTableSelectorComponent } from "@dataservices/jdbc-table-selector/jdbc-table-selector.component";
import { Table } from "@dataservices/shared/table.model";
import { VdbsConstants } from "@dataservices/shared/vdbs-constants";
import { WizardService } from "@dataservices/shared/wizard.service";
import { LoadingState } from "@shared/loading-state.enum";
import {
  Filter,
  FilterConfig,
  FilterEvent,
  FilterField,
  FilterType,
  NgxDataTableConfig,
  TableConfig,
  ToolbarConfig
} from "patternfly-ng";

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: "app-connection-table-selector",
  templateUrl: "./connection-table-selector.component.html",
  styleUrls: ["./connection-table-selector.component.css"]
})
export class ConnectionTableSelectorComponent implements OnInit {

  private static readonly nameFilterId = "nameFilter";

  @ViewChild("cellTemplate") public cellTemplate: TemplateRef< any >;
  @ViewChild(JdbcTableSelectorComponent) public jdbcTableSelector: JdbcTableSelectorComponent;
  @Output() public selectedTableListUpdated: EventEmitter<void> = new EventEmitter<void>();

  public columnDefinitions: any[];
  public filtersText = "";
  public filterConfig: FilterConfig;
  public ngxConfig: NgxDataTableConfig;
  public tableConfig: TableConfig;
  public toolbarConfig: ToolbarConfig;

  private allConnections: Connection[] = [];
  private filteredConnections: Connection[] = [];

  private connectionService: ConnectionService;
  private wizardService: WizardService;
  private selectedConn: Connection;
  private connectionLoadingState: LoadingState = LoadingState.LOADING;
  private logger: LoggerService;

  constructor( connectionService: ConnectionService, wizardService: WizardService,
               logger: LoggerService ) {
    this.connectionService = connectionService;
    this.wizardService = wizardService;
    this.logger = logger;
  }

  /*
   * Component initialization
   */
  public ngOnInit(): void {
    this.columnDefinitions = [
      {
        cellTemplate: this.cellTemplate,
        comparator: this.connectionComparator,
        draggable: false,
        name: "Connections",
        prop: "name",
        resizeable: false,
        sortable: true,
        width: "300"
      }
    ];

    this.ngxConfig = {
      footerHeight: 24,
      messages: this.connectionsTableMessages,
      selectionType: "single",
    } as NgxDataTableConfig;

    this.filterConfig = {
      fields: [
        {
          id: ConnectionTableSelectorComponent.nameFilterId,
          title: "Name",
          placeholder: "Filter by name...",
          type: FilterType.TEXT
        }
      ] as FilterField[],
      appliedFilters: [],
      resultsCount: this.filteredConnections.length,
      totalCount: this.allConnections.length
    } as FilterConfig;

    this.toolbarConfig = {
      filterConfig: this.filterConfig
    } as ToolbarConfig;

    this.tableConfig = {
      toolbarConfig: this.toolbarConfig
    } as TableConfig;

    // Load the connections
    this.connectionLoadingState = LoadingState.LOADING;
    const self = this;
    this.connectionService
      .getAllConnections()
      .subscribe(
        (conns) => {
          self.allConnections = conns;
          self.filteredConnections = conns;
          self.connectionLoadingState = LoadingState.LOADED_VALID;
          if (self.wizardService.isEdit()) {
            self.initEdit();
          }
        },
        (error) => {
          self.logger.error("[ConnectionTableSelectorComponent] Error getting connections: %o", error);
          self.connectionLoadingState = LoadingState.LOADED_INVALID;
        }
      );
  }

  public filterChanged( $event: FilterEvent ): void {
    this.filtersText = "";

    $event.appliedFilters.forEach( ( filter ) => {
      this.filtersText += filter.field.title + " : " + filter.value + "\n";
    } );

    this.applyFilters( $event.appliedFilters );
  }

  // callback from connection table selection
  public selectionChange( $event ): void {
    const selected: Connection[] = $event.selected;

    // connection table is single select so use first element
    const conn: Connection = selected[ 0 ];

    // only set if schema selection has changed (see setter)
    if ( this.selectedConn == null || this.selectedConn.name !== conn.name ) {
      this.selectedConn = conn;
    }
  }

  /**
   * selector is valid if at least one table is selected.
   * @returns {boolean} the selector status (true if one or more tables selected)
   */
  public valid( ): boolean {
    return this.getSelectedTables().length > 0;
  }

  /**
   * Determine if connections are loading
   */
  public get connectionsLoading( ): boolean {
    return this.connectionLoadingState === LoadingState.LOADING;
  }

  /**
   * Determine if connections are loaded and valid
   */
  public get connectionsLoadedValid( ): boolean {
    return this.connectionLoadingState === LoadingState.LOADED_VALID;
  }

  /**
   * Determine if connections are loaded and invalid
   */
  public get connectionsLoadedInvalid( ): boolean {
    return this.connectionLoadingState === LoadingState.LOADED_INVALID;
  }

  /**
   * Determine if the supplied connection is currently selected.
   * @param {Connection} connection the connection
   * @returns {boolean} true if the connection is selected
   */
  public isConnectionSelected(connection: Connection): boolean {
    return this.selectedConn && this.selectedConn === connection;
  }

  /**
   * Determine if a JDBC connection is currently selected
   * @returns {boolean} true if a JDBC connection is selected
   */
  public hasJdbcConnectionSelected(): boolean {
    return (this.selectedConn && this.selectedConn.isJdbc());
  }

  /**
   * Determine if a non-JDBC connection is currently selected
   * @returns {boolean} true if a non-JDBC connection is selected
   */
  public hasNonJdbcConnectionSelected(): boolean {
    return (this.selectedConn && !this.selectedConn.isJdbc());
  }

  /**
   * Determine if anything is selected
   * @returns {boolean} true if a connection is selected
   */
  public hasSelectedConnection( ): boolean {
    return this.selectedConn != null;
  }

  /**
   * Get the currently selected Connection
   * @returns {Connection} the current selection (may be null)
   */
  public get selectedConnection( ): Connection {
    return this.selectedConn;
  }

  /**
   * Set the currently selected Connection
   * @param {Connection} conn the current selection (may be null)
   */
  public set selectedConnection(conn: Connection) {
    this.selectedConn = conn;

    // Set the specific selector with the current connection
    if (this.jdbcTableSelector) {
      if (this.selectedConn && this.selectedConn.isJdbc()) {
        this.jdbcTableSelector.setConnection(this.selectedConnection);
      } else {
        this.jdbcTableSelector.setConnection(null);
      }
    }
  }

  /*
   * Return all available Connections
   * @returns {Connection[]} the list of all Connections
   */
  public getAllConnections(): Connection[] {
    return this.allConnections;
  }

  /**
   * Responds to table added event from the table selector.
   * The table is added to the accumulator list.
   * @param {Table} addedTable the table to add to the accumulator list
   */
  public onTableSelectionAdded(addedTable: Table): void {
    this.wizardService.addToWizardSelectionTables(addedTable);
    this.selectedTableListUpdated.emit();
  }

  /**
   * Responds to table remove event from the table selector.
   * The table is removed from the accumulator list, if found.
   * @param {Table} removedTable the table to remove from the accumulator list
   */
  public onTableSelectionRemoved(removedTable: Table): void {
    const wasRemoved = this.wizardService.removeFromWizardSelectionTables(removedTable);
    if (wasRemoved) {
      this.selectedTableListUpdated.emit();
      this.jdbcTableSelector.deselectTable(removedTable);
    }
  }

  /*
   * Determine if any tables are currently selected
   * @returns {boolean} true if one or more tables are selected
   */
  public get hasSelectedTables(): boolean {
    return this.getSelectedTables().length > 0;
  }

  /*
   * Return all currently selected Tables
   * @returns {Table[]} the list of selected Tables
   */
  public getSelectedTables(): Table[] {
    return this.wizardService.getWizardSelectedTables();
  }

  public get connectionsTableMessages(): { emptyMessage: string; totalMessage: string | string } {
    const numAll = this.allConnections.length;
    const numFiltered = this.filteredConnections.length;
    let msg: string;

    if ( numAll === numFiltered ) {
      if ( this.filtersText.length === 0 ) {
        msg = numAll === 1 ? "connection" : "connections";
      } else {
        msg = numAll === 1 ? "matched connection" : "matched connections";
      }
    } else {
      msg = numFiltered === 1 ? "matched connection" : "matched connections";
    }

    return {
      // message shows in an empty row in table
      emptyMessage: "",

      // footer total message
      totalMessage: msg
    };
  }

  /**
   * Called when the table is sorted.
   * @param {string} thisName the connection name being sorted
   * @param {string} thatName the connection name being compared to
   * @returns {number} -1 if less than, 0 if equal, or 1 if greater than
   */
  public connectionComparator( thisName: string,
                               thatName: string ): number {
    return thisName.localeCompare( thatName );
  }

  private applyFilters( filters: Filter[] ): void {
    this.filteredConnections = [];

    if ( filters && filters.length > 0 ) {
      this.allConnections.forEach( ( item ) => {
        if ( this.matchesFilters( item, filters ) ) {
          this.filteredConnections.push( item );
        }
      } );
    } else {
      this.filteredConnections = this.allConnections;
    }

    this.toolbarConfig.filterConfig.resultsCount = this.filteredConnections.length;
  }

  private matchesFilter( item: any,
                         filter: Filter ): boolean {
    let matches = true;

    if ( filter.field.id === ConnectionTableSelectorComponent.nameFilterId ) {
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

  /**
   * Initialization for edit mode
   */
  private initEdit(): void {
    // Updates current connections on wizardService
    this.wizardService.setCurrentConnections(this.allConnections);

    // Initialize the selected tables in the wizard service
    this.wizardService.clearWizardSelectedTables();
    const srcTables: string[] = this.wizardService.getSelectedDataservice().getServiceViewTables();
    for ( const tableStr of srcTables ) {
      const subParts = tableStr.split(".");
      const connectionName = subParts[0].replace(VdbsConstants.SOURCE_VDB_SUFFIX, "");
      const tableName = subParts[1];
      let conn = this.wizardService.getCurrentConnection(connectionName);
      if (!conn) {
        conn = new Connection();
        conn.setId(connectionName);
      }
      const table: Table = new Table();
      table.setName(tableName);
      table.setConnection(conn);
      this.wizardService.addToWizardSelectionTables(table);
    }
    this.selectedTableListUpdated.emit();

  }

}
