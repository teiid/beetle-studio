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
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { AddConnectionWizardComponent } from "@connections/add-connection-wizard/add-connection-wizard.component";
import { AddConnectionComponent } from "@connections/add-connection/add-connection.component";
import { ConnectionCardComponent } from "@connections/connections-cards/connection-card/connection-card.component";
import { ConnectionsCardsComponent } from "@connections/connections-cards/connections-cards.component";
import { ConnectionDetailsComponent } from "@connections/connections-list/connection-details.component";
import { ConnectionsListComponent } from "@connections/connections-list/connections-list.component";
import { ConnectionsRoutingModule } from "@connections/connections-routing.module";
import { ConnectionsComponent } from "@connections/connections.component";
import { ConnectionService } from "@connections/shared/connection.service";
import { CoreModule } from "@core/core.module";
import { LoggerService } from "@core/logger.service";
import { SharedModule } from "@shared/shared.module";
import { PatternFlyNgModule } from "patternfly-ng";

@NgModule({
  imports: [
    ConnectionsRoutingModule,
    CommonModule,
    CoreModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    PatternFlyNgModule
  ],
  declarations: [
    ConnectionDetailsComponent,
    ConnectionCardComponent,
    ConnectionsCardsComponent,
    ConnectionsComponent,
    ConnectionsListComponent,
    AddConnectionWizardComponent,
    AddConnectionComponent,
    ConnectionCardComponent
  ],
  providers: [
    ConnectionService,
    LoggerService
  ],
  exports: [
  ]
})
export class ConnectionsModule { }
