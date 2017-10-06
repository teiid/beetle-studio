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

import { Injectable } from "@angular/core";
import { Http } from "@angular/http";
import { Connection } from "@connections/shared/connection.model";
import { NewConnection } from "@connections/shared/new-connection.model";
import { ApiService } from "@core/api.service";
import { komodoWorkspaceUrl } from "@core/api.service";
import { Observable } from "rxjs/Observable";

@Injectable()
export class ConnectionService extends ApiService {

  private http: Http;

  constructor( http: Http ) {
    super();
    this.http = http;
  }

  /**
   * Get the connections from the komodo rest interface
   * @returns {Observable<Connection[]>}
   */
  public getAllConnections(): Observable<Connection[]> {
    return this.http
      .get(komodoWorkspaceUrl + "/connections", this.getAuthRequestOptions())
      .map((response) => {
        const connections = response.json();
        return connections.map((connection) => Connection.create( connection ));
      })
      .catch(this.handleError);
  }

  /**
   * Create a connection via the komodo rest interface
   * @param {NewConnection} connection
   * @returns {Observable<Connection>}
   */
  public createConnection(connection: NewConnection): Observable<NewConnection> {
    return this.http
      .post(komodoWorkspaceUrl + "/connections/" + connection.getName(), connection, this.getAuthRequestOptions())
      .map((response) => {
        return new Connection();
      })
      .catch(this.handleError);
  }

  /**
   * Delete a connection via the komodo rest interface
   * @param {NewConnection} connection
   * @returns {Observable<Connection>}
   */
  public deleteConnection(connection: NewConnection): Observable<NewConnection> {
    return this.http
      .delete(komodoWorkspaceUrl + "/connections/" + connection.getName(), this.getAuthRequestOptions())
      .map((response) => null)
      .catch(this.handleError);
  }

}
