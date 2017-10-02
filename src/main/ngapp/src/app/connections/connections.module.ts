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

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { AddConnectionComponent } from "@connections/add-connection/add-connection.component";
import { AddConnectionFormComponent } from "@connections/shared/add-connection-form/add-connection-form.component";
import { ConnectionsCardsComponent } from "@connections/connections-cards/connections-cards.component";
import { ConnectionsComponent } from "@connections/connections.component";
import { ConnectionsListComponent } from "@connections/connections-list/connections-list.component";
import { EditConnectionComponent } from "@connections/edit-connection/edit-connection.component";
import { CoreModule } from "@core/core.module";
import { SharedModule } from "@shared/shared.module";
import { ConnectionService } from "@connections/shared/connection.service";
import { NewConnection } from "@connections/shared/new-connection.model";

@NgModule({
  imports: [
    CommonModule,
    CoreModule,
    SharedModule,
  ],
  declarations: [
    AddConnectionComponent,
    AddConnectionFormComponent,
    ConnectionsCardsComponent,
    ConnectionsComponent,
    ConnectionsListComponent,
    EditConnectionComponent
  ],
  providers: [
    ConnectionService
  ],
  exports: [
    NewConnection
  ]
})
export class ConnectionsModule { }
