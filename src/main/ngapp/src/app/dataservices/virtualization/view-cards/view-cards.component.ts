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

import { Component, EventEmitter, Input, Output } from "@angular/core";
import { ViewCardComponent } from "@dataservices/virtualization/view-cards/view-card/view-card.component";
import { LoggerService } from "@core/logger.service";
import { ViewDefinition } from "@dataservices/shared/view-definition.model";

@Component({
  moduleId: module.id,
  selector: "app-view-cards",
  templateUrl: "view-cards.component.html",
  styleUrls: ["view-cards.component.css"]
})
export class ViewCardsComponent {

  @Input() public views: ViewDefinition[];
  @Input() public selectedViews: ViewDefinition[];

  @Output() public viewSelected: EventEmitter<ViewDefinition> = new EventEmitter<ViewDefinition>();
  @Output() public viewDeselected: EventEmitter<ViewDefinition> = new EventEmitter<ViewDefinition>();
  @Output() public deleteView: EventEmitter<string> = new EventEmitter<string>();
  @Output() public editView: EventEmitter<string> = new EventEmitter<string>();

  public logger: LoggerService;

  /**
   * @param {LoggerService} logger the logging service
   */
  constructor( logger: LoggerService ) {
    this.logger = logger;
  }

  public isSelected( view: ViewDefinition ): boolean {
    return this.selectedViews.indexOf( view ) !== -1;
  }

  public onCardEvent( event: { eventType: string,
                               viewName: string } ): void {
    switch ( event.eventType ) {
      case ViewCardComponent.deleteViewEvent:
        this.deleteView.emit( event.viewName );
        break;
      case ViewCardComponent.editViewEvent:
        this.editView.emit( event.viewName );
        break;
      default:
        this.logger.error( "Unhandled event type of '" + event.eventType + "'" );
        break;
    }
  }

  public onSelectEvent( view: ViewDefinition ): void {
    this.viewSelected.emit( view );
  }

}
