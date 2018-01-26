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

import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from "@angular/core";
import { Connection } from "@connections/shared/connection.model";
import { Dataservice } from "@dataservices/shared/dataservice.model";
import { CardAction, CardConfig, ListConfig } from "patternfly-ng";

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: "app-dataservice-card-component",
  templateUrl: "./dataservice-card.component.html",
  styleUrls: ["./dataservice-card.component.css"]
})
export class DataserviceCardComponent implements OnInit {

  public static readonly activateDataserviceEvent = "activate";
  public static readonly deleteDataserviceEvent = "delete";
  public static readonly editDataserviceEvent = "edit";
  public static readonly publishDataserviceEvent = "publish";
  public static readonly quickLookDataserviceEvent = "quickLook";
  public static readonly testDataserviceEvent = "test";

  public readonly activateEvent = DataserviceCardComponent.activateDataserviceEvent;
  public readonly deleteEvent = DataserviceCardComponent.deleteDataserviceEvent;
  public readonly editEvent = DataserviceCardComponent.editDataserviceEvent;
  public readonly publishEvent = DataserviceCardComponent.publishDataserviceEvent;
  public readonly quickLookEvent = DataserviceCardComponent.quickLookDataserviceEvent;
  public readonly testEvent = DataserviceCardComponent.testDataserviceEvent;

  @Input() public dataservice: Dataservice;
  @Input() public selectedDataservices: Dataservice[];
  @Output() public cardEvent: EventEmitter< {} > = new EventEmitter< {} >();
  @Output() public selectEvent: EventEmitter< Dataservice > = new EventEmitter< Dataservice >();

  public cardConfig: CardConfig;
  public listConfig: ListConfig;
  public showDetails = false;

  constructor() {
    // nothing to do
  }

  /**
   * @returns {string} the dataservice description
   */
  public get description(): string {
    return this.dataservice.getDescription();
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
   * @param {Dataservice} ds the dataservice whose views are being requested
   * @returns {string[]} the names of the views
   */
  public getViews( ds: Dataservice ): string[] {
    // TODO rewrite when REST functionality has been implemented
    const result: string[] = [];

    const v1 = "ViewOne";
    result.push( v1 );

    const v2 = "ViewTwo";
    result.push( v2 );

    const v3 = "ViewThree";
    result.push( v3 );

    const v4 = "ViewFour";
    result.push( v4 );

    return result;
  }

  /**
   * @returns {boolean} `true` if the dataservice represented by this card is selected
   */
  public isSelected(): boolean {
    return this.selectedDataservices.indexOf( this.dataservice ) !== -1;
  }

  public ngOnInit(): void {
    this.cardConfig = {
      action: {
        id: "showDetails",
        hypertext: this.showDetailsTitle,
        iconStyleClass: "fa fa-info-circle"
      },
      titleBorder: true,
      noPadding: true,
      topBorder: true
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
    return this.showDetails ? "Hide Details" : "Show Details";
  }

}
