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
import { ActivityService } from "@activities/shared/activity.service";
import { NewActivity } from "@activities/shared/new-activity.model";
import { Injectable } from "@angular/core";
import { Http } from "@angular/http";
import { NewConnection } from "@connections/shared/new-connection.model";
import { AppSettingsService } from "@core/app-settings.service";
import { LoggerService } from "@core/logger.service";
import "rxjs/add/observable/of";
import "rxjs/add/observable/throw";
import "rxjs/add/operator/catch";
import "rxjs/add/operator/map";
import { Observable } from "rxjs/Observable";

@Injectable()
export class MockActivityService extends ActivityService {

  private act1 = new Activity();
  private act2 = new Activity();
  private act3 = new Activity();
  private acts: Activity[] = [this.act1, this.act2, this.act3];
  private newAct1 = new NewActivity();

  constructor( http: Http, appSettings: AppSettingsService, logger: LoggerService ) {
    super(http, appSettings, logger);
    this.act1.setId("activity1");
    this.act1.setSourceConnection("activity1SrcConn");
    this.act1.setTargetConnection("activity1TgtConn");
    this.act2.setId("activity2");
    this.act2.setSourceConnection("activity2SrcConn");
    this.act2.setTargetConnection("activity2TgtConn");
    this.act3.setId("activity3");
    this.act3.setSourceConnection("activity3SrcConn");
    this.act3.setTargetConnection("activity3TgtConn");
    this.newAct1.setName("newActivity1");
    const srcConn = new NewConnection();
    srcConn.setName("new1Src");
    srcConn.setDescription("new1SrcDescription");
    srcConn.setServiceCatalogSource("new1SvcCatSrc");
    this.newAct1.setSourceConnection(srcConn);
    const tgtConn = new NewConnection();
    tgtConn.setName("new1Tgt");
    tgtConn.setDescription("new1TgtDescription");
    tgtConn.setServiceCatalogSource("new1SvcCatSrc");
    this.newAct1.setTargetConnection(tgtConn);

  }

  /**
   * Get the activities from the komodo rest interface
   * @returns {Activity[]}
   */
  public getAllActivities(): Observable<Activity[]> {
    return Observable.of(this.acts);
  }

  /**
   * Create an activity via the komodo rest interface
   * @param {NewActivity} activity
   * @returns {Activity}
   */
  public createActivity(activity: NewActivity): Observable<NewActivity> {
    return Observable.of(this.newAct1);
  }

  /**
   * Delete an activity via the komodo rest interface
   * @param {NewActivity} activity
   */
  public deleteActivity(activity: NewActivity): Observable<NewActivity> {
    return Observable.of(null);
  }

}
