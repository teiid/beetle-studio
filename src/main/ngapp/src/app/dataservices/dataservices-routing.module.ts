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

import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { Routes } from "@angular/router";
import { DataservicesComponent } from "@dataservices/dataservices.component";
import { DataservicesConstants } from "@dataservices/shared/dataservices-constants";
import { TestDataserviceComponent } from "@dataservices/test-dataservice/test-dataservice.component";
import { ViewEditorComponent } from "@dataservices/virtualization/view-editor/view-editor.component";

const dataservicesRoutes: Routes = [
  { path: DataservicesConstants.dataservicesRootRoute, component: DataservicesComponent },
  { path: DataservicesConstants.viewRoute, component: ViewEditorComponent },
  { path: DataservicesConstants.testDataserviceRoute, component: TestDataserviceComponent }
];

@NgModule({
  imports: [
    RouterModule.forChild( dataservicesRoutes )
  ],
  exports: [
    RouterModule
  ]
})
export class DataservicesRoutingModule {}
