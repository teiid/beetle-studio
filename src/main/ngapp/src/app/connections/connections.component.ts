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

import { Component, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Connection } from "@connections/shared/connection.model";
import { ConnectionService } from "@connections/shared/connection.service";
import { ConnectionsConstants } from "@connections/shared/connections-constants";
import { NewConnection } from "@connections/shared/new-connection.model";
import { LoggerService } from "@core/logger.service";
import { ArrayUtils } from "@core/utils/array-utils";
import { AbstractPageComponent } from "@shared/abstract-page.component";
import { ConfirmDeleteComponent } from "@shared/confirm-delete/confirm-delete.component";
import { IdFilter } from "@shared/id-filter";
import { LayoutType } from "@shared/layout-type.enum";
import { SortDirection } from "@shared/sort-direction.enum";

@Component({
  moduleId: module.id,
  selector: "app-connections",
  templateUrl: "./connections.component.html",
  styleUrls: ["./connections.component.css"],
  providers: [ConnectionService]
})
export class ConnectionsComponent extends AbstractPageComponent {

  public readonly addConnectionLink: string = ConnectionsConstants.addConnectionPath;

  private allConns: Connection[] = [];
  private filteredConns: Connection[] = [];
  private selectedConns: Connection[] = [];
  private connectionNameForDelete: string;
  private router: Router;
  private connectionService: ConnectionService;
  private filter: IdFilter = new IdFilter();
  private layout: LayoutType = LayoutType.CARD;
  private sortDirection: SortDirection = SortDirection.ASC;

  @ViewChild(ConfirmDeleteComponent) private confirmDeleteDialog: ConfirmDeleteComponent;

  constructor(router: Router, route: ActivatedRoute, connectionService: ConnectionService, logger: LoggerService) {
    super(route, logger);
    this.router = router;
    this.connectionService = connectionService;
  }

  public loadAsyncPageData(): void {
    this.connectionService
      .getAllConnections()
      .subscribe(
        (connections) => {
          this.allConns = connections;
          this.filteredConns = this.filterConnections();
          this.loaded("connections");
        },
        (error) => {
          this.logger.error("[ConnectionsComponent] Error getting connections.");
          this.error(error);
        }
      );
  }

  /**
   * @returns {boolean} true if connections are being represented by cards
   */
  public get isCardLayout(): boolean {
    return this.layout === LayoutType.CARD;
  }

  /**
   * @returns {boolean} true if connections are being represented by items in a list
   */
  public get isListLayout(): boolean {
    return this.layout === LayoutType.LIST;
  }

  /**
   * @returns {boolean} true if sorting connection names in ascending order
   */
  public get isSortAscending(): boolean {
    return this.sortDirection === SortDirection.ASC;
  }

  /**
   * @returns {boolean} true if sorting connection names in descending order
   */
  public get isSortDescending(): boolean {
    return this.sortDirection === SortDirection.DESC;
  }

  /**
   * @returns {Connection[]} the array of all connections
   */
  public get allConnections(): Connection[] {
    return this.allConns;
  }

  /**
   * @returns {Connection[]} the array of filtered connections
   */
  public get filteredConnections(): Connection[] {
    return this.filteredConns;
  }

  /**
   * @returns {Connection[]} the array of selected connections
   */
  public get selectedConnections(): Connection[] {
    return this.selectedConns;
  }

  public onPing( connName: string): void {
    alert("Ping connection " + connName);
  }

  public onSelected(connection: Connection): void {
    // Only allow one item to be selected
    this.selectedConns.shift();
    this.selectedConns.push(connection);
  }

  public onDeselected(connection: Connection): void {
    // Only one item is selected at a time
    this.selectedConns.shift();
    // this.selectedConns.splice(this.selectedConns.indexOf(connection), 1);
  }

  public onDelete(connName: string): void {
    this.connectionNameForDelete = connName;
    this.confirmDeleteDialog.open();
  }

  public isFiltered(): boolean {
    return this.allConns.length !== this.filteredConns.length;
  }

  public get nameFilter(): string {
    return this.filter.getPattern();
  }

  /**
   * @param {string} pattern the new pattern for the connection name filter (can be null or empty)
   */
  public set nameFilter( pattern: string ) {
    this.filter.setFilter( pattern );
  }

  public toggleSortDirection(): void {
    if (this.sortDirection === SortDirection.ASC) {
      this.sortDirection = SortDirection.DESC;
    } else {
      this.sortDirection = SortDirection.ASC;
    }
    this.filterConnections();
  }

  public clearFilters(): void {
    this.filter.reset();
    this.filterConnections();
  }

  public setListLayout(): void {
    this.layout = LayoutType.LIST;
  }

  public setCardLayout(): void {
    this.layout = LayoutType.CARD;
  }

  /**
   * Called to doDelete all selected APIs.
   */
  public onDeleteConnection(): void {
    const selectedConn =  this.filterConnections().find((x) => x.getId() === this.connectionNameForDelete);

    // const itemsToDelete: Connection[] = ArrayUtils.intersect(this.selectedConns, this.filteredConns);
    // const selectedConn = itemsToDelete[0];

    const connectionToDelete: NewConnection = new NewConnection();
    connectionToDelete.setName(selectedConn.getId());

    // Note: we can only doDelete selected items that we can see in the UI.
    this.logger.log("[ConnectionsPageComponent] Deleting selected Connection.");
    this.connectionService
      .deleteConnection(connectionToDelete)
      .subscribe(
        () => {
          this.removeConnectionFromList(selectedConn);
          const link: string[] = [ ConnectionsConstants.connectionsRootPath ];
          this.logger.log("[CreateApiPageComponent] Navigating to: %o", link);
          this.router.navigate(link).then(() => {
            // nothing to do
          });
        }
      );
  }

  /**
   * Filters and sorts the list of connections based on the user input
   */
  public filterConnections(): Connection[] {
    // Clear the array first.
    this.filteredConns.splice(0, this.filteredConns.length);
    for (const connection of this.allConns) {
      if (this.filter.accepts(connection)) {
        this.filteredConns.push(connection);
      }
    }
    this.filteredConns.sort( (c1: Connection, c2: Connection) => {
      let rval = 0;

      if ( c1.getId() ) {
        if ( c2.getId() ) {
          // both connections have an ID
          rval = c1.getId().localeCompare( c2.getId() );
        } else {
          // c2 does not have an ID
          rval = 1;
        }
      } else if ( c2.getId() ) {
        // c1 does not have an ID and c2 does
        rval = -1;
      }

      if ( this.sortDirection === SortDirection.DESC ) {
        rval *= -1;
      }

      return rval;
    });

    this.selectedConns = ArrayUtils.intersect(this.selectedConns, this.filteredConns);

    return this.filteredConns;
  }

  private removeConnectionFromList(connection: Connection): void {
    this.allConns.splice(this.allConns.indexOf(connection), 1);
    this.filterConnections();
  }
}
