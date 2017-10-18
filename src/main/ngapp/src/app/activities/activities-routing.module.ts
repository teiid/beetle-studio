/**
 * @license
 * Copyright 2017 JBoss Inc
 *
 * Licensed under the Apache License, /
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { ActivitiesComponent } from "@activities/activities.component";
import { AddActivityComponent } from "@activities/add-activity/add-activity.component";
import { ActivitiesConstants } from "@activities/shared/activities-constants";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { Routes } from "@angular/router";

const activitiesRoutes: Routes = [
  { path: ActivitiesConstants.activitiesRootRoute, component: ActivitiesComponent },
  { path: ActivitiesConstants.addActivityRoute, component: AddActivityComponent }
//  { path: ActivitiesConstants.editActivityRoute, component: EditActivityComponent }
];

@NgModule({
  imports: [
    RouterModule.forChild( activitiesRoutes )
  ],
  exports: [
    RouterModule
  ]
})
export class ActivitiesRoutingModule {}
