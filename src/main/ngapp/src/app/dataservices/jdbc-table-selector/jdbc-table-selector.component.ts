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

import { Component, OnInit } from "@angular/core";
import { EventEmitter } from "@angular/core";
import { Output } from "@angular/core";
import { Input } from "@angular/core";
import { Connection } from "@connections/shared/connection.model";
import { ConnectionService } from "@connections/shared/connection.service";
import { JdbcTableFilter } from "@connections/shared/jdbc-table-filter.model";
import { SchemaInfo } from "@connections/shared/schema-info.model";
import { LoggerService } from "@core/logger.service";
import { CatalogSchema } from "@dataservices/shared/catalog-schema.model";
import { TableSelector } from "@dataservices/shared/table-selector";
import { Table } from "@dataservices/shared/table.model";
import { WizardService } from "@dataservices/shared/wizard.service";
import { LoadingState } from "@shared/loading-state.enum";

@Component({
  selector: "app-jdbc-table-selector",
  templateUrl: "./jdbc-table-selector.component.html",
  styleUrls: ["./jdbc-table-selector.component.css"]
})

export class JdbcTableSelectorComponent implements OnInit, TableSelector {

  @Input() public connection: Connection;
  @Output() public tableSelectionAdded: EventEmitter<Table> = new EventEmitter<Table>();
  @Output() public tableSelectionRemoved: EventEmitter<Table> = new EventEmitter<Table>();

  public selectedAllRows = false;

  public readonly customClasses = {
    sortAscending: "fa fa-sort-asc",
    sortDescending: "fa fa-sort-desc"
  };

  private connectionService: ConnectionService;
  private wizardService: WizardService;
  private logger: LoggerService;
  private schemas: CatalogSchema[] = [];
  private filteredSchemas: CatalogSchema[] = [];
  private schemaFilter = "";
  private tables: Table[] = [];
  private filteredTables: Table[] = [];
  private tableFilter = "";
  private currentSchema: CatalogSchema = null;
  private schemaLoadingState: LoadingState = LoadingState.LOADING;
  private tableLoadingState: LoadingState = LoadingState.LOADING;

  constructor(connectionService: ConnectionService, wizardService: WizardService, logger: LoggerService ) {
    this.connectionService = connectionService;
    this.wizardService = wizardService;
    this.logger = logger;
  }

  public ngOnInit(): void {
    // Load the schema info for a connection
    this.setConnection(this.connection);
  }

  /*
   * Set the connection for this jdbc table selector
   * @param {Connection} conn the jdbc connection
   */
  public setConnection(conn: Connection): void {
    this.clearSchemas();
    this.clearTables();
    if (conn && conn.isJdbc()) {
      this.connection = conn;
      // Load the schema info for a connection
      this.schemaLoadingState = LoadingState.LOADING;
      const self = this;
      this.connectionService
        .getConnectionSchemaInfos(this.connection.getId())
        .subscribe(
          (infos) => {
            self.generateSchemaNames(infos);
            self.schemaLoadingState = LoadingState.LOADED_VALID;
          },
          (error) => {
            self.logger.error("[JdbcTableSelectorComponent] Error getting schemas: %o", error);
            self.schemaLoadingState = LoadingState.LOADED_INVALID;
          }
        );
    } else {
      this.schemaLoadingState = LoadingState.LOADING;
    }
  }

  public clearSchemas(): void {
    this.schemas = [];
    this.filteredSchemas = [];
    this.currentSchema = null;
  }

  public clearTables(): void {
    this.tables = [];
    this.filteredTables = [];
    this.tableLoadingState = LoadingState.LOADING;
  }

  // callback from schema selection in datatable
  public onSchemaSelect( { selected }): void {
    // schema table is single select so use first element
    const schema: CatalogSchema = selected[ 0 ];

    // only set if schema selection has changed (see setter)
    if ( this.hasSelectedSchema ) {
      if ( this.selectedSchema.getDisplayName() !== schema.getDisplayName() ) {
        this.selectedSchema = schema;
      }
    } else {
      this.selectedSchema = schema;
    }
  }

  /*
   * Determines if the provided schema is selected
   * @param {CatalogSchema} schema the CatalogSchema to check
   */
  public isSchemaSelected(schema: CatalogSchema): boolean {
    return schema === this.currentSchema;
  }

