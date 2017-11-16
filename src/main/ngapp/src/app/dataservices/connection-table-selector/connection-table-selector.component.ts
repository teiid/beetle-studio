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

import { ViewChild } from "@angular/core";
import { Output } from "@angular/core";
import { EventEmitter } from "@angular/core";
import { Component, OnInit } from "@angular/core";
import { Connection } from "@connections/shared/connection.model";
import { ConnectionService } from "@connections/shared/connection.service";
import { LoggerService } from "@core/logger.service";
import { JdbcTableSelectorComponent } from "@dataservices/jdbc-table-selector/jdbc-table-selector.component";
import { Table } from "@dataservices/shared/table.model";
import { LoadingState } from "@shared/loading-state.enum";

@Component({
  selector: "app-connection-table-selector",
  templateUrl: "./connection-table-selector.component.html",
  styleUrls: ["./connection-table-selector.component.css"]
})
export class ConnectionTableSelectorComponent implements OnInit {

  @Output() public tableSelectionChanged: EventEmitter<void> = new EventEmitter<void>();

  @ViewChild(JdbcTableSelectorComponent) public jdbcTableSelector: JdbcTableSelectorComponent;

  private connectionService: ConnectionService;
  private allConnections: Connection[] = [];
  private selectedConn: Connection;
  private connectionLoadingState: LoadingState = LoadingState.LOADING;
  private logger: LoggerService;

  constructor( connectionService: ConnectionService, logger: LoggerService ) {
    this.connectionService = connectionService;
    this.logger = logger;
  }

  /*
   * Component initialization
   */
  public ngOnInit(): void {
    // Load the connections
    this.connectionLoadingState = LoadingState.LOADING;
    const self = this;
    this.connectionService
      .getAllConnections()
      .subscribe(
        (conns) => {
          self.allConnections = conns;
          self.connectionLoadingState = LoadingState.LOADED_VALID;
        },
        (error) => {
          self.logger.error("[ConnectionTableSelectorComponent] Error getting connections: %o", error);
          self.connectionLoadingState = LoadingState.LOADED_INVALID;
        }
      );
  }

  /**
   * Toggles the selection
   * @param {Connection} connection the connection whose selection changed
   */
  public toggleConnectionSelected(connection: Connection): void {
    // Connection currently selected, so deselect it
    if (this.isConnectionSelected(connection)) {
      this.selectedConn = null;
    } else {
      // Connection not currently selected or nothing selected, so select it.
      this.selectedConn = connection;
    }
    // Set the specific selector with the current connection
    if (this.jdbcTableSelector) {
      if (this.selectedConn && this.selectedConn.isJdbc()) {
        this.jdbcTableSelector.setConnection(connection);
      } else {
        this.jdbcTableSelector.setConnection(null);
      }
    }
  }

  /**
   * Respond to child table selection changes by propagating up my parent
   */
  public onTableSelectionChanged( ): void {
    this.tableSelectionChanged.emit();
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
    return this.selectedConn !== null;
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
  }

  /*
   * Return all available Connections
   * @returns {Connection[]} the list of all Connections
   */
  public getAllConnections(): Connection[] {
    return this.allConnections;
  }

  /*
   * Return all currently selected Tables
   * @returns {Table[]} the list of selected Tables
   */
  public getSelectedTables(): Table[] {
    const selectedTables = [];
    if (this.jdbcTableSelector) {
      return this.jdbcTableSelector.getSelectedTables();
    }
    return selectedTables;
  }

}
