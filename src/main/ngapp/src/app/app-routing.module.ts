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

import { ActivitiesConstants } from "@activities/shared/activities-constants";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { Routes } from "@angular/router";
import { ConnectionsConstants } from "@connections/shared/connections-constants";
import { DataservicesConstants } from "@dataservices/shared/dataservices-constants";
import { environment } from "@environments/environment";
import { PageNotFoundComponent } from "@shared/page-not-found/page-not-found.component";

const appRoutes: Routes = [
  { path: "", redirectTo: environment.homePagePath, pathMatch: "full" },
  { path: ConnectionsConstants.connectionsRootRoute, loadChildren: "@connections/connections.module#ConnectionsModule" },
  { path: ActivitiesConstants.activitiesRootRoute, loadChildren: "@activities/activities.module#ActivitiesModule" },
  { path: DataservicesConstants.dataservicesRootRoute, loadChildren: "@dataservices/dataservices.module#DataservicesModule" },
  { path: "**", component: PageNotFoundComponent }, // always last
];

@NgModule({
  imports: [
    RouterModule.forRoot( appRoutes )
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule {}