  /*
   * Returns the currently selected schema.
   * @returns {CatalogSchema} the selected schema
   */
  public get selectedSchema( ): CatalogSchema {
    return this.currentSchema;
  }

  public set selectedSchema( schema: CatalogSchema ) {
    this.currentSchema = schema;

    const filterInfo = new JdbcTableFilter();
    filterInfo.setConnectionName(this.connection.getId());
    filterInfo.setCatalogFilter(schema.getCatalogName());
    filterInfo.setSchemaFilter(schema.getName());
    filterInfo.setTableFilter("%");
    this.loadTablesForSchema(filterInfo);
  }

  /*
   * Returns the currently selected schema.
   * @returns {CatalogSchema} the selected schema
   */
  public get hasSelectedSchema( ): boolean {
    return this.currentSchema != null;
  }

  /**
   * Determine if schemas are loading
   */
  public get schemasLoading( ): boolean {
    return this.schemaLoadingState === LoadingState.LOADING;
  }

  /**
   * Determine if schemas are loaded, valid and not empty
   */
  public get schemasLoadedValidNotEmpty( ): boolean {
    return (this.schemaLoadingState === LoadingState.LOADED_VALID) && this.schemas.length > 0;
  }

  /**
   * Determine if schemas are loaded, valid but empty
   */
  public get schemasLoadedValidEmpty( ): boolean {
    return (this.schemaLoadingState === LoadingState.LOADED_VALID) && this.schemas.length === 0;
  }

  /**
   * Determine if schemas are loaded and invalid
   */
  public get schemasLoadedInvalid( ): boolean {
    return this.schemaLoadingState === LoadingState.LOADED_INVALID;
  }

  /**
   * Callback when key is pressed in schema column filter.
   */
  public schemaFilterChanged( event: any ): void {
    this.schemaFilter = event.target.value;

    if ( this.schemaFilter.length !== 0 ) {
      this.schemaFilter = "^" + this.schemaFilter.replace( "*", ".*" );
    }

    this.filteredSchemas = this.schemas.filter( ( schema ) => schema.getDisplayName().match( this.schemaFilter ) != null );
  }

