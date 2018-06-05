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
import { Http, RequestOptions } from "@angular/http";
import { ConnectionStatus } from "@connections/shared/connection-status";
import { ConnectionType } from "@connections/shared/connection-type.model";
import { ConnectionsConstants } from "@connections/shared/connections-constants";
import { NewConnection } from "@connections/shared/new-connection.model";
import { SchemaNode } from "@connections/shared/schema-node.model";
import { ServiceCatalogSource } from "@connections/shared/service-catalog-source.model";
import { ApiService } from "@core/api.service";
import { AppSettingsService } from "@core/app-settings.service";
import { LoggerService } from "@core/logger.service";
import { ConnectionSummary } from "@dataservices/shared/connection-summary.model";
import { NotifierService } from "@dataservices/shared/notifier.service";
import { VdbService } from "@dataservices/shared/vdb.service";
import { environment } from "@environments/environment";
import { Observable } from "rxjs/Observable";
import { Subscription } from "rxjs/Subscription";

@Injectable()
export class ConnectionService extends ApiService {

  private static readonly nameValidationUrl = environment.komodoWorkspaceUrl
    + ConnectionsConstants.connectionsRootPath
    + "/nameValidation/";
  private static readonly refreshConnectionSchemaUrl = environment.komodoWorkspaceUrl
    + ConnectionsConstants.connectionsRootPath
    + "/refresh-schema/";

  private http: Http;
  private updatesSubscription: Subscription;
  private notifierService: NotifierService;
  private vdbService: VdbService;
  private cachedConnectionStatuses: Map<string, ConnectionStatus> = new Map<string, ConnectionStatus>();

  constructor( http: Http, vdbService: VdbService, notifierService: NotifierService,
               appSettings: AppSettingsService, logger: LoggerService ) {
    super( appSettings, logger  );
    this.http = http;
    this.vdbService = vdbService;
    this.notifierService = notifierService;
    // Polls to fire Connection VDB state updates every 15 sec
    this.pollConnectionSchemaStatus(15);
  }

  /**
   * Validates the specified connection name. If the name contains valid characters and the name is unique, the
   * service returns 'null'. Otherwise, a 'string' containing an error message is returned.
   *
   * @param {string} name the connection name
   * @returns {Observable<String>}
   */
  public isValidName( name: string ): Observable< string > {
    if ( !name || name.length === 0 ) {
      return Observable.of( "Connection name cannot be empty" );
    }

    const url = ConnectionService.nameValidationUrl + encodeURIComponent( name );

    return this.http.get( url, this.getAuthRequestOptions() )
      .map( ( response ) => {
        if ( response.ok ) {
          if ( response.text() ) {
            return response.text();
          }

          return "";
        } } )
      .catch( ( error ) => this.handleError( error ) );
  }

  /**
   * Get the connection summaries from the komodo rest interface.  The supplied parameters determine what portions
   * of the ConnectionSummary are returned.
   *   - include-connection=true (include connection [default=true])
   *   - include-schema-status=true (include schema vdb status [default=false])
   * @param {boolean} includeConnection 'true' to include connection
   * @param {boolean} includeSchemaStatus 'true' to include connection schema status
   * @returns {Observable<ConnectionSummary[]>}
   */
  public getConnections(includeConnection: boolean, includeSchemaStatus: boolean): Observable<ConnectionSummary[]> {
    // Build the url with parameters
    const connectionsUrl = this.buildGetConnectionsUrl(includeConnection, includeSchemaStatus);

    return this.http
      .get(connectionsUrl, this.getAuthRequestOptions())
      .map((response) => {
        const connectionSummaries = response.json();
        return connectionSummaries.map((connectionSummary) => ConnectionSummary.create( connectionSummary ));
      })
      .catch( ( error ) => this.handleError( error ) );
  }

  /**
   * Deployes the connection server VDB if one does not already exists. If a server VDB has already been deployed, one
   * can be redeployed. A schema can only be generated if it doesn't exist and there is already a deployed server VDB.
   * @param {string} connectionName the name of the connection being refreshed
   * @param {boolean} redeployServerVdb `true` if the server VDB should be deployed if one exists (defaults to `false`)
   * @param {boolean} generateSchema `true` if the schema should be generated if one does not exist (defaults to `true`)
   * @returns {Observable<boolean>}
   */
  public refreshConnectionSchema(connectionName: string,
                                 redeployServerVdb = false,
                                 generateSchema = true): Observable<boolean> {
    if ( !connectionName || connectionName.length === 0 ) {
      return Observable.of( false );
    }

    const url = ConnectionService.refreshConnectionSchemaUrl + encodeURIComponent( connectionName );

    // setup query parameters
    const queryParams = {
      params: {
        "redeploy": redeployServerVdb,
        "generate-schema": generateSchema
      }
    };
    const options = new RequestOptions( queryParams );

    return this.http
      .post( url, this.getAuthRequestOptions().merge( options ) )
      .map((response) => {
        return response.ok;
      })
      .catch( ( error ) => this.handleError( error ) );
  }

