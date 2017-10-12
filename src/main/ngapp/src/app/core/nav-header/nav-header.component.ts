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

import { Component } from "@angular/core";
import { LoggerService } from "@core/logger.service";

@Component({
  moduleId: module.id,
  selector: "app-nav-header",
  templateUrl: "./nav-header.component.html",
  styleUrls: [ "./nav-header.component.less" ]
})
export class NavHeaderComponent {

  private version = "N/A";
  private builtOn: Date = new Date();
  private logger: LoggerService;
  private projectUrl = "http://jboss.org/teiiddesigner/";
  private userId = "user";

  constructor( logger: LoggerService ) {
    this.logger = logger;

    // TODO this does not work
    if (window["BeetleStudio"]) {
      this.logger.log("[NavHeaderComponent] Found app info: %o", window["BeetleStudio"]);
      this.version = window["BeetleStudio"].version;
      this.builtOn = new Date(window["BeetleStudio"].builtOn);
      this.projectUrl = window["BeetleStudio"].url;
    } else {
      this.logger.log("[NavHeaderComponent] App info not found.");
    }
  }

  public user(): string {
    // TODO implement user()
    return this.userId;
  }

  public logout(): void {
    // TODO implement logout()
  }

}
