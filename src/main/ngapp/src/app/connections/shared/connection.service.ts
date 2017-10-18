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
import { ConnectionsConstants } from "@connections/shared/connections-constants";
import { NewConnection } from "@connections/shared/new-connection.model";
import { TemplateDefinition } from "@connections/shared/template-definition.model";
import { ApiService } from "@core/api.service";
import { LoggerService } from "@core/logger.service";
import { environment } from "@environments/environment";
import { PropertyDefinition } from "@shared/property-form/property-definition.model";
import { Observable } from "rxjs/Observable";

@Injectable()
export class ConnectionService extends ApiService {

  private http: Http;

  constructor( http: Http, logger: LoggerService ) {
    super( logger  );
    this.http = http;
  }

  /**
   * Get the connections from the komodo rest interface
   * @returns {Observable<Connection[]>}
   */
  public getAllConnections(): Observable<Connection[]> {
    return this.http
      .get(environment.komodoWorkspaceUrl + ConnectionsConstants.connectionsRootPath, this.getAuthRequestOptions())
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
      .post(environment.komodoWorkspaceUrl + ConnectionsConstants.connectionsRootPath + "/" + connection.getName(),
             connection, this.getAuthRequestOptions())
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
      .delete(environment.komodoWorkspaceUrl + ConnectionsConstants.connectionsRootPath + "/" + connection.getName(),
               this.getAuthRequestOptions())
      .map((response) => null)
      .catch(this.handleError);
  }

  /**
   * Get the connection templates from the komodo rest interface
   * @returns {Observable<Array<TemplateDefinition<any>>>}
   */
  public getConnectionTemplates(): Observable<TemplateDefinition[]> {
    return this.http
      .get( environment.komodoTeiidUrl + "/templates", this.getAuthRequestOptions())
      .map((response) => {
        const templates = response.json();
        return templates.map((template) => TemplateDefinition.create( template ));
      })
      .catch(this.handleError);
  }

  /**
   * Get the connection template property definitions from the komodo rest interface
   * @param {string} templateName
   * @returns {Observable<Array<PropertyDefinition<any>>>}
   */
  public getConnectionTemplateProperties(templateName: string): Observable<Array<PropertyDefinition<any>>> {
    return this.http
      .get( environment.komodoTeiidUrl + "/templates/" + templateName + "/entries", this.getAuthRequestOptions())
      .map((response) => {
        const entries = response.json() as Array<PropertyDefinition<any>>;
        return entries.map((entry) => PropertyDefinition.create( entry ));
      })
      .catch(this.handleError);
  }

}
