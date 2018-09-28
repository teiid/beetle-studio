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
  Component, DoCheck, EventEmitter, Input, OnInit, Output, ViewEncapsulation, ViewChild
} from "@angular/core";
import * as _ from "lodash";
import { LoggerService } from "@core/logger.service";
import { Action, ActionConfig, CardAction, CardConfig, EmptyStateConfig, ListConfig } from "patternfly-ng";
import { Observable } from "rxjs/Observable";
import { Subscription } from "rxjs/Subscription";
import { Dataservice } from "@dataservices/shared/dataservice.model";
import { DataserviceService } from "@dataservices/shared/dataservice.service";
import { Connection } from "@connections/shared/connection.model";
import { ViewEditorI18n } from "@dataservices/virtualization/view-editor/view-editor-i18n";

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
  public static readonly testDataserviceEvent = "test";
  public static readonly downloadDataserviceEvent = "download";
  public static readonly odataLookDataserviceEvent = "odataLook";
  public static readonly editDescriptionDataserviceEvent = "editDescription";

  public readonly editEvent = DataserviceCardComponent.editDataserviceEvent;
  public readonly quickLookEvent = DataserviceCardComponent.quickLookDataserviceEvent;
  public readonly testEvent = DataserviceCardComponent.testDataserviceEvent;
  public readonly downloadEvent = DataserviceCardComponent.downloadDataserviceEvent;
  public readonly odataLookEvent = DataserviceCardComponent.odataLookDataserviceEvent;
  public readonly editDescriptionEvent = DataserviceCardComponent.editDescriptionDataserviceEvent;

  @Input() public dataservice: Dataservice;
  @Input() public selectedDataservices: Dataservice[];
  @Output() public cardEvent: EventEmitter< {} > = new EventEmitter< {} >();
  @Output() public selectEvent: EventEmitter< Dataservice > = new EventEmitter< Dataservice >();

  @ViewChild('publishLogsEditor') private logEditor: any;

  public actionConfig: ActionConfig;
  public cardConfig: CardConfig;
  public listConfig: ListConfig;
  public showDetails = false;

  private readonly activateActionId = "activate";
  private readonly activateActionIndex = 0; // index in moreActions
  private readonly deleteActionId = "delete";
  private readonly deleteActionIndex = 2; // index in moreActions
  private readonly publishActionId = "publish";
  private readonly publishActionIndex = 1; // index in moreActions
  private readonly downloadActionId = "download";
  private readonly downloadActionIndex = 3; // index in moreActions

  private isLoading = true;
  private logger: LoggerService;
  private dataserviceService: DataserviceService;
  private emptyStateConfig: EmptyStateConfig;

  public publishLogsEditorConfig = {
    lineNumbers: true,
    lineWrapping: true,
    readOnly: true,
    styleActiveLine: true,
    placeholder: 'Awaiting Logs ...',
    tabSize: 2,
    showCursorWhenSelecting: true,
    theme: "neat"
  };

  public publishLogs = 'No log available';
  private logMonitor: Subscription = null;

  constructor( logger: LoggerService, dataserviceService: DataserviceService ) {
    this.logger = logger;
    this.dataserviceService = dataserviceService;
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
    return this.dataservice.getServiceViewNames();
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
    } else if ( action.id === this.downloadActionId ) {
      this.onClick( DataserviceCardComponent.downloadDataserviceEvent );
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
      this.actionConfig.moreActions[ this.downloadActionIndex ].disabled = this.isLoading;
    }

    this.cardConfig.action.iconStyleClass = this.detailsIconStyle;
  }

  public ngOnInit(): void {
    this.actionConfig = {
      primaryActions: [
      ],
      moreActions: [
        {
          disabled: true,
          id: this.activateActionId,
          title: "Activate",
          tooltip: "Activate"
        },
        {
          disabled: true,
          id: this.publishActionId,
          title: "Publish",
          tooltip: "Publish"
        },
        {
          disabled: true,
          id: this.downloadActionId,
          title: "Download",
          tooltip: "Download"
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

    this.emptyStateConfig = {
      title: ViewEditorI18n.noViewsDefined
    } as EmptyStateConfig;

    this.listConfig = {
      dblClick: false,
      multiSelect: false,
      selectItems: false,
      showCheckbox: false,
      useExpandItems: false,
      emptyStateConfig: this.emptyStateConfig
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
   * An event handler for when edit view is invoked.
   * @param {string} vName the name of the view in the selected dataservice
   */
  public onEditView( vName: string ): void {
    this.cardEvent.emit( {
                                 eventType: DataserviceCardComponent.editDataserviceEvent,
                                 dataserviceName: this.dataservice.getId(),
                                 viewName: vName
                               } );
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

  /**
   * Fetches the logs accrued by the publishing operation
   * for the current dataservice
   */
  private fetchPublishLogs(): void {
    this.dataserviceService.publishLogsGet(this.dataservice)
      .subscribe(
        (response) => {
          if (_.isEmpty(response) || _.isEmpty(response.Information) || _.isEmpty(response.Information.log)) {
            this.publishLogs = "No log available";
            return;
          }

          this.publishLogs = response.Information.log;
          this.refreshEditor();
        },
        (error) => {
          this.publishLogs = error;
        }
      );
  }

  /**
   * Fetch the publishing logs initially then
   * at intervals thereafter in order to
   * update the logs.
   */
  public initPublishLogs(): void {
    //
    // Initial fetch of the publish logs
    //
    this.fetchPublishLogs();

    //
    // Refresh them every 10 seconds
    //
    this.logMonitor = Observable.interval(10000).subscribe(
      (val) => {
        this.fetchPublishLogs();
      }
    );
  }

  /**
   * Fixes the CodeMirror editor not displaying
   * any content after intially being unhidden on
   * opening of the slide-in.
   */
  public refreshEditor(): void {
    if (_.isEmpty(this.logEditor))
      return;

    if (_.isEmpty(this.logEditor.instance))
      return;

    const instance = this.logEditor.instance;
    setTimeout(() => {
      instance.refresh();
    }, 1000);
  }

  /**
   * Tidy up the Observable subscription
   * when the slide-in is closed.
   */
  public disposePublishLogs(): void {
    if (this.logMonitor) {
      this.logMonitor.unsubscribe();
    }
  }
}
