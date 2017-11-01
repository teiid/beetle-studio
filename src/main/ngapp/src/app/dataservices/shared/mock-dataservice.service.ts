import { Injectable } from "@angular/core";
import { Http } from "@angular/http";
import { LoggerService } from "@core/logger.service";
import { Dataservice } from "@dataservices/shared/dataservice.model";
import { DataserviceService } from "@dataservices/shared/dataservice.service";
import { NewDataservice } from "@dataservices/shared/new-dataservice.model";
import "rxjs/add/observable/of";
import "rxjs/add/observable/throw";
import "rxjs/add/operator/catch";
import "rxjs/add/operator/map";
import { Observable } from "rxjs/Observable";

@Injectable()
export class MockDataserviceService extends DataserviceService {

  private newDataservice = new NewDataservice();
  private serv1 = new Dataservice();
  private serv2 = new Dataservice();
  private serv3 = new Dataservice();
  private services: Dataservice[] = [this.serv1, this.serv2, this.serv3];

  constructor( http: Http, logger: LoggerService ) {
    super(http, logger);
    this.serv1.setId("serv1");
    this.serv2.setId("serv2");
    this.serv3.setId("serv3");
  }

  /**
   * Get the dataservices from the komodo rest interface
   * @returns {Observable<Dataservice[]>}
   */
  public getAllDataservices(): Observable<Dataservice[]> {
    return Observable.of(this.services);
  }

  /**
   * Create a dataservice via the komodo rest interface
   * @param {NewDataservice} dataservice
   * @returns {Observable<Dataservice>}
   */
  public createDataservice(dataservice: NewDataservice): Observable<NewDataservice> {
    return Observable.of(this.newDataservice);
  }

  /**
   * Delete a dataservice via the komodo rest interface
   * @param {NewDataservice} dataservice
   * @returns {Observable<Dataservice>}
   */
  public deleteDataservice(dataservice: NewDataservice): Observable<NewDataservice> {
    return Observable.of(this.newDataservice);
  }

}
