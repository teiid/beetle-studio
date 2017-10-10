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
import { NewActivity } from "@activities/shared/new-activity.model";
import { Component } from "@angular/core";
import { EventEmitter } from "@angular/core";
import { Output } from "@angular/core";
import { Router } from "@angular/router";
import { NewConnection } from "@connections/shared/new-connection.model";
import { LoggerService } from "@core/logger.service";

@Component({
  moduleId: module.id,
  selector: "app-add-activity-form",
  templateUrl: "./add-activity-form.component.html",
  styleUrls: ["./add-activity-form.component.css"]
})
export class AddActivityFormComponent {

  private model = new NewActivity();
  private creatingActivity = false;
  private logger: LoggerService;
  private router: Router;

  @Output() private createActivity = new EventEmitter<NewActivity>();

  constructor( router: Router, logger: LoggerService ) {
    this.router = router;
    this.logger = logger;
  }

  /**
   * @returns {string} the activity description
   */
  public get activityDescription(): string {
    return this.model.getDescription();
  }

  /**
   * @param {string} description the new activity description
   */
  public set activityDescription( description: string ) {
    this.model.setDescription( description );
  }

  /**
   * @returns {string} the activity name
   */
  public get activityName(): string {
    return this.model.getName();
  }

  /**
   * @param {string} name the new activity name
   */
  public set activityName( name: string ) {
    this.model.setName( name );
  }

  /**
   * @returns {string} the activity's source connection
   */
  public get activitySource(): NewConnection {
    return this.model.getSourceConnection();
  }

  /**
   * @param {string} source the new activity source
   */
  public set activitySource( source: NewConnection ) {
    this.model.setSourceConnection( source );
  }

  /**
   * @returns {string} the activity's target connection
   */
  public get activityTarget(): NewConnection {
    return this.model.getTargetConnection();
  }

  /**
   * @param {string} target the new activity target
   */
  public set activityTarget( target: NewConnection ) {
    this.model.setTargetConnection( target );
  }

  public get currentActivity(): string {
    return JSON.stringify(this.model);
  }

  /**
   * Called when the user clicks the "Create Activity" submit button on the form.
   */
  public onCreateActivity(): void {
    const activity: NewActivity = new NewActivity();
    activity.setName(this.model.getName());
    activity.setDescription(this.model.getDescription());
    activity.setSourceConnection(this.model.getSourceConnection());
    activity.setTargetConnection(this.model.getTargetConnection());

    this.logger.log("[AddActivityFormComponent] Firing create-activity event: %o", activity);

    this.creatingActivity = true;
    this.createActivity.emit(activity);
  }

  public cancelAdd(): void {
    const link: string[] = [ ActivitiesConstants.activitiesRootPath ];
    this.router.navigate(link);
  }

}
