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

import { Injectable, ReflectiveInjector } from "@angular/core";
import { Http } from "@angular/http";
import { Connection } from "@connections/shared/connection.model";
import { ConnectionService } from "@connections/shared/connection.service";
import { NewConnection } from "@connections/shared/new-connection.model";
import { SchemaNode } from "@connections/shared/schema-node.model";
import { ServiceCatalogSource } from "@connections/shared/service-catalog-source.model";
import { AppSettingsService } from "@core/app-settings.service";
import { LoggerService } from "@core/logger.service";
import { ConnectionSummary } from "@dataservices/shared/connection-summary.model";
import { NotifierService } from "@dataservices/shared/notifier.service";
import { VdbService } from "@dataservices/shared/vdb.service";
import { TestDataService } from "@shared/test-data.service";
import "rxjs/add/observable/of";
import "rxjs/add/observable/throw";
import "rxjs/add/operator/catch";
import "rxjs/add/operator/map";
import { Observable } from "rxjs/Observable";
import { Column } from "@dataservices/shared/column.model";

@Injectable()
export class MockConnectionService extends ConnectionService {

  private connections: Connection[];
  private readonly serviceCatalogSources: ServiceCatalogSource[];
  private connectionSchemaMap = new Map<string, SchemaNode[]>();
  private connectionSchemaColumnsMap = new Map<string, Column[]>();
  private testDataService: TestDataService;

  constructor( http: Http, vdbService: VdbService, notifierService: NotifierService,
               appSettings: AppSettingsService, logger: LoggerService ) {
    super(http, vdbService, notifierService, appSettings, logger);

    // Inject service for test data
    const injector = ReflectiveInjector.resolveAndCreate([TestDataService]);
    this.testDataService = injector.get(TestDataService);

    // Get test data
    const conns: Connection[] = [];
    const connSummaries: ConnectionSummary[] = this.testDataService.getConnectionSummaries(true, true);
    for ( const connSummary of connSummaries ) {
      conns.push(connSummary.getConnection());
    }
    this.connections = conns;
    this.serviceCatalogSources = this.testDataService.getServiceCatalogSources();
    this.connectionSchemaMap = this.testDataService.getConnectionSchemaMap();
    this.connectionSchemaColumnsMap = this.testDataService.getConnectionSchemaColumnsMap();
  }

  public isValidName( name: string ): Observable< string > {
    if ( !name || name.length === 0 ) {
      return Observable.of( "Connection name cannot be empty" );
    }

    // make sure no dataservice exists with that name
    for ( const conn of this.connections ) {
      if ( conn.getId() === name ) {
        return Observable.of( "Connection with that name already exists" );
      }
    }

    // just implement a case where no special characters allowed
    for ( let i = 0; i < name.length; i++ ) {
      const c = name.charAt( i );

      // special characters have the same upper and lower case values
      if ( c.toUpperCase() === c.toLowerCase() ) {
        return Observable.of( "No special characters allowed" );
      }
    }

    // valid
    return Observable.of( "" );
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
    return Observable.of(this.testDataService.getConnectionSummaries(includeConnection, includeSchemaStatus));
  }

  /**
   * Delete a connection via the komodo rest interface
   * @param {string} connectionId
   * @returns {Observable<boolean>}
   */
  public deleteConnection(connectionId: string): Observable<boolean> {
    const size = this.connections.length;
    this.connections = this.connections.filter( ( conn ) => conn.getId() !== connectionId );
    return Observable.of( size === this.connections.length );
  }

  /**
   * Get the available ServiceCatalogSources from the komodo rest interface
   * @returns {Observable<ServiceCatalogSource[]>}
   */
  public getAllServiceCatalogSources(): Observable<ServiceCatalogSource[]> {
    return Observable.of(this.serviceCatalogSources);
  }

  /**
   * Get the root SchemaNodes for the specified Connection
   * @param {string} connectionName the connection name
   * @returns {Observable<SchemaNode[]>}
   */
  public getConnectionSchema( connectionName: string ): Observable< SchemaNode[] > {
    return Observable.of( this.connectionSchemaMap.get( connectionName ) );
  }

  /**
   * Get the columns for the specified connection and table.  The connection must be ACTIVE, otherwise the schema
   * will be empty.
   * @param {string} connectionName the connection id
   * @param {string} tableOption the table option (eg. schema=public/table=customer)
   * @returns {Observable<Column[]>}
   */
  public getConnectionSchemaColumns(connectionName: string, tableOption: string): Observable<Column[]> {
    return Observable.of( this.connectionSchemaColumnsMap.get( connectionName + ":" + tableOption ));
  }

  /**
   * Create a connection in the Komodo repo - also binds the specified serviceCatalogSource
   * @param {NewConnection} connection the connection object
   * @returns {Observable<boolean>}
   */
  public createAndBindConnection(connection: NewConnection): Observable<boolean> {
    return Observable.of(true);
  }

  /**
   * Update a connection in the Komodo repo - also binds the specified serviceCatalogSource.
   * @param {NewConnection} connection the connection object
   * @returns {Observable<boolean>}
   */
  public updateAndBindConnection(connection: NewConnection): Observable<boolean> {
    return Observable.of(true);
  }

  /**
   * Update the preview VDB and re-deploy it if needed.
   * @param {string} vdbName
   * @returns {Observable<boolean>}
   */
  public refreshPreviewVdb(vdbName: string): Observable<boolean> {
    return Observable.of(true);
  }

  /**
   * Initiates a refresh of the connection schema via the komodo rest interface
   * @param {string} connectionName
   * @returns {Observable<boolean>}
   */
  public refreshConnectionSchema(connectionName: string): Observable<boolean> {
    if ( !connectionName || connectionName.length === 0 ) {
      return Observable.of( false );
    }

    return Observable.of( true );
  }

  /**
   * Updates the current Connection schema states - triggers update to be broadcast to interested components
   */
  public updateConnectionSchemaStates(): void {
    // Nothing to do
  }

  /**
   * Polls the server and sends Connection state updates at the specified interval
   * @param {number} pollIntervalSec the interval (sec) between polling attempts
   */
  public pollConnectionSchemaStatus(pollIntervalSec: number): void {
    // Nothing to do
  }

}
