import { Injectable } from "@angular/core";
import { Http } from "@angular/http";
import { Connection } from "@connections/shared/connection.model";
import { ConnectionService } from "@connections/shared/connection.service";
import { NewConnection } from "@connections/shared/new-connection.model";
import { TemplateDefinition } from "@connections/shared/template-definition.model";
import { LoggerService } from "@core/logger.service";
import "rxjs/add/observable/of";
import "rxjs/add/observable/throw";
import "rxjs/add/operator/catch";
import "rxjs/add/operator/map";
import { Observable } from "rxjs/Observable";

@Injectable()
export class MockConnectionService extends ConnectionService {

  private newConnection = new NewConnection();
  private conn1 = new Connection();
  private conn2 = new Connection();
  private conn3 = new Connection();
  private conns: Connection[] = [this.conn1, this.conn2, this.conn3];
  private templ1 = new TemplateDefinition();
  private templ2 = new TemplateDefinition();
  private templ3 = new TemplateDefinition();
  private templs: TemplateDefinition[] = [this.templ1, this.templ2, this.templ3];

  constructor( http: Http, logger: LoggerService ) {
    super(http, logger);
  }

  /**
   * Get the connections from the komodo rest interface
   * @returns {Observable<Connection[]>}
   */
  public getAllConnections(): Observable<Connection[]> {
    return Observable.of(this.conns);
  }

  /**
   * Create a connection via the komodo rest interface
   * @param {NewConnection} connection
   * @returns {Observable<Connection>}
   */
  public createConnection(connection: NewConnection): Observable<NewConnection> {
    return Observable.of(this.newConnection);
  }

  /**
   * Delete a connection via the komodo rest interface
   * @param {NewConnection} connection
   * @returns {Observable<Connection>}
   */
  public deleteConnection(connection: NewConnection): Observable<NewConnection> {
    return Observable.of(this.newConnection);
  }

  /**
   * Get the connection templates from the komodo rest interface
   * @returns {Observable<Array<TemplateDefinition<any>>>}
   */
  public getConnectionTemplates(): Observable<TemplateDefinition[]> {
    return Observable.of(this.templs);
  }

}
