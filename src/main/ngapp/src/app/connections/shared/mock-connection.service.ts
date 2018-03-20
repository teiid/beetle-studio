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
import { JdbcTableFilter } from "@connections/shared/jdbc-table-filter.model";
import { SchemaInfo } from "@connections/shared/schema-info.model";
import { AppSettingsService } from "@core/app-settings.service";
import { LoggerService } from "@core/logger.service";
import "rxjs/add/observable/of";
import "rxjs/add/observable/throw";
import "rxjs/add/operator/catch";
import "rxjs/add/operator/map";
import { Observable } from "rxjs/Observable";
import { ServiceCatalogSource } from "@connections/shared/service-catalog-source.model";
import { NewConnection } from "@connections/shared/new-connection.model";
import { TestDataService } from "@shared/test-data.service";

@Injectable()
export class MockConnectionService extends ConnectionService {

  private connections: Connection[];
  private serviceCatalogSources: ServiceCatalogSource[];
  private connectionSourceSchemaInfoMap: Map<string, SchemaInfo[]>;

  constructor( http: Http, appSettings: AppSettingsService, logger: LoggerService ) {
    super(http, appSettings, logger);

    // Inject service for test data
    let injector = ReflectiveInjector.resolveAndCreate([TestDataService]);
    const testDataService = injector.get(TestDataService);

    // Get test data
    this.connections = testDataService.getConnections();
    this.serviceCatalogSources = testDataService.getServiceCatalogSources();
    this.connectionSourceSchemaInfoMap = testDataService.getConnectionSourceSchemaInfoMap();
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
   * Get the connections from the komodo rest interface
   * @returns {Observable<Connection[]>}
   */
  public getAllConnections(): Observable<Connection[]> {
    return Observable.of(this.connections);
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
   * Get the connection schema info for a connection source
   * @returns {Observable<SchemaInfo[]>}
   */
  public getConnectionSchemaInfos( connSource: string): Observable< SchemaInfo[] > {
    const schemaInfos: SchemaInfo[] = this.connectionSourceSchemaInfoMap.get(connSource);
    if( !schemaInfos || schemaInfos == null ) {
      const empty: SchemaInfo[] = [];
      return Observable.of( empty );
    }
    return Observable.of(schemaInfos);
  }

  /**
   * Get the tables for the specified input (connection and filters) for a Jdbc Connection
   * @param {JdbcTableFilter} tableFilter
   * @returns {Observable<string>}
   */
  public getJdbcConnectionTables( tableFilter: JdbcTableFilter ): Observable< string[] > {
    const tableNames = [];
    tableNames.push( "table1" );
    tableNames.push( "table2" );
    tableNames.push( "table3" );
    return Observable.of( tableNames );
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

}
