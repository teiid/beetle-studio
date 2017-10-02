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

import {ModuleWithProviders} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

/* Pages */
import { ConnectionsComponent } from "@connections/connections.component";
import { AddConnectionComponent } from "@connections/add-connection/add-connection.component";
import { ActivitiesComponent } from "@activities/activities.component";
import { AddActivityComponent } from "@activities/add-activity/add-activity.component";
import { EditConnectionComponent } from "@connections/edit-connection/edit-connection.component";


const _appRoutes: any[] = [
  {
    path: 'activities',
    component: ActivitiesComponent
  },
  {
    path: 'activities/add-activity',
    component: AddActivityComponent
  },
  {
    path: 'connections',
    component: ConnectionsComponent
  },
  {
    path: 'connections/add-connection',
    component: AddConnectionComponent
  },
  {
    path: 'connections/edit-connection',
    component: EditConnectionComponent
  }
];

export const AppRouting: ModuleWithProviders = RouterModule.forRoot(_appRoutes);
