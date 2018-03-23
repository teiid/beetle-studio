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

import { Component, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Connection } from "@connections/shared/connection.model";
import { ConnectionService } from "@connections/shared/connection.service";
import { ConnectionsConstants } from "@connections/shared/connections-constants";
import { AppSettingsService } from "@core/app-settings.service";
import { LoggerService } from "@core/logger.service";
import { WizardService } from "@dataservices/shared/wizard.service";
import { AbstractPageComponent } from "@shared/abstract-page.component";
import { ConfirmDeleteComponent } from "@shared/confirm-delete/confirm-delete.component";
import { LayoutType } from "@shared/layout-type.enum";
import { ActionConfig, EmptyStateConfig, Filter } from "patternfly-ng";
import { FilterConfig } from "patternfly-ng";
import { FilterField } from "patternfly-ng";
import { FilterEvent } from "patternfly-ng";
import { FilterType } from "patternfly-ng";
import { SortConfig } from "patternfly-ng";
import { SortField } from "patternfly-ng";
import { SortEvent } from "patternfly-ng";

@Component({
  moduleId: module.id,
  selector: "app-connections",
  templateUrl: "./connections.component.html",
  styleUrls: ["./connections.component.css"]
})
export class ConnectionsComponent extends AbstractPageComponent implements OnInit {

  public connectionNameForDelete: string;

  public filterConfig: FilterConfig;
  public filtersText = "";
  public items: Connection[];
  public sortConfig: SortConfig;
  public currentSortField: SortField;
  public isAscendingSort = true;

  private allConns: Connection[] = [];
  private filteredConns: Connection[] = [];
  private selectedConns: Connection[] = [];
  private router: Router;
  private noConnectionsConfig: EmptyStateConfig;
  private appSettingsService: AppSettingsService;
  private connectionService: ConnectionService;
  private wizardService: WizardService;

  @ViewChild(ConfirmDeleteComponent) private confirmDeleteDialog: ConfirmDeleteComponent;

  constructor(router: Router, route: ActivatedRoute, appSettingsService: AppSettingsService,
              wizardService: WizardService, connectionService: ConnectionService, logger: LoggerService) {
    super(route, logger);
    this.router = router;
    this.appSettingsService = appSettingsService;
    this.connectionService = connectionService;
    this.wizardService = wizardService;
  }

  public ngOnInit(): void {

    super.ngOnInit();

    this.filterConfig = {
      fields: [{
        id: "name",
        title: "Name",
        placeholder: "Filter by Name...",
        type: FilterType.TEXT
      }, {
        id: "description",
        title: "Description",
        placeholder: "Filter by Description...",
        type: FilterType.TEXT
      }] as FilterField[],
      resultsCount: this.filteredConns.length,
      appliedFilters: []
    } as FilterConfig;

    this.sortConfig = {
      fields: [{
        id: "name",
        title: "Name",
        sortType: "alpha"
      }, {
        id: "description",
        title: "Description",
        sortType: "alpha"
      }],
      isAscending: this.isAscendingSort
    } as SortConfig;
  }

  public get noConnectionsEmptyConfig(): EmptyStateConfig {
    if ( !this.noConnectionsConfig ) {
      const actionConfig = {
        primaryActions: [
          {
            id: "createConnectionActionId",
            title: "Add Connection",
            tooltip: "Add a connection"
          }
        ]
      } as ActionConfig;

      this.noConnectionsConfig = {
        actions: actionConfig,
        iconStyleClass: "pficon-warning-triangle-o",
        info: "No Connections were found. Please click below to create a connection. ",
        title: "No Connections Available"
      } as EmptyStateConfig;
    }

    return this.noConnectionsConfig;
  }

  public loadAsyncPageData(): void {
    const self = this;

    this.connectionService
      .getAllConnections()
      .subscribe(
        (connections) => {
          self.allConns = connections;
          self.filteredConns = connections;
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

  public setListLayout(): void {
    this.appSettingsService.connectionsPageLayout = LayoutType.LIST;
  }

  public setCardLayout(): void {
    this.appSettingsService.connectionsPageLayout = LayoutType.CARD;
  }

  /**
   * Handle request for new Connection
   */
  public onNewConnection(): void {
    this.wizardService.setEdit(false);

    const link: string[] = [ ConnectionsConstants.addConnectionPath ];
    this.logger.log("[ConnectionsComponent] Navigating to: %o", link);
    this.router.navigate(link).then(() => {
      // nothing to do
    });
  }

  /**
   * Handle Edit of the specified Connection
   * @param {string} connName
   */
  public onEdit(connName: string): void {
    const selectedConnection =  this.filteredConnections.find((x) => x.getId() === connName);

    // Sets the selected dataservice and edit mode before transferring
    this.wizardService.setSelectedConnection(selectedConnection);
    this.wizardService.setEdit(true);

    const link: string[] = [ ConnectionsConstants.addConnectionPath ];
    this.logger.log("[ConnectionsComponent] Navigating to: %o", link);
    this.router.navigate(link).then(() => {
      // nothing to do
    });
  }

  /**
   * Called to doDelete all selected APIs.
   */
  public onDeleteConnection(): void {
    const selectedConn =  this.filteredConnections.find((x) => x.getId() === this.connectionNameForDelete);

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
   * Filter functions
   */
  public applyFilters(filters: Filter[]): void {
    this.items = [];
    if (filters && filters.length > 0) {
      this.allConnections.forEach((item) => {
        if (this.matchesFilters(item, filters)) {
          this.items.push(item);
        }
      });
    } else {
      this.items = this.allConnections;
    }
    this.filteredConns = this.items;
    this.filterConfig.resultsCount = this.items.length;
  }

  public filterChanged($event: FilterEvent): void {
    this.filtersText = "";
    $event.appliedFilters.forEach((filter) => {
      this.filtersText += filter.field.title + " : " + filter.value + "\n";
    });
    this.applyFilters($event.appliedFilters);
  }

  public matchesFilter(item: Connection, filter: Filter): boolean {
    let match = true;
    if (filter.field.id === "name") {
      match = item.getId().match(filter.value) !== null;
    } else if (filter.field.id === "description") {
      match = item.getDescription().match(filter.value) !== null;
    }
    return match;
  }

  public matchesFilters(item: any, filters: Filter[]): boolean {
    let matches = true;
    filters.forEach((filter) => {
      if (!this.matchesFilter(item, filter)) {
        matches = false;
        return matches;
      }
    });
    return matches;
  }

  /**
   * Sort functions
   */
  public compare(item1: Connection, item2: Connection): number {
    let compValue = 0;
    if (this.currentSortField.id === "name") {
      compValue = item1.getId().localeCompare(item2.getId());
    } else if (this.currentSortField.id === "description") {
      compValue = item1.getDescription().localeCompare(item2.getDescription());
    }

    if (!this.isAscendingSort) {
      compValue = compValue * -1;
    }
    return compValue;
  }

  public sortChange($event: SortEvent): void {
    this.currentSortField = $event.field;
    this.isAscendingSort = $event.isAscending;
    this.filteredConnections.sort((item1: Connection, item2: Connection) => this.compare(item1, item2));
  }

  private removeConnectionFromList(connection: Connection): void {
    this.allConns.splice(this.allConns.indexOf(connection), 1);
  }
}
