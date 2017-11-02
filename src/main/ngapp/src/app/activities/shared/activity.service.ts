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

import { Activity } from "@activities/shared/activity.model";
import { NewActivity } from "@activities/shared/new-activity.model";
import { Injectable } from "@angular/core";
import { Http } from "@angular/http";
import { ApiService } from "@core/api.service";
import { LoggerService } from "@core/logger.service";
import "rxjs/add/observable/of";
import { Observable } from "rxjs/Observable";

@Injectable()
export class ActivityService extends ApiService {

  private http: Http;

  constructor( http: Http, logger: LoggerService ) {
    super( logger );
    this.http = http;
  }

  /**
   * Get the activities from the komodo rest interface
   * @returns {Activity[]}
   */
  public getAllActivities(): Observable<Activity[]> {
    let activities = JSON.parse(localStorage.getItem("activities"));
    if (!activities) {
      activities = [];
    }
    return Observable.of(this.convertObjectArray(activities));
  }

  /**
   * Create an activity via the komodo rest interface
   * @param {NewActivity} activity
   * @returns {Activity}
   */
  public createActivity(activity: NewActivity): Observable<NewActivity> {
    const act = new Activity();
    act.setId(activity.getName());
    act.setSourceConnection(activity.getSourceConnection().getName());
    act.setTargetConnection(activity.getTargetConnection().getName());

    let activities = JSON.parse(localStorage.getItem("activities"));
    if (!activities) {
      activities = [];
    }
    activities.push(act);
    localStorage.setItem("activities", JSON.stringify(activities));

    return Observable.of(activity);
  }

  /**
   * Delete an activity via the komodo rest interface
   * @param {NewActivity} activity
   */
  public deleteActivity(activity: NewActivity): Observable<NewActivity> {
    let activities = JSON.parse(localStorage.getItem("activities"));
    if (!activities) {
      activities = [];
    }

    const indexOfDeleted = activities.findIndex((i) => i.keng__id === activity.getName());
    activities.splice(indexOfDeleted, 1);

    localStorage.setItem("activities", JSON.stringify(activities));

    return Observable.of(null);
  }

  /*
   * TODO: Remove after komodo REST is available
   * This is a helper method to convert Object array to Activity array.
   * This can be removed once we connect to the komodo rest service
   */
  private convertObjectArray(objArray: [any]): Activity[] {
    const activityArray = [];

    for (const obj of objArray) {
      const act: Activity = new Activity();
      act.setId(obj.keng__id);
      act.setSourceConnection(obj.dv__sourceConnection);
      act.setTargetConnection(obj.dv__targetConnection);
      activityArray.push(act);
    }

    return activityArray;
  }
}
