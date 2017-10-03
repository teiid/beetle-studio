import {Injectable } from '@angular/core';
import {Http} from '@angular/http';
import {environment} from "@environments/environment";
import {Connection} from '@connections/shared/connection.model';
import {NewConnection} from '@connections/shared/new-connection.model';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import 'rxjs/add/observable/of';

const KOMODO_WORKSPACE_URL = environment.komodoWorkspaceUrl;

@Injectable()
export class MockConnectionService {

  newConnection = new NewConnection();
  conn1 = new Connection();
  conn2 = new Connection();
  conn3 = new Connection();
  conns: Connection[] = [this.conn1, this.conn2, this.conn3];

  constructor( private http: Http ) {
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

}