  public get schemaTableMessages(): { emptyMessage: string; totalMessage: string | string } {
    const numAll = this.schemas.length;
    const numFiltered = this.filteredSchemas.length;
    let msg: string;

    if ( numAll === numFiltered ) {
      if ( this.schemaFilter.length === 0 ) {
        msg = numAll === 1 ? "schema" : "schemas";
      } else {
        msg = numAll === 1 ? "matched schema" : "matched schemas";
      }
    } else {
      msg = numFiltered === 1 ? "matched schema" : "matched schemas";
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
   * @param {string} thisName the name being sorted
   * @param {string} thatName the name being compared to
   * @returns {number} -1 if less than, 0 if equal, or 1 if greater than
   */
  public nameComparator( thisName: string,
                         thatName: string ): number {
    return thisName.localeCompare( thatName );
  }

  /*
   * Get all schemas
   * @returns {CatalogSchema[]} the array of schema
   */
  public getSchemas(): CatalogSchema[] {
    return this.schemas;
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
  public tableFilterChanged( event: any ): void {
    this.tableFilter = event.target.value;

    if ( this.tableFilter.length !== 0 ) {
      this.tableFilter = "^" + this.tableFilter.replace( "*", ".*" );
    }

    this.filteredTables = this.tables.filter( ( table ) => table.getName().match( this.tableFilter ) != null );
  }

  /*
   * Get all tables
   * @returns {Table[]} the current tables for the selected schema
   */
  public getTables(): Table[] {
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
   * Get the array of currently selected Tables
   * @returns {Table[]} the array of selected Tables
   */
  public getSelectedTables(): Table[] {
    return this.tables.filter( ( table ) => table.selected );
  }

  public selectAllTables(): void {
    this.selectedAllRows = !this.selectedAllRows;
    const self = this;

    this.filteredTables.forEach( ( table ) => {
      if ( table.selected !== self.selectedAllRows ) {
        self.selectedTableChanged( table );
      }
    } );
  }

  /*
   * Handler for changes in table selection
   */
  public selectedTableChanged( table: Table ): void {
    table.selected = !table.selected;

    if ( table.selected ) {
      this.tableSelectionAdded.emit(table);

      // check column header checkbox if all are selected
      if ( !this.selectedAllRows ) {
        let selectAll = true;

        for ( const tbl of this.filteredTables ) {
          if ( !tbl.selected ) {
            selectAll = false;
          }
        }

        if ( selectAll ) {
          this.selectedAllRows = true;
        }
      }
    } else {
      this.tableSelectionRemoved.emit(table);

      // uncheck column header checkbox if needed
      if ( this.selectedAllRows ) {
        this.selectedAllRows = false;
      }
    }
  }

  /**
   * Deselects the table if one with a matching name and connection is currently selected
   * @param {Table} table
   */
  public deselectTable(table: Table): void {
    const connName = table.getConnection().getId();
    const tableName = table.getName();

    for (const theTable of this.tables) {
      const theConnName = theTable.getConnection().getId();
      const theTableName = theTable.getName();
      if (theConnName === connName && theTableName === tableName) {
        theTable.selected = false;
        break;
      }
    }
  }

  private isSelected( selectedTables: Table[],
                      table: Table ): boolean {
    for ( const selected of selectedTables ) {
      if ( selected.getName() === table.getName() ) {
        return true;
      }
    }

    return false;
  }

  /*
   * Builds the array of CatalogSchema items from the SchemaInfo coming from
   * the Komodo rest call
   * @param {SchemaInfo[]} infos the array of SchemaInfo from komodo
   */
  private generateSchemaNames(infos: SchemaInfo[]): void {
    for (const info of infos) {
      const infoName = info.getName();
      const infoType = info.getType();
      const schemaNames = info.getSchemaNames();
      if (infoType === "Catalog") {
        if (schemaNames && schemaNames.length > 0) {
          for (const sName of schemaNames) {
            const item: CatalogSchema = new CatalogSchema();
            item.setName(sName);
            item.setType("Schema");
            item.setCatalogName(infoName);
            this.schemas.push(item);
            this.filteredSchemas.push(item);
          }
        } else {
          const item: CatalogSchema = new CatalogSchema();
          item.setName(infoName);
          item.setType("Catalog");
          this.schemas.push(item);
          this.filteredSchemas.push(item);
        }
      } else if (infoType === "Schema") {
        const item: CatalogSchema = new CatalogSchema();
        item.setName(infoName);
        item.setType("Schema");
        this.schemas.push(item);
        this.filteredSchemas.push(item);
      }
    }
  }

  /*
   * Populates tables array, given the supplied JdbcTableFilter
   * @para {JdbcTableFilter} tableFilter the filters for getting tables
   */
  private loadTablesForSchema(tableFilter: JdbcTableFilter): void {
    // Load the table names for the selected Connection and Schema
    this.tables = [];
    this.filteredTables = [];
    this.tableLoadingState = LoadingState.LOADING;
    const self = this;
    this.connectionService
      .getJdbcConnectionTables(tableFilter)
      .subscribe(
        (tableNames) => {
          for ( const tName of tableNames ) {
            const table = new Table();
            table.setName(tName);
            table.setConnection(self.connection);
            table.setCatalogName(self.selectedSchema.getCatalogName());
            table.setSchemaName(self.selectedSchema.getName());
            self.tables.push(table);
            self.filteredTables.push(table);
          }
          // select any of the tables that are already selected
          self.setInitialTableSelections();
          self.tableLoadingState = LoadingState.LOADED_VALID;
        },
        (error) => {
          self.logger.error("[JdbcTableSelectorComponent] Error getting tables: %o", error);
          self.tableLoadingState = LoadingState.LOADED_INVALID;
        }
      );
  }

  private setInitialTableSelections(): void {
    for ( const table of this.tables ) {
      // const catName = table.getCatalogName();
      // const schemaName = table.getSchemaName();
      const tableName = table.getName();
      const connName = table.getConnection().getId();
      for ( const initialTable of this.wizardService.getWizardSelectedTables() ) {
        // const iCatName = initialTable.getCatalogName();
        // const iSchemaName = initialTable.getSchemaName();
        const iTableName = initialTable.getName();
        const iConnName = initialTable.getConnection().getId();
        if (iConnName === connName && iTableName === tableName ) {
          table.selected = true;
          break;
        }
      }
    }
  }

}
