import { Activity } from "@activities/shared/activity.model";
import { ActivityService } from "@activities/shared/activity.service";
import { NewActivity } from "@activities/shared/new-activity.model";
import { Injectable } from "@angular/core";
import { Http } from "@angular/http";
import { Connection } from "@connections/shared/connection.model";
import { NewConnection } from "@connections/shared/new-connection.model";
import { LoggerService } from "@core/logger.service";
import "rxjs/add/observable/of";
import "rxjs/add/observable/throw";
import "rxjs/add/operator/catch";
import "rxjs/add/operator/map";

@Injectable()
export class MockActivityService extends ActivityService {

  private act1 = new Activity();
  private act2 = new Activity();
  private act3 = new Activity();
  private acts: Activity[] = [this.act1, this.act2, this.act3];
  private newAct1 = new NewActivity();

  private newConnection = new NewConnection();
  private conn1 = new Connection();
  private conn2 = new Connection();
  private conn3 = new Connection();
  private conns: Connection[] = [this.conn1, this.conn2, this.conn3];

  constructor( http: Http, logger: LoggerService ) {
    super(http, logger);
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
    srcConn.setJndiName("new1SrcJndi");
    srcConn.setDriverName("new1SrcDriver");
    srcConn.setJdbc(true);
    this.newAct1.setSourceConnection(srcConn);
    const tgtConn = new NewConnection();
    tgtConn.setName("new1Tgt");
    tgtConn.setJndiName("new1TgtJndi");
    tgtConn.setDriverName("new1TgtDriver");
    tgtConn.setJdbc(false);
    this.newAct1.setTargetConnection(tgtConn);

  }

  /**
   * Get the activities from the komodo rest interface
   * @returns {Activity[]}
   */
  public getAllActivities(): Activity[] {
    return this.acts;
  }

  /**
   * Create an activity via the komodo rest interface
   * @param {NewActivity} activity
   * @returns {Activity}
   */
  public createActivity(activity: NewActivity): NewActivity {
    return this.newAct1;
  }

  /**
   * Delete an activity via the komodo rest interface
   * @param {NewActivity} activity
   */
  public deleteActivity(activity: NewActivity): NewActivity {
    return null;
  }

}