  /**
   * Bind a service catalog source via the komodo rest interface
   * @param {string} serviceCatalogSourceName
   * @returns {Observable<boolean>}
   */
  public bindServiceCatalogSource(serviceCatalogSourceName: string): Observable<boolean> {
    return this.http
      .post(environment.komodoTeiidUrl + ConnectionsConstants.serviceCatalogSourcesRootPath,
        { name: serviceCatalogSourceName}, this.getAuthRequestOptions())
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
   * Get the connection types from the komodo rest interface
   * @returns {ConnectionType[]}
   */
  public getConnectionTypes(): ConnectionType[] {
    const connectionTypes: ConnectionType[] = [];
    const connType1: ConnectionType = new ConnectionType();
    connType1.setName(ConnectionsConstants.connectionType_postgresql);
    connType1.setDescription(ConnectionsConstants.connectionTypeDescription_postgresql);
    const connType2: ConnectionType = new ConnectionType();
    connType2.setName(ConnectionsConstants.connectionType_mysql);
    connType2.setDescription(ConnectionsConstants.connectionTypeDescription_mysql);
    const connType3: ConnectionType = new ConnectionType();
    connType3.setName(ConnectionsConstants.connectionType_mongodb);
    connType3.setDescription(ConnectionsConstants.connectionTypeDescription_mongodb);
    const connType4: ConnectionType = new ConnectionType();
    connType4.setName(ConnectionsConstants.connectionType_salesforce);
    connType4.setDescription(ConnectionsConstants.connectionTypeDescription_salesforce);

    // const connType4: ConnectionType = new ConnectionType();
    // connType4.setName(ConnectionsConstants.connectionType_mariadb);
    // connType4.setDescription(ConnectionsConstants.connectionTypeDescription_mariadb);

    connectionTypes.push(connType1);
    connectionTypes.push(connType2);
    connectionTypes.push(connType3);
    connectionTypes.push(connType4);

    return connectionTypes;
  }

  /**
   * Get the available ServiceCatalogSources from the komodo rest interface
   * @returns {Observable<ServiceCatalogSource[]>}
   */
  public getAllServiceCatalogSources(): Observable<ServiceCatalogSource[]> {
    return this.http
      .get(environment.komodoTeiidUrl + ConnectionsConstants.serviceCatalogSourcesRootPath, this.getAuthRequestOptions())
      .map((response) => {
        const catalogSources = response.json();
        return catalogSources.map((catSource) => ServiceCatalogSource.create( catSource ));
      })
      .catch( ( error ) => this.handleError( error ) );
  }

  /**
   * Get the schema for the specified connection.  The connection must be ACTIVE, otherwise the schema
   * will be empty.
   * @param {string} connectionId the connection id
   * @returns {Observable<SchemaNode[]>}
   */
  public getConnectionSchema(connectionId: string): Observable<SchemaNode[]> {
    return this.http
      .get( environment.komodoWorkspaceUrl + ConnectionsConstants.connectionsRootPath
                                               + "/" + connectionId + "/schema", this.getAuthRequestOptions())
      .map((response) => {
        const schemaNodes = response.json();
        return schemaNodes.map((schemaNode) => SchemaNode.create( schemaNode ));
      })
      .catch( ( error ) => this.handleError( error ) );
  }

  /**
   * Create a connection in the Komodo repo - also binds the specified serviceCatalogSource
   * @param {NewConnection} connection the connection object
   * @returns {Observable<boolean>}
   */
  public createAndBindConnection(connection: NewConnection): Observable<boolean> {
    return this.http
      .post(environment.komodoWorkspaceUrl + ConnectionsConstants.connectionsRootPath  + "/" + connection.getName(),
        connection, this.getAuthRequestOptions())
      .map((response) => {
        return response.ok;
      })
      .catch( ( error ) => this.handleError( error ) );
  }

  /**
   * Update a connection in the Komodo repo - also binds the specified serviceCatalogSource.
   * @param {NewConnection} connection the connection object
   * @returns {Observable<boolean>}
   */
  public updateAndBindConnection(connection: NewConnection): Observable<boolean> {
    return this.http
      .put(environment.komodoWorkspaceUrl + ConnectionsConstants.connectionsRootPath  + "/" + connection.getName(),
        connection, this.getAuthRequestOptions())
      .map((response) => {
        return response.ok;
      })
      .catch( ( error ) => this.handleError( error ) );
  }

  /**
   * Creates a workspace Connection, binds it to the specified serviceCatalogSource, and initiates
   * a refresh of the connection schema.
   * @param {NewConnection} connection the connection object
   * @returns {Observable<boolean>}
   */
  public createDeployConnection(connection: NewConnection): Observable<boolean> {
    return this.createAndBindConnection(connection)
      .flatMap((res) => this.refreshConnectionSchema(connection.getName()));
  }

  /**
   * Updates a workspace Connection, binds it to the specified serviceCatalogSource, and initiates
   * a refresh of the connection schema.
   * @param {NewConnection} connection the connection object
   * @returns {Observable<boolean>}
   */
  public updateDeployConnection(connection: NewConnection): Observable<boolean> {
    return this.updateAndBindConnection(connection)
      .flatMap((res) => this.refreshConnectionSchema(connection.getName()));
  }

  /**
   * Delete the repo Connection VDB (if it exists) and undeploy the Connection VDB
   * (if exists)
   * @param {string} connectionId
   * @returns {Observable<boolean>}
   */
  public deleteUndeployConnectionVdb(connectionId: string): Observable<boolean> {
    const vdbName = connectionId + "BtlConn";
    return this.vdbService.deleteVdbIfFound(vdbName)
      .flatMap((res) => this.vdbService.undeployVdb(vdbName));
  }

  /**
   * Updates the current Connecton VDB states - triggers update to be broadcast to interested components
   */
  public updateConnectionSchemaStates(): void {
    const self = this;
    this.getConnections(false, true)
      .subscribe(
        (connectionSummaries) => {
          self.cachedConnectionStatuses = self.createConnectionStatusMap(connectionSummaries);
          this.notifierService.sendConnectionStatusMap(self.cachedConnectionStatuses);
        },
        (error) => {
          // On error, broadcast the cached states
          this.notifierService.sendConnectionStatusMap(self.cachedConnectionStatuses);
        }
      );
  }

  /**
   * Polls the server and sends Connection schema state updates at the specified interval
   * @param {number} pollIntervalSec the interval (sec) between polling attempts
   */
  public pollConnectionSchemaStatus(pollIntervalSec: number): void {
    const pollIntervalMillis = pollIntervalSec * 1000;

    const self = this;
    // start the timer
    const timer = Observable.timer(500, pollIntervalMillis);
    this.updatesSubscription = timer.subscribe((t: any) => {
      self.updateConnectionSchemaStates();
    });
  }

  /**
   * Build the getConnection Url based on the supplied parameters.
   * @param {boolean} includeConnection 'true' to include connection, 'false' to omit
   * @param {boolean} includeSchemaStatus 'true' to include connection schema status, 'false' to omit
   */
  private buildGetConnectionsUrl(includeConnection: boolean, includeSchemaStatus: boolean): string {
    // Base getConnections service url
    const connectionsUrl = environment.komodoWorkspaceUrl + ConnectionsConstants.connectionsRootPath;

    // Additional parameters
    const urlParams = "?" + ConnectionsConstants.includeConnectionParameter + "=" + String(includeConnection) +
                      "&" + ConnectionsConstants.includeSchemaStatusParameter + "=" + String(includeSchemaStatus);

    return connectionsUrl + urlParams;
  }

  /*
   * Creates a Map of connection name to ConnectionStatus
   * @param {ConnectionSummary[]} connectionSummaries the array of ConnectionSummary objects
   * @returns {Map<string,ConnectionStatus>} the map of connection name to ConnectionStatus
   */
  private createConnectionStatusMap(connectionSummaries: ConnectionSummary[]): Map<string, ConnectionStatus> {
    const connStatusMap: Map<string, ConnectionStatus> = new Map<string, ConnectionStatus>();

    // For each connection, determine its status.  Add the map entry
    for ( const connectionSummary of connectionSummaries ) {
      if (connectionSummary.hasStatus()) {
        const status = connectionSummary.getStatus();
        const connName = status.getConnectionName();
        connStatusMap.set( connName, status );
      }
    }

    return connStatusMap;
  }

}
