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
import { Action, ActionConfig, CardAction, CardConfig } from "patternfly-ng";
import { LoggerService } from "@core/logger.service";
import { View } from "@dataservices/shared/view.model";
import { PathUtils } from "@dataservices/shared/path-utils";

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: "app-view-card",
  templateUrl: "./view-card.component.html",
  styleUrls: ["./view-card.component.css"]
})
export class ViewCardComponent implements DoCheck, OnInit {

  public static readonly deleteViewEvent = "delete";
  public static readonly editViewEvent = "edit";

  public readonly editEvent = ViewCardComponent.editViewEvent;

  @Input() public view: View;
  @Input() public selectedViews: View[] = [];
  @Output() public cardEvent: EventEmitter< {} > = new EventEmitter< {} >();
  @Output() public selectEvent: EventEmitter< View > = new EventEmitter< View >();

  public actionConfig: ActionConfig;
  public cardConfig: CardConfig;
  public showDetails = false;

  private readonly deleteActionId = "delete";
  private readonly deleteActionIndex = 0; // index in moreActions

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
    if ( action.id === this.deleteActionId ) {
      this.onClick( ViewCardComponent.deleteViewEvent );
    } else {
      this.logger.error( "Action '" + action.id + "' not handled." );
    }
  }

  /**
   * @returns {boolean} `true` if the connection represented by this card is selected
   */
  public isSelected(): boolean {
    return this.selectedViews.indexOf( this.view ) !== -1;
  }

  public ngDoCheck(): void {
    this.actionConfig.moreActions[ this.deleteActionIndex ].disabled = this.isLoading;
    // this.cardConfig.action.iconStyleClass = this.detailsIconStyle;
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
          id: this.deleteActionId,
          disabled: !this.view.editable,
          title: "Delete",
          tooltip: "Delete"
        }
      ]
    } as ActionConfig;

    this.cardConfig = {
      // action: {
      //   id: "showDetails",
      //   hypertext: this.showDetailsTitle,
      //   iconStyleClass: this.detailsIconStyle
      // },
      titleBorder: true,
      noPadding: true,
      topBorder: false
    } as CardConfig;
  }

  /**
   * An event handler for when a toolbar action is invoked.
   * @param {string} type the type of event being processed
   */
  public onClick( type: string ): void {
    this.cardEvent.emit( { eventType: type, viewName: this.view.getName() } );
  }

  /**
   * An event handler for when the card is clicked.
   */
  public onSelect(): void {
    this.selectEvent.emit( this.view );
  }

  /**
   * Returns display text for the selected view source
   * @returns {string}
   */
  public get sourceTableText(): string {
    let sourceText = "[No Source Selected]";
    const sourcePaths = this.view.getSourcePaths();
    if (sourcePaths && sourcePaths.length > 0) {
      sourceText = "[" + PathUtils.getConnectionName(sourcePaths[0]) + "]  " + PathUtils.getSourceName(sourcePaths[0]);
    }
    return sourceText;
  }

  /**
   * An event handler for footer action link.
   * @param {CardAction} $event the event being processed
   */
  // public onShowDetails( $event: CardAction ): void {
  //   this.showDetails = !this.showDetails;
  //   $event.hypertext = this.showDetailsTitle;
  // }

  /**
   * @returns {string[][]} the properties of a connection
   */
  // public get properties(): string[][] {
  //   const props = [
  //     [ "testLabel", "value" ],
  //   ];
  //
  //   return props;
  // }

  /**
   * @returns {string} the footer details action text
   */
  // public get showDetailsTitle(): string {
  //   return this.showDetails ? "Less" : "More";
  // }

}
