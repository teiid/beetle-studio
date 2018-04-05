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
  EventEmitter,
  Input,
  OnInit,
  Output, TemplateRef,
  ViewEncapsulation
} from "@angular/core";
import { LoggerService } from "@core/logger.service";
import { Dataservice } from "@dataservices/shared/dataservice.model";
import { Action, ActionConfig, ListConfig } from "patternfly-ng";

@Component({
  encapsulation: ViewEncapsulation.None,
  moduleId: module.id,
  selector: "app-dataservices-list",
  templateUrl: "dataservices-list.component.html",
  styleUrls: ["dataservices-list.component.css"]
 })
export class DataservicesListComponent implements OnInit {

  private static readonly activateActionId = "activate";
  private static readonly deleteActionId = "delete";
  private static readonly editActionId = "edit";
  private static readonly previewActionId = "preview";
  private static readonly publishActionId = "publish";
  private static readonly downloadActionId = "download";
  private static readonly testActionId = "test";

  public items: Dataservice[];
  public listConfig: ListConfig;

  @Input() public dataservices: Dataservice[];
  @Input() public selectedDataservices: Dataservice[];

  @Output() public dataserviceSelected: EventEmitter<Dataservice> = new EventEmitter<Dataservice>();
  @Output() public dataserviceDeselected: EventEmitter<Dataservice> = new EventEmitter<Dataservice>();
  @Output() public tagSelected: EventEmitter<string> = new EventEmitter<string>();
  @Output() public activateDataservice: EventEmitter<string> = new EventEmitter<string>();
  @Output() public testDataservice: EventEmitter<string> = new EventEmitter<string>();
  @Output() public publishDataservice: EventEmitter<string> = new EventEmitter<string>();
  @Output() public downloadDataservice: EventEmitter<string> = new EventEmitter<string>();
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

  /**
   * Get the ActionConfig properties for each row. Note: currently PatternFly does not support templates for
   * "moreActions" but I added in the hope that they will be supported in the future.
   *
   * @param ds the dataservice represented by a row
   * @param editActionTemplate {TemplateRef} the edit action template
   * @param testActionTemplate {TemplateRef} the test action template
   * @param quickLookActionTemplate {TemplateRef} the preview action template
   * @param activateActionTemplate {TemplateRef} the activate action template
   * @param publishActionTemplate {TemplateRef} the publish action template
   * @param downloadActionTemplate {TemplateRef} the download action template
   * @param deleteActionTemplate {TemplateRef} the delete action template
   * @returns {ActionConfig} the actions configuration
   */
  public getActionConfig( ds: Dataservice,
                          editActionTemplate: TemplateRef< any >,
                          testActionTemplate: TemplateRef< any >,
                          quickLookActionTemplate: TemplateRef< any >,
                          activateActionTemplate: TemplateRef< any >,
                          publishActionTemplate: TemplateRef< any >,
                          downloadActionTemplate: TemplateRef< any >,
                          deleteActionTemplate: TemplateRef< any > ): ActionConfig {
    const actionConfig = {
      primaryActions: [
        {
          disabled: ds.serviceDeploymentLoading,
          id: DataservicesListComponent.editActionId,
          template: editActionTemplate,
          title: "Edit",
          tooltip: "Edit this data service"
        },
        {
          disabled: !ds.serviceDeploymentActive,
          id: DataservicesListComponent.previewActionId,
          template: quickLookActionTemplate,
          title: "Preview",
          tooltip: "Preview this data service"
        },
        {
          disabled: !ds.serviceDeploymentActive,
          id: DataservicesListComponent.testActionId,
          template: testActionTemplate,
          title: "Test",
          tooltip: "Test this data service"
        }
      ],
      moreActions: [
        {
          disabled: ds.serviceDeploymentLoading,
          id: DataservicesListComponent.activateActionId,
          template: activateActionTemplate,
          title: "Activate",
          tooltip: "Activate this data service"
        },
        {
          disabled: ds.serviceDeploymentLoading,
          id: DataservicesListComponent.publishActionId,
          template: publishActionTemplate,
          title: "Publish",
          tooltip: "Publish this data service"
        },
        {
          disabled: ds.serviceDeploymentLoading,
          id: DataservicesListComponent.downloadActionId,
          template: downloadActionTemplate,
          title: "Download",
          tooltip: "Download this data service"
        },
        {
          disabled: ds.serviceDeploymentLoading,
          id: DataservicesListComponent.deleteActionId,
          template: deleteActionTemplate,
          title: "Delete",
          tooltip: "Delete this data service"
        } ],
    } as ActionConfig;

    return actionConfig;
  }

  /**
   * @param {Dataservice} dataservice the dataservice whose description is being requested
   * @returns {string} the description (truncated to 120 characters if needed)
   */
  public getDescription( dataservice: Dataservice ): string {
    const description = dataservice.getDescription();

    if ( description && description.length > 120 ) {
      return description.slice( 0, 120 ) + " ... ";
    }

    return description;
  }

  public ngOnInit(): void {
    this.listConfig = {
      dblClick: false,
      multiSelect: false,
      selectItems: true,
      showCheckbox: false,
      useExpandItems: true
    } as ListConfig;
  }

  public isSelected(dataservice: Dataservice): boolean {
    return this.selectedDataservices.indexOf(dataservice) !== -1;
  }

  public onActivateDataservice(dataserviceName: string): void {
    this.activateDataservice.emit(dataserviceName);
  }

  /**
   * @param $event the list row selection event being handled
   */
  public onSelect( $event ): void {
    if ( $event.selectedItems.length === 0 ) {
      if ( this.selectedDataservices.length !== 0 ) {
        this.dataserviceDeselected.emit( $event.selectedItems[ 0 ] );
      }
    } else {
      this.dataserviceSelected.emit( $event.selectedItems[ 0 ] );
    }
  }

  public onTestDataservice(dataserviceName: string): void {
    this.testDataservice.emit(dataserviceName);
  }

  public onPublishDataservice(dataserviceName: string): void {
    this.publishDataservice.emit(dataserviceName);
  }

  public onDownloadDataservice(dataserviceName: string): void {
    this.downloadDataservice.emit(dataserviceName);
  }

  public onDeleteDataservice(dataserviceName: string): void {
    this.deleteDataservice.emit(dataserviceName);
  }

  public onEditDataservice(dataserviceName: string): void {
    this.editDataservice.emit(dataserviceName);
  }

  public onPreviewDataservice( dataserviceName: string): void {
    this.quickLookDataservice.emit(dataserviceName);
  }

  public handleAction($event: Action, item: any): void {
    switch ( $event.id ) {
      case DataservicesListComponent.activateActionId:
        this.onActivateDataservice( item.getId() );
        break;
      case DataservicesListComponent.deleteActionId:
        this.onDeleteDataservice( item.getId() );
        break;
      case DataservicesListComponent.downloadActionId:
        this.onDownloadDataservice( item.getId() );
        break;
      case DataservicesListComponent.editActionId:
        this.onEditDataservice( item.getId() );
        break;
      case DataservicesListComponent.publishActionId:
        this.onPublishDataservice( item.getId() );
        break;
      case DataservicesListComponent.previewActionId:
        this.onPreviewDataservice( item.getId() );
        break;
      case DataservicesListComponent.testActionId:
        this.onTestDataservice( item.getId() );
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
