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

import { CommonModule } from "@angular/common";
import { NgModule, Optional, SkipSelf } from "@angular/core";
import { HttpModule } from "@angular/http";
import { RouterModule } from "@angular/router";
import { AboutDialogComponent } from "@core/about-dialog/about-dialog.component";
import { AboutService } from "@core/about-dialog/about.service";
import { AppSettingsService } from "@core/app-settings.service";
import { BreadcrumbComponent } from "@core/breadcrumbs/breadcrumb/breadcrumb.component";
import { BreadcrumbsComponent } from "@core/breadcrumbs/breadcrumbs.component";
import { LoggerService } from "@core/logger.service";
import { VerticalNavComponent } from "@core/vertical-nav/vertical-nav.component";
import { ModalModule } from "ngx-bootstrap/modal";
import { BsModalService } from "ngx-bootstrap/modal";
import { PatternFlyNgModule } from "patternfly-ng";

@NgModule({
  imports: [
    CommonModule,
    HttpModule,
    ModalModule,
    PatternFlyNgModule,
    RouterModule
  ],
  declarations: [
    AboutDialogComponent,
    BreadcrumbComponent,
    BreadcrumbsComponent,
    VerticalNavComponent
  ],
  exports: [
    BreadcrumbComponent,
    BreadcrumbsComponent,
    VerticalNavComponent
  ],
  providers: [
    AboutService,
    AppSettingsService,
    LoggerService,
    BsModalService
  ]
})
export class CoreModule {

  constructor( @Optional() @SkipSelf() parentModule: CoreModule ) {
    if ( parentModule ) {
      throw new Error( "CoreModule is already loaded and should only be mported by the AppModule." );
    }
  }

}
