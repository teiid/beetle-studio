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
import { EventEmitter } from '@angular/core';
import { OnInit } from '@angular/core';
import { Output } from '@angular/core';
import { Router } from '@angular/router';

import { NewActivity } from '@activities/shared/new-activity.model';

@Component({
  selector: 'app-add-activity-form',
  templateUrl: './add-activity-form.component.html',
  styleUrls: ['./add-activity-form.component.css']
})
export class AddActivityFormComponent implements OnInit {

  @Output() onCreateActivity = new EventEmitter<NewActivity>();

  model = new NewActivity();
  creatingActivity = false;

  constructor( private router: Router ) { }

  ngOnInit() {
  }

  get currentActivity() { return JSON.stringify(this.model); }

  /**
   * Called when the user clicks the "Create Activity" submit button on the form.
   */
  public createActivity(): void {
    const activity: NewActivity = new NewActivity();
    activity.setName(this.model.getName());
    activity.setDescription(this.model.getDescription());
    activity.setSourceConnection(this.model.getSourceConnection());
    activity.setTargetConnection(this.model.getTargetConnection());

    console.log('[AddActivityFormComponent] Firing create-activity event: %o', activity);

    this.creatingActivity = true;
    this.onCreateActivity.emit(activity);
  }

  public cancelAdd(): void {
    const link: string[] = [ '/activities' ];
    this.router.navigate(link);
  }

}
