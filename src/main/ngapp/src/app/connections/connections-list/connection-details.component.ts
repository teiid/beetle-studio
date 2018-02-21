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
import { Connection } from "@connections/shared/connection.model";
import { ConnectionsConstants } from "@connections/shared/connections-constants";
import { ListConfig } from "patternfly-ng";

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: "app-connection-details",
  templateUrl: "./connection-details.component.html"
})
export class ConnectionDetailsComponent implements OnInit {

  public readonly driverLabel = ConnectionsConstants.driverNamePropertyLabel;
  public readonly jndiLabel = ConnectionsConstants.jndiNamePropertyLabel;
  public readonly serviceCatalogSourceLabel = ConnectionsConstants.serviceCatalogSourceNameLabel;

  @Input() public connection: Connection;

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
   * @returns {string[][]} the properties of a connection
   */
  public get properties(): string[][] {
    const props = [
      [ ConnectionsConstants.jndiNamePropertyLabel, this.connection.getJndiName() ],
      [ ConnectionsConstants.driverNamePropertyLabel, this.connection.getDriverName() ],
      [ ConnectionsConstants.serviceCatalogSourceNameLabel, this.connection.getServiceCatalogSourceName() ],
    ];

    return props;
  }

}
