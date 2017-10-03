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
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";

import { ActivitiesCardsComponent } from "@activities/activities-cards/activities-cards.component";
import { ActivitiesComponent } from "@activities/activities.component";
import { ActivitiesListComponent } from "@activities/activities-list/activities-list.component";
import { ActivitiesRoutingModule } from "@activities/activities-routing.module";
import { AddActivityComponent } from "@activities/add-activity/add-activity.component";
import { AddActivityFormComponent } from "@activities/shared/add-activity-form/add-activity-form.component";
import { ActivityService } from "@activities/shared/activity.service";
import { ConnectionsModule } from "@connections/connections.module";
import { CoreModule } from "@core/core.module";
import { SharedModule } from "@shared/shared.module";

@NgModule({
  imports: [
    ActivitiesRoutingModule,
    CommonModule,
    ConnectionsModule,
    CoreModule,
    SharedModule,
    RouterModule,
    FormsModule
  ],
  declarations: [
    ActivitiesCardsComponent,
    ActivitiesComponent,
    ActivitiesListComponent,
    AddActivityComponent,
    AddActivityFormComponent
  ],
  providers: [
    ActivityService
  ]})
export class ActivitiesModule { }
