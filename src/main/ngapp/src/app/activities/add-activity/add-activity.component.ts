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
import { ActivityService } from "@activities/shared/activity.service";
import { AddActivityFormComponent } from "@activities/shared/add-activity-form/add-activity-form.component";
import { NewActivity } from "@activities/shared/new-activity.model";
import { Component } from "@angular/core";
import { ViewChild } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Router } from "@angular/router";
import { AbstractPageComponent } from "@shared/abstract-page.component";

@Component({
  moduleId: module.id,
  selector: "app-add-activity",
  templateUrl: "./add-activity.component.html",
  styleUrls: ["./add-activity.component.css"]
})
export class AddActivityComponent extends AbstractPageComponent {

  public readonly activitiesLink = ActivitiesConstants.activitiesRootPath;

  private router: Router;
  private activityService: ActivityService;

  @ViewChild(AddActivityFormComponent) private form: AddActivityFormComponent;

  constructor(router: Router, route: ActivatedRoute, activityService: ActivityService) {
    super(route);
    this.router = router;
    this.activityService = activityService;
  }

  /**
   * Called when the Add Activity form (component) emits a "add-activity" event.  This is bound to
   * from the add-activity.page.html template.
   * @param {NewActivity} activity
   */
  public onCreateActivity(activity: NewActivity): void {
    console.log("[AddActivityComponent] onCreateActivity(): " + JSON.stringify(activity));
    this.activityService.createActivity(activity);
    const link: string[] = [ ActivitiesConstants.activitiesRootPath ];
    console.log("[AddActivityComponent] Navigating to: %o", link);
    this.router.navigate(link);
  }

}
