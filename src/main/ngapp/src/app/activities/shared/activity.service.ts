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
import { NewConnection } from "@connections/shared/new-connection.model";
import { ApiService } from "@core/api.service";
import { LoggerService } from "@core/logger.service";

@Injectable()
export class ActivityService extends ApiService {

  private activity1 = new Activity();
  private activity2 = new Activity();
  private activity3 = new Activity();
  private activities: Activity[] = [this.activity1, this.activity2, this.activity3];
  private newActivity1 = new NewActivity();
  private http: Http;

  constructor( http: Http, logger: LoggerService ) {
    super( logger );
    this.http = http;
    this.activity1.setId("activity1");
    this.activity1.setSourceConnection("activity1SrcConn");
    this.activity1.setTargetConnection("activity1TgtConn");
    this.activity2.setId("activity2");
    this.activity2.setSourceConnection("activity2SrcConn");
    this.activity2.setTargetConnection("activity2TgtConn");
    this.activity3.setId("activity3");
    this.activity3.setSourceConnection("activity3SrcConn");
    this.activity3.setTargetConnection("activity3TgtConn");
    this.newActivity1.setName("newActivity1");
    const srcConn = new NewConnection();
    srcConn.setName("new1Src");
    srcConn.setJndiName("new1SrcJndi");
    srcConn.setDriverName("new1SrcDriver");
    srcConn.setJdbc(true);
    this.newActivity1.setSourceConnection(srcConn);
    const tgtConn = new NewConnection();
    tgtConn.setName("new1Tgt");
    tgtConn.setJndiName("new1TgtJndi");
    tgtConn.setDriverName("new1TgtDriver");
    tgtConn.setJdbc(false);
    this.newActivity1.setTargetConnection(tgtConn);
  }

  /**
   * Get the activities from the komodo rest interface
   * @returns {Activity[]}
   */
  public getAllActivities(): Activity[] {
    return this.activities;
    /*
    return this.http
      .get(komodoWorkspaceUrl + '/activities', this.getAuthRequestOptions())
      .map(response => {
        const activities = response.json();
        return activities.map((activity) => {const activ = new Activity(); activ.setValues(activity); return activ; });
      })
      .catch(this.handleError);
      */
  }

  /**
   * Create an activity via the komodo rest interface
   * @param {NewActivity} activity
   * @returns {Activity}
   */
  public createActivity(activity: NewActivity): NewActivity {
    // TODO implement createActivity()
    return this.newActivity1;
    /*
    return this.http
      .post(komodoWorkspaceUrl + '/activities/' + activity.name, activity, this.getAuthRequestOptions())
      .map(response => {
        return new Activity();
      })
      .catch(this.handleError);
      */
  }

  /**
   * Delete an activity via the komodo rest interface
   * @param {NewActivity} activity
   */
  public deleteActivity(activity: NewActivity): NewActivity {
    // TODO implement deleteActivity()
    /*
    return this.http
      .doDelete(komodoWorkspaceUrl + '/activities/' + activity.name, this.getAuthRequestOptions())
      .map(response => null)
      .catch(this.handleError);
      */
    return null;
  }

}
