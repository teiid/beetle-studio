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

import { Component, TemplateRef } from "@angular/core";
import { LoggerService } from "@core/logger.service";
import { BsModalRef } from "ngx-bootstrap/modal/modal-options.class";
import { BsModalService } from "ngx-bootstrap/modal";
import { AboutEvent } from "@core/about-dialog/about-event";
import { AboutService } from "@core/about-dialog/about.service";
import { About } from "@core/about-dialog/about.model";

@Component({
  moduleId: module.id,
  selector: "app-nav-header",
  templateUrl: "./nav-header.component.html",
  styleUrls: [ "./nav-header.component.less" ]
})
export class NavHeaderComponent {

  private aboutRef: BsModalRef;
  private logger: LoggerService;
  private modalService: BsModalService;
  private aboutService: AboutService;
  public aboutInfo: About;

  constructor( logger: LoggerService,
               modalService: BsModalService,
               aboutService: AboutService ) {
    this.logger = logger;
    this.modalService = modalService;
    this.aboutService = aboutService;
  }

  public closeAbout( $event: AboutEvent ): void {
    this.aboutRef.hide();
  }

  public openAbout( template: TemplateRef< any > ): void {
    const self = this;

    this.aboutService.getAboutInformation().subscribe(
      ( result ) => {
        self.aboutInfo = result;
      },
      ( error ) => {
        this.logger.error( error, "Error getting about information.");
      }
    );

    this.aboutRef = this.modalService.show( template );
  }

}
