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

import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { AbstractPageComponent } from '@shared/abstract-page.component';
import { ArrayUtils } from '@core/common';
import { ConfirmDeleteComponent } from "@shared/confirm-delete/confirm-delete.component";
import { Connection } from "@connections/shared/connection.model";
import { ConnectionService } from '@connections/shared/connection.service';
import { NewConnection } from '@connections/shared/new-connection.model';

class Filters {
  nameFilter: string;
  sortDirection: string;
  layout: string;

  constructor(params?: any) {
    this.reset();
    if (params) {
      for (const key of Object.keys(params)) {
        const value: string = params[key];
        this[key] = value;
      }
    }
  }

  public accepts(connection: Connection): boolean {
    const name: string = connection.getId().toLocaleLowerCase();
    const namef: string = this.nameFilter.toLocaleLowerCase();
    return name.indexOf(namef) >= 0;
  }

  public reset(): void {
    this.nameFilter = '';
    this.sortDirection = 'ASC';
    this.layout = 'card';
  }
}

@Component({
  selector: 'app-connections',
  templateUrl: './connections.component.html',
  styleUrls: ['./connections.component.css'],
  providers: [ConnectionService]
})
export class ConnectionsComponent extends AbstractPageComponent {

  allConnections: Connection[] = [];
  filteredConnections: Connection[] = [];
  selectedConnections: Connection[] = [];
  filters: Filters = new Filters();
  private connectionNameForDelete: string;

  @ViewChild(ConfirmDeleteComponent) confirmDeleteDialog: ConfirmDeleteComponent;

  constructor(private router: Router, route: ActivatedRoute, private connectionService: ConnectionService) {
    super(route);
  }

  public loadAsyncPageData() {
    this.connectionService
      .getAllConnections()
      .subscribe(
        (connections) => {
          this.allConnections = connections;
          this.filteredConnections = this.filterConnections();
          this.loaded('connections');
        },
        (error) => {
          console.error('[ConnectionsComponent] Error getting connections.');
          this.error(error);
        }
      );
  }

  /**
   * Filters and sorts the list of connections based on the user input
   */
  private filterConnections(): Connection[] {
    // Clear the array first.
    this.filteredConnections.splice(0, this.filteredConnections.length);
    for (const connection of this.allConnections) {
      if (this.filters.accepts(connection)) {
        this.filteredConnections.push(connection);
      }
    }
    this.filteredConnections.sort( (c1: Connection, c2: Connection) => {
      let rval: number = c1.getId().localeCompare(c2.getId());
      if (this.filters.sortDirection === 'DESC') {
        rval *= -1;
      }
      return rval;
    });

    this.selectedConnections = ArrayUtils.intersect(this.selectedConnections, this.filteredConnections);

    return this.filteredConnections;
  }

  public onSelected(connection: Connection): void {
    // Only allow one item to be selected
    this.selectedConnections.shift();
    this.selectedConnections.push(connection);
  }

  public onDeselected(connection: Connection): void {
    // Only one item is selected at a time
    this.selectedConnections.shift();
    // this.selectedConnections.splice(this.selectedConnections.indexOf(connection), 1);
  }

  public onEdit(connName: string): void {
    const link: string[] = [ '/connections/edit-connection' ];
    this.router.navigate(link);
  }

  public onDelete(connName: string): void {
    this.connectionNameForDelete = connName;
    this.confirmDeleteDialog.open();
  }

  public onPing(connName: string): void {
    alert('Ping connection ' + connName);
  }

  public isFiltered(): boolean {
    return this.allConnections.length !== this.filteredConnections.length;
  }

  public toggleSortDirection(): void {
    if (this.filters.sortDirection === 'ASC') {
      this.filters.sortDirection = 'DESC';
    } else {
      this.filters.sortDirection = 'ASC';
    }
    this.filterConnections();
  }

  public clearFilters(): void {
    this.filters.nameFilter = '';
    this.filterConnections();
  }

  public onListLayout(): void {
    this.filters.layout = 'list';
  }

  public onCardLayout(): void {
    this.filters.layout = 'card';
  }

  /**
   * Called to delete all selected APIs.
   */
  public deleteConnection(): void {
    const selectedConn =  this.filterConnections().find(x => x.getId() === this.connectionNameForDelete);

    // const itemsToDelete: Connection[] = ArrayUtils.intersect(this.selectedConnections, this.filteredConnections);
    // const selectedConn = itemsToDelete[0];

    const connectionToDelete: NewConnection = new NewConnection();
    connectionToDelete.setName(selectedConn.getId());

    // Note: we can only delete selected items that we can see in the UI.
    console.log('[ConnectionsPageComponent] Deleting selected Connection.');
    this.connectionService
      .deleteConnection(connectionToDelete)
      .subscribe(
        () => {
          this.removeConnectionFromList(selectedConn);
          const link: string[] = [ '/connections' ];
          console.log('[CreateApiPageComponent] Navigating to: %o', link);
          this.router.navigate(link);
        }
      );
  }

  private removeConnectionFromList(connection: Connection) {
    this.allConnections.splice(this.allConnections.indexOf(connection), 1);
    this.filterConnections();
  }
}
