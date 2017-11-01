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
import { Router } from "@angular/router";
import { Dataservice } from "@dataservices/shared/dataservice.model";

@Component({
  moduleId: module.id,
  selector: "app-dataservices-list",
  templateUrl: "dataservices-list.component.html",
  styleUrls: ["dataservices-list.component.css"]
})
export class DataservicesListComponent {

  @Input() public dataservices: Dataservice[];
  @Input() public selectedDataservices: Dataservice[];
  @Output() public dataserviceSelected: EventEmitter<Dataservice> = new EventEmitter<Dataservice>();
  @Output() public dataserviceDeselected: EventEmitter<Dataservice> = new EventEmitter<Dataservice>();
  @Output() public tagSelected: EventEmitter<string> = new EventEmitter<string>();
  @Output() public deleteDataservice: EventEmitter<string> = new EventEmitter<string>();

  private router: Router;

  /**
   * Constructor.
   */
  constructor(router: Router) {
    this.router = router;
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

  public onDeleteDataservice(dataserviceName: string): void {
    this.deleteDataservice.emit(dataserviceName);
  }

  public onSelectTag(tag: string, event: MouseEvent): void {
    event.stopPropagation();
    event.preventDefault();
    this.tagSelected.emit(tag);
  }

}
