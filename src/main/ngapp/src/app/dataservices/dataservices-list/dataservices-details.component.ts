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

import { Component, Input, OnInit, ViewEncapsulation } from "@angular/core";
import { Dataservice } from "@dataservices/shared/dataservice.model";
import { ListConfig } from "patternfly-ng";
import { DataservicesConstants } from "../shared/dataservices-constants";

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: "app-dataservices-details",
  templateUrl: "dataservices-details.component.html"
})
export class DataservicesDetailsComponent implements OnInit {
  @Input() public item: Dataservice;

  public listConfig: ListConfig;

  constructor() {
    // nothing to do
  }

  public ngOnInit(): void {
    this.listConfig = {
      dblClick: false,
      multiSelect: false,
      selectItems: false,
      showCheckbox: false,
      useExpandItems: false
    };
  }

  /**
   * @returns {string[][]} the properties of a dataservice
   */
  public get properties(): string[][] {
    const props = [
      [ DataservicesConstants.dataserviceNameLabel, this.item.getId() ],
      [ DataservicesConstants.descriptionLabel, this.item.getDescription() ]
    ];

    return props;
  }

}
