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
  Component,
  OnInit,
  ViewEncapsulation,
  EventEmitter,
  Input,
  Output
} from '@angular/core';
import { Dataservice } from "@dataservices/shared/dataservice.model";
import { LoggerService } from "@core/logger.service";
import { Action, ActionConfig, ListConfig, ListEvent } from "patternfly-ng";

@Component({
  encapsulation: ViewEncapsulation.None,
  moduleId: module.id,
  selector: "app-dataservices-list",
  templateUrl: "dataservices-list.component.html",
  styleUrls: ["dataservices-list.component.css"]
 })
export class DataservicesListComponent implements OnInit {

  public static readonly activateDataserviceEvent = "activate";
  public static readonly deleteDataserviceEvent = "delete";
  public static readonly editDataserviceEvent = "edit";
  public static readonly publishDataserviceEvent = "publish";
  public static readonly quickLookDataserviceEvent = "quickLook";
  public static readonly testDataserviceEvent = "test";

  public readonly activateEvent = DataservicesListComponent.activateDataserviceEvent;
  public readonly deleteEvent = DataservicesListComponent.deleteDataserviceEvent;
  public readonly editEvent = DataservicesListComponent.editDataserviceEvent;
  public readonly publishEvent = DataservicesListComponent.publishDataserviceEvent;
  public readonly quickLookEvent = DataservicesListComponent.quickLookDataserviceEvent;
  public readonly testEvent = DataservicesListComponent.testDataserviceEvent;

  actionConfig: ActionConfig;
  actionsText: string = '';
  allItems: Dataservice[];
  items: Dataservice[];
  listConfig: ListConfig;
  @Input() public dataservices: Dataservice[];
  @Input() public selectedDataservices: Dataservice[];
  @Output() public dataserviceSelected: EventEmitter<Dataservice> = new EventEmitter<Dataservice>();
  @Output() public dataserviceDeselected: EventEmitter<Dataservice> = new EventEmitter<Dataservice>();
  @Output() public tagSelected: EventEmitter<string> = new EventEmitter<string>();
  @Output() public activateDataservice: EventEmitter<string> = new EventEmitter<string>();
  @Output() public testDataservice: EventEmitter<string> = new EventEmitter<string>();
  @Output() public publishDataservice: EventEmitter<string> = new EventEmitter<string>();
  @Output() public deleteDataservice: EventEmitter<string> = new EventEmitter<string>();
  @Output() public editDataservice: EventEmitter<string> = new EventEmitter<string>();
  @Output() public quickLookDataservice: EventEmitter<string> = new EventEmitter<string>();

  public logger: LoggerService;

  /**
   * @param {LoggerService} logger the logging service
   */
  constructor( logger: LoggerService ) {
    this.logger = logger;
  }

  ngOnInit(): void {

    this.items = this.dataservices;

    this.actionConfig = {
      primaryActions: [{
        id: 'edit',
        title: 'Edit',
        tooltip: 'Edit this data service'
      },
      {
        id: 'test',
        title: 'Test',
        tooltip: 'Test this data service'
      },
      {
        id: 'quickLook',
        title: 'Preview',
        tooltip: 'Preview this data service'
      }],
      moreActions: [{
        disabled: false,
        id: 'activate',
        title: 'Activate',
        tooltip: 'Activate this data service'
        },
        {
          id: 'publish',
          title: 'Publish',
          tooltip: 'Publish this data service'
        },
        {
          id: 'refresh',
          title: 'Refresh',
          tooltip: 'Refresh this data service'
        },
        {
          id: 'delete',
          title: 'Delete',
          tooltip: 'Delete this data service'
        }],
    } as ActionConfig;

    this.listConfig = {
      dblClick: false,
      multiSelect: false,
      selectItems: false,
      selectionMatchProp: 'name',
      showCheckbox: false,
      useExpandItems: true
    } as ListConfig;
  }

    public toggleDataserviceSelected(dataservice: Dataservice): void {
    if (this.isSelected(dataservice)) {
      this.dataserviceDeselected.emit(dataservice);
    } else {
      this.dataserviceSelected.emit(dataservice);
    }
  }

  public isSelected(dataservice: Dataservice): boolean {
    return this.selectedDataservices.indexOf(dataservice) !== -1;
  }

  public onActivateDataservice(dataserviceName: string): void {
    this.activateDataservice.emit(dataserviceName);
  }

  public onTestDataservice(dataserviceName: string): void {
    this.testDataservice.emit(dataserviceName);
  }

  public onPublishDataservice(dataserviceName: string): void {
    this.publishDataservice.emit(dataserviceName);
  }

  public onDeleteDataservice(dataserviceName: string): void {
    this.deleteDataservice.emit(dataserviceName);
  }

  public onEditDataservice(dataserviceName: string): void {
    this.editDataservice.emit(dataserviceName);
  }

  public onQuickLookDataservice(dataserviceName: string): void {
    this.quickLookDataservice.emit(dataserviceName);
  }

  ngDoCheck(): void {
  }

  // Actions

  handleAction($event: Action, item: any): void {

    switch ( $event.id ) {
      case DataservicesListComponent.activateDataserviceEvent:
        this.activateDataservice.emit( item.getId() );
        break;
      case DataservicesListComponent.deleteDataserviceEvent:
        this.deleteDataservice.emit( item.getId() );
        break;
      case DataservicesListComponent.editDataserviceEvent:
        this.editDataservice.emit( item.getId() );
        break;
      case DataservicesListComponent.publishDataserviceEvent:
        this.publishDataservice.emit( item.getId() );
        break;
      case DataservicesListComponent.quickLookDataserviceEvent:
        this.quickLookDataservice.emit( item.getId() );
        break;
      case DataservicesListComponent.testDataserviceEvent:
        this.testDataservice.emit( item.getId() );
        break;
      default:
        this.logger.error( "Unhandled event type of '" + $event.title + "'" );
        break;
    }

  //  handleClick($event: ListEvent): void {
    //  this.actionsText = $event.item.name + ' clicked\r\n' + this.actionsText;
  //  }
  }
}
