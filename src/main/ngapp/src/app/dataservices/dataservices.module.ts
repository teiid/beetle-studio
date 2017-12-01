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
import { CoreModule } from "@core/core.module";
import { LoggerService } from "@core/logger.service";
import { DataservicesCardsComponent } from "@dataservices/dataservices-cards/dataservices-cards.component";
import { DataservicesListComponent } from "@dataservices/dataservices-list/dataservices-list.component";
import { DataservicesRoutingModule } from "@dataservices/dataservices-routing.module";
import { DataservicesComponent } from "@dataservices/dataservices.component";
import { DataserviceService } from "@dataservices/shared/dataservice.service";
import { VdbService } from "@dataservices/shared/vdb.service";
import { SharedModule } from "@shared/shared.module";
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PatternFlyNgModule } from "patternfly-ng";
import { AddDataserviceWizardComponent } from "./add-dataservice-wizard/add-dataservice-wizard.component";
import { AddDataserviceComponent } from "./add-dataservice/add-dataservice.component";
import { ConnectionTableSelectorComponent } from "./connection-table-selector/connection-table-selector.component";
import { JdbcTableSelectorComponent } from "./jdbc-table-selector/jdbc-table-selector.component";
import { SqlControlComponent } from "./sql-control/sql-control.component";
import { TestDataserviceComponent } from "./test-dataservice/test-dataservice.component";

@NgModule({
  imports: [
    DataservicesRoutingModule,
    CommonModule,
    CoreModule,
    SharedModule,
    FormsModule,
    NgxDatatableModule,
    ReactiveFormsModule,
    RouterModule,
    PatternFlyNgModule
  ],
  declarations: [
    DataservicesCardsComponent,
    DataservicesComponent,
    DataservicesListComponent,
    AddDataserviceWizardComponent,
    AddDataserviceComponent,
    ConnectionTableSelectorComponent,
    JdbcTableSelectorComponent,
    TestDataserviceComponent,
    SqlControlComponent
  ],
  providers: [
    DataserviceService,
    VdbService,
    LoggerService
  ],
  exports: [
  ]
})
export class DataservicesModule { }
