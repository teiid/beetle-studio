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

import { Component, DoCheck, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from "@angular/core";
import { Connection } from "@connections/shared/connection.model";
import { ConnectionsConstants } from "@connections/shared/connections-constants";
import { LoggerService } from "@core/logger.service";
import { Action, ActionConfig, CardAction, CardConfig, ListConfig } from "patternfly-ng";

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: "app-connection-card",
  templateUrl: "./connection-card.component.html",
  styleUrls: ["./connection-card.component.css"]
})
export class ConnectionCardComponent implements DoCheck, OnInit {

  public static readonly activateConnectionEvent = "activate";
  public static readonly deleteConnectionEvent = "delete";
  public static readonly editConnectionEvent = "edit";

  public readonly editEvent = ConnectionCardComponent.editConnectionEvent;

  @Input() public connection: Connection;
  @Input() public selectedConnections: Connection[];
  @Output() public cardEvent: EventEmitter< {} > = new EventEmitter< {} >();
  @Output() public selectEvent: EventEmitter< Connection > = new EventEmitter< Connection >();

  public actionConfig: ActionConfig;
  public cardConfig: CardConfig;
  public listConfig: ListConfig;
  public showDetails = false;

  private readonly activateActionId = "activate";
  private readonly activateActionIndex = 0; // index in moreActions
  private readonly deleteActionId = "delete";
  private readonly deleteActionIndex = 1; // index in moreActions

  private isLoading = false;
  private logger: LoggerService;

  constructor( logger: LoggerService ) {
    this.logger = logger;
  }

  private get detailsIconStyle(): string {
    return this.showDetails ? "fa fa-close card-footer-action-icon" : "fa fa-angle-right card-footer-action-icon";
  }

  /**
   * Event handler for when a toolbar kebab action is clicked.
   * @param {Action} action the action that was selected.
   */
  public handleAction( action: Action ): void {
    if ( action.id === this.activateActionId ) {
      this.onClick( ConnectionCardComponent.activateConnectionEvent);
    } else if ( action.id === this.deleteActionId ) {
      this.onClick( ConnectionCardComponent.deleteConnectionEvent );
    } else {
      this.logger.error( "Action '" + action.id + "' not handled." );
    }
  }

  /**
   * @returns {boolean} `true` if the connection represented by this card is selected
   */
  public isSelected(): boolean {
    return this.selectedConnections.indexOf( this.connection ) !== -1;
  }

  public ngDoCheck(): void {
    if ( this.isLoading !== this.connection.isLoading ) {
      this.isLoading = this.connection.isLoading;

      this.actionConfig.moreActions[ this.activateActionIndex ].disabled = this.isLoading;
      this.actionConfig.moreActions[ this.deleteActionIndex ].disabled = this.isLoading;
    }

    this.cardConfig.action.iconStyleClass = this.detailsIconStyle;
  }

  /**
   * Initializes the ActionConfig, CardConfig, and ListConfig.
   */
  public ngOnInit(): void {
    this.actionConfig = {
      primaryActions: [
      ],
      moreActions: [
        {
          id: this.activateActionId,
          title: "Activate",
          tooltip: "Activate"
        },
        {
          id: this.deleteActionId,
          title: "Delete",
          tooltip: "Delete"
        }
      ]
    } as ActionConfig;

    this.cardConfig = {
      action: {
        id: "showDetails",
        hypertext: this.showDetailsTitle,
        iconStyleClass: this.detailsIconStyle
      },
      titleBorder: true,
      noPadding: true,
      topBorder: false
    } as CardConfig;

    this.listConfig = {
      dblClick: false,
      multiSelect: false,
      selectItems: false,
      selectedItems: this.selectedConnections,
      showCheckbox: false,
      useExpandItems: false
    } as ListConfig;
  }

  /**
   * An event handler for when a toolbar action is invoked.
   * @param {string} type the type of event being processed
   */
  public onClick( type: string ): void {
    this.cardEvent.emit( { eventType: type, connectionName: this.connection.getId() } );
  }

  /**
   * An event handler for when the card is clicked.
   */
  public onSelect(): void {
    this.selectEvent.emit( this.connection );
  }

  /**
   * An event handler for footer action link.
   * @param {CardAction} $event the event being processed
   */
  public onShowDetails( $event: CardAction ): void {
    this.showDetails = !this.showDetails;
    $event.hypertext = this.showDetailsTitle;
  }

  /**
   * @returns {string[][]} the properties of a connection
   */
  public get properties(): string[][] {
    const props = [
      [ ConnectionsConstants.jndiNamePropertyLabel, this.connection.getJndiName() ],
      [ ConnectionsConstants.driverNamePropertyLabel, this.connection.getDriverName() ],
      [ ConnectionsConstants.serviceCatalogSourceNameLabel, this.connection.getServiceCatalogSourceName() ],
    ];

    return props;
  }

  /**
   * @returns {string} the footer details action text
   */
  public get showDetailsTitle(): string {
    return this.showDetails ? "Less" : "More";
  }

}
