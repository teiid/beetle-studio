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

import { Component, EventEmitter, Input, Output, ViewEncapsulation } from "@angular/core";
import { LoggerService } from "@core/logger.service";
import { DataserviceCardComponent } from "@dataservices/dataservices-cards/dataservice-card/dataservice-card.component";
import { Dataservice } from "@dataservices/shared/dataservice.model";

@Component({
  moduleId: module.id,
  encapsulation: ViewEncapsulation.None,
  selector: "app-dataservices-cards",
  templateUrl: "dataservices-cards.component.html",
  styleUrls: ["dataservices-cards.component.css"]
})
export class DataservicesCardsComponent {

  @Input() public dataservices: Dataservice[];
  @Input() public selectedDataservices: Dataservice[];
  @Output() public dataserviceSelected: EventEmitter<Dataservice> = new EventEmitter<Dataservice>();
  @Output() public dataserviceDeselected: EventEmitter<Dataservice> = new EventEmitter<Dataservice>();
  @Output() public activateDataservice: EventEmitter<string> = new EventEmitter<string>();
  @Output() public testDataservice: EventEmitter<string> = new EventEmitter<string>();
  @Output() public publishDataservice: EventEmitter<string> = new EventEmitter<string>();
  @Output() public deleteDataservice: EventEmitter<string> = new EventEmitter<string>();
  @Output() public editDataservice: EventEmitter<string> = new EventEmitter<string>();
  @Output() public quickLookDataservice: EventEmitter<string> = new EventEmitter<string>();
  @Output() public downloadDataservice: EventEmitter<string> = new EventEmitter<string>();

  public logger: LoggerService;

  /**
   * @param {LoggerService} logger the logging service
   */
  constructor( logger: LoggerService ) {
    this.logger = logger;
  }

  public isSelected( dataservice: Dataservice ): boolean {
    return this.selectedDataservices.indexOf( dataservice ) !== -1;
  }

  public onCardEvent( event: { eventType: string, dataserviceName: string } ): void {
    switch ( event.eventType ) {
      case DataserviceCardComponent.deleteDataserviceEvent:
        this.deleteDataservice.emit( event.dataserviceName );
        break;
      case DataserviceCardComponent.editDataserviceEvent:
        this.editDataservice.emit( event.dataserviceName );
        break;
      case DataserviceCardComponent.publishDataserviceEvent:
        this.publishDataservice.emit( event.dataserviceName );
        break;
      case DataserviceCardComponent.quickLookDataserviceEvent:
        this.quickLookDataservice.emit( event.dataserviceName );
        break;
      case DataserviceCardComponent.activateDataserviceEvent:
        this.activateDataservice.emit( event.dataserviceName );
        break;
      case DataserviceCardComponent.testDataserviceEvent:
        this.testDataservice.emit( event.dataserviceName );
        break;
      case DataserviceCardComponent.downloadDataserviceEvent:
        this.downloadDataservice.emit ( event.dataserviceName );
        break;
      default:
        this.logger.error( "Unhandled event type of '" + event.eventType + "'" );
        break;
    }
  }

  public onSelectEvent( dataservice: Dataservice ): void {
    this.dataserviceSelected.emit( dataservice );
  }

}
