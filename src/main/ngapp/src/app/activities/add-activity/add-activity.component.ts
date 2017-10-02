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

import { Component } from '@angular/core';
import { ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

import { ActivityService } from '@activities/shared/activity.service';
import { AddActivityFormComponent } from '@activities/shared/add-activity-form/add-activity-form.component';
import { NewActivity } from '@activities/shared/new-activity.model';
import { AbstractPageComponent } from '@shared/abstract-page.component';

@Component({
  selector: 'app-add-activity',
  templateUrl: './add-activity.component.html',
  styleUrls: ['./add-activity.component.css']
})
export class AddActivityComponent extends AbstractPageComponent {

  @ViewChild(AddActivityFormComponent) form: AddActivityFormComponent;

  constructor(private router: Router, route: ActivatedRoute, private activityService: ActivityService) {
    super(route);
  }

  /**
   * Called when the Add Activity form (component) emits a "add-activity" event.  This is bound to
   * from the add-activity.page.html template.
   * @param {NewActivity} activity
   */
  public onCreateActivity(activity: NewActivity) {
    console.log('[AddActivityComponent] onCreateActivity(): ' + JSON.stringify(activity));
    this.activityService.createActivity(activity);
    const link: string[] = [ '/activities' ];
    console.log('[AddActivityComponent] Navigating to: %o', link);
    this.router.navigate(link);
  }

}
