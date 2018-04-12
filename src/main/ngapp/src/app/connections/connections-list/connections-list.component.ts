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

import { Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewEncapsulation } from "@angular/core";
import { Router } from "@angular/router";
import { Connection } from "@connections/shared/connection.model";
import { Action, ActionConfig, ListConfig } from "patternfly-ng";

@Component({
  moduleId: module.id,
  encapsulation: ViewEncapsulation.None,
  selector: "app-connections-list",
  templateUrl: "connections-list.component.html",
  styleUrls: ["connections-list.component.css"]
})
export class ConnectionsListComponent implements OnInit {

  @Input() public connections: Connection[];
  @Input() public selectedConnections: Connection[];

  @Output() public connectionDeselected: EventEmitter<Connection> = new EventEmitter<Connection>();
  @Output() public connectionSelected: EventEmitter<Connection> = new EventEmitter<Connection>();
  @Output() public activateConnection: EventEmitter<string> = new EventEmitter<string>();
  @Output() public deleteConnection: EventEmitter<string> = new EventEmitter<string>();
  @Output() public editConnection: EventEmitter<string> = new EventEmitter<string>();

  public listConfig: ListConfig;
  private router: Router;

  private readonly activateActionId = "activateActionId";
  private readonly deleteActionId = "deleteActionId";
  private readonly editActionId = "editActionId";

  /**
   * Constructor.
   */
  constructor(router: Router) {
    this.router = router;
  }

  /**
   * Initializes the list config.
   */
  public ngOnInit(): void {
    this.listConfig = {
      dblClick: false,
      multiSelect: false,
      selectItems: true,
      selectedItems: this.selectedConnections,
      selectionMatchProp: "name",
      showCheckbox: false,
      useExpandItems: true
    } as ListConfig;
  }

  /**
   * Get the ActionConfig properties for each row.
   *
   * @param connection the connection represented by a row
   * @param editActionTemplate {TemplateRef} the edit action template
   * @param activateActionTemplate {TemplateRef} the activate action template
   * @param deleteActionTemplate {TemplateRef} the delete action template
   * @returns {ActionConfig} the actions configuration
   */
  public getActionConfig( connection: Connection,
                          editActionTemplate: TemplateRef< any >,
                          activateActionTemplate: TemplateRef< any >,
                          deleteActionTemplate: TemplateRef< any > ): ActionConfig {
    const actionConfig = {
      primaryActions: [
        {
          disabled: connection.isLoading,
          id: this.editActionId,
          template: editActionTemplate,
          title: "Edit",
          tooltip: "Edit this connection"
        }
      ],
      moreActions: [
        {
          disabled: connection.isLoading,
          id: this.activateActionId,
          template: activateActionTemplate,
          title: "Activate",
          tooltip: "Activate this connection"
        },
        {
          disabled: connection.isLoading,
          id: this.deleteActionId,
          template: deleteActionTemplate,
          title: "Delete",
          tooltip: "Delete this connection"
        }
      ],
      moreActionsDisabled: false,
      moreActionsVisible: true
    } as ActionConfig;

    return actionConfig;
  }

  public getDescription( conn: Connection ): string {
    const description = conn.getDescription();

    if ( description && description.length > 120 ) {
      return description.slice( 0, 120 ) + " ... ";
    }

    return description;
  }

  /**
   * Event handler for when a toolbar icon or kebab action is clicked.
   * @param {Action} action the action that was selected.
   * @param item this parameter is not used
   */
  public handleAction( action: Action,
                       item: any ): void {
    // first select the connection
    this.connectionSelected.emit( item );

    // now perform action
    if ( action.id === this.deleteActionId ) {
      this.onDeleteConnection( this.selectedConnections[ 0 ].getId() );
    } else if ( action.id === this.activateActionId ) {
      this.onActivateConnection( this.selectedConnections[ 0 ].getId() );
    } else if ( action.id === this.editActionId ) {
      this.onEditConnection( this.selectedConnections[ 0 ].getId() );
    }
  }

  /**
   * @returns {boolean} `true` if the connection row is selected in the list
   */
  public isSelected( connection: Connection ): boolean {
    return this.selectedConnections.indexOf( connection ) !== -1;
  }

  /**
   * @param {string} connectionName the name of the connection to activate
   */
  public onActivateConnection(connectionName: string): void {
    this.activateConnection.emit(connectionName);
  }

  /**
   * @param {string} connectionName the name of the connection to delete
   */
  public onDeleteConnection(connectionName: string): void {
    this.deleteConnection.emit(connectionName);
  }

  /**
   * @param {string} connectionName the name of the connection to edit
   */
  public onEditConnection( connectionName: string ): void {
    this.editConnection.emit( connectionName );
  }

  /**
   * @param $event the list row selection event being handled
   */
  public onSelect( $event ): void {
    if ( $event.selectedItems.length === 0 ) {
      if ( this.selectedConnections.length !== 0 ) {
        this.connectionDeselected.emit( $event.selectedItems[ 0 ] );
      }
    } else {
      this.connectionSelected.emit( $event.selectedItems[ 0 ] );
    }
  }

}
