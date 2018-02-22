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

import {
  Component, DoCheck, EventEmitter, Input, OnInit, Output, ViewEncapsulation
} from "@angular/core";
import { Connection } from "@connections/shared/connection.model";
import { LoggerService } from "@core/logger.service";
import { Dataservice } from "@dataservices/shared/dataservice.model";
import { Action, ActionConfig, CardAction, CardConfig, ListConfig } from "patternfly-ng";

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: "app-dataservice-card-component",
  templateUrl: "./dataservice-card.component.html",
  styleUrls: ["./dataservice-card.component.css"]
})
export class DataserviceCardComponent implements DoCheck, OnInit {

  public static readonly activateDataserviceEvent = "activate";
  public static readonly deleteDataserviceEvent = "delete";
  public static readonly editDataserviceEvent = "edit";
  public static readonly publishDataserviceEvent = "publish";
  public static readonly quickLookDataserviceEvent = "quickLook";
  public static readonly refreshDataserviceEvent = "activate";
  public static readonly testDataserviceEvent = "test";

  public readonly editEvent = DataserviceCardComponent.editDataserviceEvent;
  public readonly quickLookEvent = DataserviceCardComponent.quickLookDataserviceEvent;
  public readonly testEvent = DataserviceCardComponent.testDataserviceEvent;

  @Input() public dataservice: Dataservice;
  @Input() public selectedDataservices: Dataservice[];
  @Output() public cardEvent: EventEmitter< {} > = new EventEmitter< {} >();
  @Output() public selectEvent: EventEmitter< Dataservice > = new EventEmitter< Dataservice >();

  public actionConfig: ActionConfig;
  public cardConfig: CardConfig;
  public listConfig: ListConfig;
  public showDetails = false;

  private readonly activateActionId = "activate";
  private readonly activateActionIndex = 0; // index in moreActions
  private readonly deleteActionId = "delete";
  private readonly deleteActionIndex = 3; // index in moreActions
  private readonly publishActionId = "publish";
  private readonly publishActionIndex = 2; // index in moreActions
  private readonly refreshActionId = "refresh";
  private readonly refreshActionIndex = 1; // index in moreActions

  private isLoading = false;
  private logger: LoggerService;

  constructor( logger: LoggerService ) {
    this.logger = logger;
  }

  /**
   * @returns {string} the dataservice description
   */
  public get description(): string {
    return this.dataservice.getDescription();
  }

  private get detailsIconStyle(): string {
    return this.showDetails ? "fa fa-close card-footer-action-icon" : "fa fa-angle-right card-footer-action-icon";
  }

  /**
   * @param {string} view the view whose connections are being requested
   * @returns {Connection[]} the connections of the dataservice represented by this card
   */
  public getConnections( view: string ): Connection[] {
    // TODO rewrite when REST functionality has been implemented
    const result: Connection[] = [];

    const c1 = new Connection();
    c1.setId( "ConnectionOne" );
    result.push( c1 );

    const c2 = new Connection();
    c2.setId( "ConnectionTwo" );
    result.push( c2 );

    const c3 = new Connection();
    c3.setId( "ConnectionThree" );
    result.push( c3 );

    return result;
  }

  /**
   * @returns {string[]} the names of the views
   */
  public getViews(): string[] {
    const result: string[] = [];

    for (const viewName of this.dataservice.getServiceViewNames()) {
      result.push(viewName);
    }

    return result;
  }

  /**
   * Event handler for when a toolbar kebab action is clicked.
   * @param {Action} action the action that was selected.
   */
  public handleAction( action: Action ): void {
    if ( action.id === this.activateActionId ) {
      this.onClick( DataserviceCardComponent.activateDataserviceEvent );
    } else if ( action.id === this.deleteActionId ) {
      this.onClick( DataserviceCardComponent.deleteDataserviceEvent );
    } else if ( action.id === this.publishActionId ) {
      this.onClick( DataserviceCardComponent.publishDataserviceEvent );
    } else if ( action.id === this.refreshActionId ) {
      this.onClick( DataserviceCardComponent.refreshDataserviceEvent );
    } else {
      this.logger.error( "Action '" + action.id + "' not handled." );
    }
  }

  /**
   * @returns {boolean} `true` if the dataservice represented by this card is selected
   */
  public isSelected(): boolean {
    return this.selectedDataservices.indexOf( this.dataservice ) !== -1;
  }

  public ngDoCheck(): void {
    if ( this.isLoading !== this.dataservice.serviceDeploymentLoading ) {
      this.isLoading = this.dataservice.serviceDeploymentLoading;

      this.actionConfig.moreActions[ this.activateActionIndex ].disabled = this.isLoading;
      this.actionConfig.moreActions[ this.deleteActionIndex ].disabled = this.isLoading;
      this.actionConfig.moreActions[ this.publishActionIndex ].disabled = this.isLoading;
      this.actionConfig.moreActions[ this.refreshActionIndex ].disabled = this.isLoading;
    }

    this.cardConfig.action.iconStyleClass = this.detailsIconStyle;
  }

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
          id: this.refreshActionId,
          title: "Refresh",
          tooltip: "Refresh"
        },
        {
          disabled: true,
          id: this.publishActionId,
          title: "Publish",
          tooltip: "Publish"
        },
        {
          disabled: true,
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
      showCheckbox: false,
      useExpandItems: false
    } as ListConfig;
  }

  /**
   * An event handler for when a toolbar action is invoked.
   * @param {string} type the type of event being processed
   */
  public onClick( type: string ): void {
    this.cardEvent.emit( { eventType: type, dataserviceName: this.dataservice.getId() } );
  }

  /**
   * An event handler for when the card is clicked.
   */
  public onSelect(): void {
    this.selectEvent.emit( this.dataservice );
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
   * @returns {string} the footer details action text
   */
  public get showDetailsTitle(): string {
    return this.showDetails ? "Less" : "More";
  }

}
