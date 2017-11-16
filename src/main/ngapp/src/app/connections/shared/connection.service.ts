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
import { JdbcTableFilter } from "@connections/shared/jdbc-table-filter.model";
import { NewConnection } from "@connections/shared/new-connection.model";
import { SchemaInfo } from "@connections/shared/schema-info.model";
import { TemplateDefinition } from "@connections/shared/template-definition.model";
import { ApiService } from "@core/api.service";
import { AppSettingsService } from "@core/app-settings.service";
import { LoggerService } from "@core/logger.service";
import { environment } from "@environments/environment";
import { PropertyDefinition } from "@shared/property-form/property-definition.model";
import { Observable } from "rxjs/Observable";

@Injectable()
export class ConnectionService extends ApiService {

  private http: Http;

  constructor( http: Http, appSettings: AppSettingsService, logger: LoggerService ) {
    super( appSettings, logger  );
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
      .catch( ( error ) => this.handleError( error ) );
  }

  /**
   * Create a connection via the komodo rest interface
   * @param {NewConnection} connection
   * @returns {Observable<boolean>}
   */
  public createConnection(connection: NewConnection): Observable<boolean> {
    return this.http
      .post(environment.komodoWorkspaceUrl + ConnectionsConstants.connectionsRootPath + "/" + connection.getName(),
             connection, this.getAuthRequestOptions())
      .map((response) => {
        return response.ok;
      })
      .catch( ( error ) => this.handleError( error ) );
  }

  /**
   * Delete a connection via the komodo rest interface
   * @param {string} connectionId
   * @returns {Observable<boolean>}
   */
  public deleteConnection(connectionId: string): Observable<boolean> {
    return this.http
      .delete(environment.komodoWorkspaceUrl + ConnectionsConstants.connectionsRootPath + "/" + connectionId,
               this.getAuthRequestOptions())
      .map((response) => {
        return response.ok;
      })
      .catch( ( error ) => this.handleError( error ) );
  }

  /**
   * Get the connection templates from the komodo rest interface
   * @returns {Observable<TemplateDefinition[]>}
   */
  public getConnectionTemplates(): Observable<TemplateDefinition[]> {
    return this.http
      .get( environment.komodoTeiidUrl + "/templates", this.getAuthRequestOptions())
      .map((response) => {
        const templates = response.json();
        return templates.map((template) => TemplateDefinition.create( template ));
      })
      .catch( ( error ) => this.handleError( error ) );
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
      .catch( ( error ) => this.handleError( error ) );
  }

  /**
   * Get the schema infos for a Jdbc Connection
   * @param {string} connectionId
   * @returns {Observable<SchemaInfo[]>}
   */
  public getConnectionSchemaInfos(connectionId: string): Observable<SchemaInfo[]> {
    return this.http
      .get( environment.komodoTeiidUrl + "/connections/" + connectionId + "/JdbcCatalogSchema", this.getAuthRequestOptions())
      .map((response) => {
        const infos = response.json();
        return infos.map((info) => SchemaInfo.create( info ));
      })
      .catch( ( error ) => this.handleError( error ) );
  }

  /**
   * Get the tables for the specified input (connection and filters) for a Jdbc Connection
   * @param {JdbcTableFilter} tableFilter
   * @returns {Observable<string>}
   */
  public getJdbcConnectionTables(tableFilter: JdbcTableFilter): Observable<string[]> {
    return this.http
      .post( environment.komodoTeiidUrl + "/connections/Tables", tableFilter, this.getAuthRequestOptions())
      .map((response) => {
        const info = response.json();
        const tableNames = [];
        let i = 1;
        let tableKey = "Table" + i;
        let tableName = info.Information[tableKey];
        while ( tableName && tableName.length > 0 ) {
          tableNames.push(tableName);
          i++;
          tableKey = "Table" + i;
          tableName = info.Information[tableKey];
        }
        return tableNames;
      })
      .catch( ( error ) => this.handleError( error ) );
  }

}
