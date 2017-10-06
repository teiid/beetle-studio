import {Activity } from "@activities/shared/activity.model";
import {NewActivity } from "@activities/shared/new-activity.model";
import {Injectable } from "@angular/core";
import {Http} from "@angular/http";
import {Connection} from "@connections/shared/connection.model";
import {NewConnection} from "@connections/shared/new-connection.model";
import "rxjs/add/observable/of";
import "rxjs/add/observable/throw";
import "rxjs/add/operator/catch";
import "rxjs/add/operator/map";

@Injectable()
export class MockActivityService {

  private activity1 = new Activity();
  private activity2 = new Activity();
  private activity3 = new Activity();
  private activities: Activity[] = [this.activity1, this.activity2, this.activity3];
  private newActivity1 = new NewActivity();

  private newConnection = new NewConnection();
  private conn1 = new Connection();
  private conn2 = new Connection();
  private conn3 = new Connection();
  private conns: Connection[] = [this.conn1, this.conn2, this.conn3];

  private http: Http;

  constructor( http: Http ) {
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
  }

  /**
   * Create an activity via the komodo rest interface
   * @param {NewActivity} activity
   * @returns {Activity}
   */
  public createActivity(activity: NewActivity): NewActivity {
    return this.newActivity1;
  }

  /**
   * Delete an activity via the komodo rest interface
   * @param {NewActivity} activity
   */
  public deleteActivity(activity: NewActivity): NewActivity {
    return null;
  }

}
