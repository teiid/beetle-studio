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

import { ActivitiesCardsComponent } from "@activities/activities-cards/activities-cards.component";
import { ActivitiesListComponent } from "@activities/activities-list/activities-list.component";
import { ActivitiesRoutingModule } from "@activities/activities-routing.module";
import { ActivitiesComponent } from "@activities/activities.component";
import { AddActivityWizardComponent } from "@activities/add-activity-wizard/add-activity-wizard.component";
import { AddActivityComponent } from "@activities/add-activity/add-activity.component";
import { ActivityService } from "@activities/shared/activity.service";
import { AddActivityFormComponent } from "@activities/shared/add-activity-form/add-activity-form.component";
import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { ConnectionsModule } from "@connections/connections.module";
import { CoreModule } from "@core/core.module";
import { LoggerService } from "@core/logger.service";
import { SharedModule } from "@shared/shared.module";
import { PatternFlyNgModule } from "patternfly-ng";

@NgModule({
  imports: [
    ActivitiesRoutingModule,
    CommonModule,
    ConnectionsModule,
    CoreModule,
    SharedModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    PatternFlyNgModule
  ],
  declarations: [
    ActivitiesCardsComponent,
    ActivitiesComponent,
    ActivitiesListComponent,
    AddActivityComponent,
    AddActivityFormComponent,
    AddActivityWizardComponent
  ],
  providers: [
    ActivityService,
    LoggerService
  ]
})
export class ActivitiesModule {}
