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

import { ViewChild } from "@angular/core";
import { Component } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Router } from "@angular/router";
import { ConnectionService } from "@connections/shared/connection.service";
import { ConnectionsConstants } from "@connections/shared/connections-constants";
import { LoggerService } from "@core/logger.service";
import { AbstractPageComponent } from "@shared/abstract-page.component";
import { PropertyDefinition } from "@shared/property-form/property-definition.model";
import { PropertyFormComponent } from "@shared/property-form/property-form.component";

@Component({
  moduleId: module.id,
  selector: "app-edit-connection",
  templateUrl: "./edit-connection.component.html",
  styleUrls: ["./edit-connection.component.css"]
})
export class EditConnectionComponent extends AbstractPageComponent {

  public readonly connectionsLink: string = ConnectionsConstants.connectionsRootPath;

  private router: Router;
  private connectionService: ConnectionService;
  private properties: Array<PropertyDefinition<any>> = [];
  @ViewChild(PropertyFormComponent) private connectionForm: PropertyFormComponent;

  constructor(router: Router, route: ActivatedRoute, connectionService: ConnectionService, logger: LoggerService) {
    super(route, logger);
    this.router = router;
    this.connectionService = connectionService;
  }

  public loadAsyncPageData(): void {
    const that = this;
    this.connectionService
      .getConnectionTemplateProperties("h2")
      .subscribe(
        (props) => {
          that.properties = props;
          that.connectionForm.setFormProperties(that.properties);
          that.connectionForm.updateForm();
          console.log("[AddConnectionComponent] Navigating to: %o");
        },
        (error) => {
          console.error("[ConnectionsComponent] Error getting connections.");
          this.error(error);
        }
      );
  }

  /**
   * @returns {PropertyDefinition<any>[]} the property definitions (can be null)
   */
  public getPropertyDefinitions(): Array<PropertyDefinition<any>> {
    return this.properties;
  }

}
