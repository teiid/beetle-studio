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
import { ConnectionCardComponent } from "@connections/connections-cards/connection-card/connection-card.component";
import { Connection } from "@connections/shared/connection.model";
import { ConnectionService } from "@connections/shared/connection.service";
import { ConnectionsConstants } from "@connections/shared/connections-constants";
import { AppSettingsService } from "@core/app-settings.service";
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
  styleUrls: ["./connections.component.css"]
})
export class ConnectionsComponent extends AbstractPageComponent {

  public readonly addConnectionLink: string = ConnectionsConstants.addConnectionPath;

  public connectionNameForDelete: string;
  private allConns: Connection[] = [];
  private filteredConns: Connection[] = [];
  private selectedConns: Connection[] = [];
  private router: Router;
  private appSettingsService: AppSettingsService;
  private connectionService: ConnectionService;
  private filter: IdFilter = new IdFilter();
  private layout: LayoutType = LayoutType.CARD;
  private sortDirection: SortDirection = SortDirection.ASC;

  @ViewChild(ConfirmDeleteComponent) private confirmDeleteDialog: ConfirmDeleteComponent;

  constructor(router: Router, route: ActivatedRoute, appSettingsService: AppSettingsService,
              connectionService: ConnectionService, logger: LoggerService) {
    super(route, logger);
    this.router = router;
    this.appSettingsService = appSettingsService;
    this.connectionService = connectionService;
  }

  public loadAsyncPageData(): void {
    const self = this;

    this.connectionService
      .getAllConnections()
      .subscribe(
        (connections) => {
          self.allConns = connections;
          self.filteredConns = this.filterConnections();
          self.loaded("connections");
        },
        (error) => {
          self.error(error, "Error getting connections");
        }
      );
  }

  /**
   * @returns {boolean} true if connections are being represented by cards
   */
  public get isCardLayout(): boolean {
    return this.appSettingsService.connectionsPageLayout === LayoutType.CARD;
  }

  /**
   * @returns {boolean} true if connections are being represented by items in a list
   */
  public get isListLayout(): boolean {
    return this.appSettingsService.connectionsPageLayout === LayoutType.LIST;
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

  public onEdit( connectionName: string ): void {
    const connection = this.filterConnections().find( ( conn ) => conn.getId() === connectionName );
    // TODO: implement onEdit
    alert( "Edit '" + connectionName + "' connection (not yet implemented)" );
  }

  public onPing( connName: string ): void {
    // TODO: implement onEdit
    alert( "Ping the '" + connName + "' connection (not yet implemented)" );
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
    this.filterConnections();
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
    this.appSettingsService.connectionsPageLayout = LayoutType.LIST;
  }

  public setCardLayout(): void {
    this.appSettingsService.connectionsPageLayout = LayoutType.CARD;
  }

  /**
   * Called to doDelete all selected APIs.
   */
  public onDeleteConnection(): void {
    const selectedConn =  this.filterConnections().find((x) => x.getId() === this.connectionNameForDelete);

    // const itemsToDelete: Connection[] = ArrayUtils.intersect(this.selectedConns, this.filteredConns);
    // const selectedConn = itemsToDelete[0];

    // Note: we can only doDelete selected items that we can see in the UI.
    this.logger.log("[ConnectionsPageComponent] Deleting selected Connection.");
    const self = this;
    this.connectionService
      .deleteConnection(selectedConn.getId())
      .subscribe(
        (wasSuccess) => {
          self.removeConnectionFromList(selectedConn);
          const link: string[] = [ ConnectionsConstants.connectionsRootPath ];
          self.logger.log("[CreateApiPageComponent] Navigating to: %o", link);
          self.router.navigate(link).then(() => {
            // nothing to do
          });
        },
        (error) => {
          self.error(error, "Error deleting the connection");
        }
      );
  }

  /**
   * Filters and sorts the list of connections based on the user input
   */
  public filterConnections(): Connection[] {
    // Clear the array first.
    this.filteredConns.splice(0, this.filteredConns.length);

    // filter
    for (const connection of this.allConns) {
      if (this.filter.accepts(connection)) {
        this.filteredConns.push(connection);
      }
    }

    // sort
    Connection.sort( this.filteredConns, this.sortDirection );
    this.selectedConns = ArrayUtils.intersect(this.selectedConns, this.filteredConns);

    return this.filteredConns;
  }

  private removeConnectionFromList(connection: Connection): void {
    this.allConns.splice(this.allConns.indexOf(connection), 1);
    this.filterConnections();
  }
}
