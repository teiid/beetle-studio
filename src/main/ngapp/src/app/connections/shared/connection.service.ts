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
import { ConnectionType } from "@connections/shared/connection-type.model";
import { Connection } from "@connections/shared/connection.model";
import { ConnectionsConstants } from "@connections/shared/connections-constants";
import { JdbcTableFilter } from "@connections/shared/jdbc-table-filter.model";
import { NewConnection } from "@connections/shared/new-connection.model";
import { SchemaInfo } from "@connections/shared/schema-info.model";
import { ServiceCatalogSource } from "@connections/shared/service-catalog-source.model";
import { TemplateDefinition } from "@connections/shared/template-definition.model";
import { ApiService } from "@core/api.service";
import { AppSettingsService } from "@core/app-settings.service";
import { LoggerService } from "@core/logger.service";
import { DeploymentState } from "@dataservices/shared/deployment-state.enum";
import { NotifierService } from "@dataservices/shared/notifier.service";
import { ObjectVdbStatus } from "@dataservices/shared/object-vdb-status.model";
import { Table } from "@dataservices/shared/table.model";
import { VdbService } from "@dataservices/shared/vdb.service";
import { environment } from "@environments/environment";
import { PropertyDefinition } from "@shared/property-form/property-definition.model";
import { Observable } from "rxjs/Observable";
import { Subscription } from "rxjs/Subscription";

@Injectable()
export class ConnectionService extends ApiService {

  private static readonly nameValidationUrl = environment.komodoWorkspaceUrl
    + ConnectionsConstants.connectionsRootPath
    + "/nameValidation/";
  private static readonly deployConnectionVdbUrl = environment.komodoWorkspaceUrl
    + ConnectionsConstants.connectionsRootPath
    + "/deployVdb/";

  private http: Http;
  private updatesSubscription: Subscription;
  private notifierService: NotifierService;
  private vdbService: VdbService;
  private cachedConnectionVdbStates: Map<string, DeploymentState> = new Map<string, DeploymentState>();

  constructor( http: Http, vdbService: VdbService, notifierService: NotifierService,
               appSettings: AppSettingsService, logger: LoggerService ) {
    super( appSettings, logger  );
    this.http = http;
    this.vdbService = vdbService;
    this.notifierService = notifierService;
    // Polls to fire Connection VDB state updates every 15 sec
    this.pollConnectionVdbStatus(15);
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
   * Get the connection VdbStatuses from the komodo rest interface
   * @returns {Observable<ObjectVdbStatus[]>}
   */
  public getConnectionVdbStatuses(): Observable<ObjectVdbStatus[]> {
    return this.http
      .get(environment.komodoWorkspaceUrl + ConnectionsConstants.connectionsStatusPath, this.getAuthRequestOptions())
      .map((response) => {
        const statuses = response.json();
        return statuses.map((connStatus) => ObjectVdbStatus.create( connStatus ));
      })
      .catch( ( error ) => this.handleError( error ) );
  }

  /**
   * Deploy a VDB for the connection via the komodo rest interface
   * @param {string} connectionName
   * @returns {Observable<boolean>}
   */
  public deployConnectionVdb(connectionName: string): Observable<boolean> {
    if ( !connectionName || connectionName.length === 0 ) {
      return Observable.of( false );
    }

    const url = ConnectionService.deployConnectionVdbUrl + encodeURIComponent( connectionName );

    const connectionPath = this.getKomodoUserWorkspacePath() + "/" + connectionName;
    return this.http
      .post( url, this.getAuthRequestOptions() )
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
    // const connType3: ConnectionType = new ConnectionType();
    // connType3.setName(ConnectionsConstants.connectionType_mongodb);
    // connType3.setDescription(ConnectionsConstants.connectionTypeDescription_mongodb);
    // const connType4: ConnectionType = new ConnectionType();
    // connType4.setName(ConnectionsConstants.connectionType_mariadb);
    // connType4.setDescription(ConnectionsConstants.connectionTypeDescription_mariadb);

    connectionTypes.push(connType1);
    connectionTypes.push(connType2);
    // connectionTypes.push(connType3);
    // connectionTypes.push(connType4);

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
   * Creates a workspace Connection, binds it to the specified serviceCatalogSource, and deploys
   * a corresponding VDB for the connection.
   * @param {NewConnection} connection the connection object
   * @returns {Observable<boolean>}
   */
  public createDeployConnection(connection: NewConnection): Observable<boolean> {
    return this.createAndBindConnection(connection)
      .flatMap((res) => this.deployConnectionVdb(connection.getName()));
  }

  /**
   * Updates a workspace Connection, binds it to the specified serviceCatalogSource, and re-deploys
   * a corresponding VDB for the connection.
   * @param {NewConnection} connection the connection object
   * @returns {Observable<boolean>}
   */
  public updateDeployConnection(connection: NewConnection): Observable<boolean> {
    return this.updateAndBindConnection(connection)
      .flatMap((res) => this.deployConnectionVdb(connection.getName()));
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
  public updateConnectionVdbStates(): void {
    const self = this;
    this.getConnectionVdbStatuses()
      .subscribe(
        (connVdbStatuses) => {
          console.log("[ConnectionService] Sending valid connection vdbStatuses: " + new Date(Date.now()).toLocaleString());
          self.cachedConnectionVdbStates = self.createDeploymentStateMap(connVdbStatuses);
          this.notifierService.sendConnectionStateMap(self.cachedConnectionVdbStates);
        },
        (error) => {
          console.log("[ConnectionService] Error getting connection vdbStatuses, sending cached: " + new Date(Date.now()).toLocaleString());
          // On error, broadcast the cached states
          this.notifierService.sendConnectionStateMap(self.cachedConnectionVdbStates);
        }
      );
  }

  /**
   * Polls the server and sends Connection VDB state updates at the specified interval
   * @param {number} pollIntervalSec the interval (sec) between polling attempts
   */
  public pollConnectionVdbStatus(pollIntervalSec: number): void {
    const pollIntervalMillis = pollIntervalSec * 1000;

    const self = this;
    // start the timer
    const timer = Observable.timer(500, pollIntervalMillis);
    this.updatesSubscription = timer.subscribe((t: any) => {
      self.updateConnectionVdbStates();
    });
  }

  /*
   * Creates a Map of connection name to DeploymentState
   * @param {VdbStatus[]} vdbStatuses the VdbStatus array
   * @returns {Map<string,DeploymentState>} the map of connection name to DeploymentState
   */
  private createDeploymentStateMap(connVdbStatuses: ObjectVdbStatus[]): Map<string, DeploymentState> {
    const connStateMap: Map<string, DeploymentState> = new Map<string, DeploymentState>();

    // For each VDB, determine if connection VDB and find the corresponding VDB status.  Add the map entry
    for ( const connVdbStatus of connVdbStatuses ) {
      const connName = connVdbStatus.getName();
      const vdbStatus = connVdbStatus.getVdbStatus();
      if ( !vdbStatus || vdbStatus === null ) {
        connStateMap.set(connName, DeploymentState.NOT_DEPLOYED);
      } else if ( vdbStatus.isFailed() ) {
        connStateMap.set(connName, DeploymentState.FAILED);
      } else if ( vdbStatus.isActive() ) {
        connStateMap.set(connName, DeploymentState.ACTIVE);
      } else if ( vdbStatus.isLoading() ) {
        connStateMap.set(connName, DeploymentState.LOADING);
      } else {
        connStateMap.set(connName, DeploymentState.INACTIVE);
      }
    }

    return connStateMap;
  }

}
