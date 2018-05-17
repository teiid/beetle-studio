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
import { Http } from "@angular/http";
import { RouterModule } from "@angular/router";
import { AppSettingsService } from "@core/app-settings.service";
import { CoreModule } from "@core/core.module";
import { LoggerService } from "@core/logger.service";
import { DataservicesCardsComponent } from "@dataservices/dataservices-cards/dataservices-cards.component";
import { DataservicesDetailsComponent } from "@dataservices/dataservices-list/dataservices-details.component";
import { DataservicesListComponent } from "@dataservices/dataservices-list/dataservices-list.component";
import { ViewsContentComponent } from "@dataservices/dataservices-list/views-content.component";
import { DataservicesRoutingModule } from "@dataservices/dataservices-routing.module";
import { DataservicesComponent } from "@dataservices/dataservices.component";
import { DataserviceService } from "@dataservices/shared/dataservice.service";
import { MockDataserviceService } from "@dataservices/shared/mock-dataservice.service";
import { MockVdbService } from "@dataservices/shared/mock-vdb.service";
import { NotifierService } from "@dataservices/shared/notifier.service";
import { VdbService } from "@dataservices/shared/vdb.service";
import { WizardService } from "@dataservices/shared/wizard.service";
import { environment } from "@environments/environment";
import { ConfirmDialogComponent } from "@shared/confirm-dialog/confirm-dialog.component";
import { SharedModule } from "@shared/shared.module";
import { TreeModule } from "angular-tree-component";
import { CodemirrorModule } from "ng2-codemirror";
import { PatternFlyNgModule } from "patternfly-ng";
import { AddDataserviceWizardComponent } from "./add-dataservice-wizard/add-dataservice-wizard.component";
import { AddDataserviceComponent } from "./add-dataservice/add-dataservice.component";
import { ConnectionNodeSelectorComponent } from "./connection-node-selector/connection-node-selector.component";
import { ConnectionSchemaTreeComponent } from "./connection-schema-tree/connection-schema-tree.component";
import { DataserviceCardComponent } from "./dataservices-cards/dataservice-card/dataservice-card.component";
import { SelectedNodeComponent } from "./selected-node/selected-node.component";
import { SelectedNodesListComponent } from "./selected-nodes-list/selected-nodes-list.component";
import { SqlControlComponent } from "./sql-control/sql-control.component";
import { TestDataserviceComponent } from "./test-dataservice/test-dataservice.component";

@NgModule({
  imports: [
    DataservicesRoutingModule,
    CommonModule,
    CoreModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    PatternFlyNgModule,
    CodemirrorModule,
    TreeModule
  ],
  declarations: [
    DataservicesDetailsComponent,
    ViewsContentComponent,
    DataservicesCardsComponent,
    DataservicesComponent,
    DataservicesListComponent,
    AddDataserviceWizardComponent,
    AddDataserviceComponent,
    TestDataserviceComponent,
    SqlControlComponent,
    SelectedNodeComponent,
    DataserviceCardComponent,
    ConnectionSchemaTreeComponent,
    SelectedNodesListComponent,
    ConnectionNodeSelectorComponent
  ],
  providers: [
    {
      provide: DataserviceService,
      useFactory: dataserviceServiceFactory,
      deps: [ Http, VdbService, AppSettingsService, NotifierService, LoggerService ],
      multi: false
    },
    {
      provide: VdbService,
      useFactory: vdbServiceFactory,
      deps: [ Http, AppSettingsService, NotifierService, LoggerService ],
      multi: false
    },
    LoggerService,
    NotifierService,
    WizardService
  ],
  exports: [
  ],
  entryComponents: [ConfirmDialogComponent]
})
export class DataservicesModule { }

/**
 * A factory that produces the appropriate instance of the service based on current environment settings.
 *
 * @param {Http} http the HTTP service
 * @param {VdbService} vdbService the VDB service
 * @param {AppSettingsService} appSettings the app settings service
 * @param {NotifierService} notifierService the notifier service
 * @param {LoggerService} logger the logger
 * @returns {DataserviceService} the requested service
 */
export function dataserviceServiceFactory( http: Http,
                                           vdbService: VdbService,
                                           appSettings: AppSettingsService,
                                           notifierService: NotifierService,
                                           logger: LoggerService ): DataserviceService {
  return environment.production || !environment.uiDevMode ? new DataserviceService( http,
                                                                                    vdbService,
                                                                                    appSettings,
                                                                                    notifierService,
                                                                                    logger )
                                                          : new MockDataserviceService( http,
                                                                                        vdbService,
                                                                                        appSettings,
                                                                                        notifierService,
                                                                                        logger );
}

/**
 * A factory that produces the appropriate instance of the service based on current environment settings.
 *
 * @param {Http} http the HTTP service
 * @param {AppSettingsService} appSettings the app settings service
 * @param {NotifierService} notifierService the notifier service
 * @param {LoggerService} logger the logger
 * @returns {VdbService} the requested service
 */
export function vdbServiceFactory( http: Http,
                                   appSettings: AppSettingsService,
                                   notifierService: NotifierService,
                                   logger: LoggerService ): VdbService {
  return environment.production || !environment.uiDevMode ? new VdbService( http,
                                                                            appSettings,
                                                                            notifierService,
                                                                            logger )
                                                           : new MockVdbService( http,
                                                                                 appSettings,
                                                                                 notifierService,
                                                                                 logger );
}
