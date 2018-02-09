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
import { ConnectionService } from "@connections/shared/connection.service";
import { JdbcTableFilter } from "@connections/shared/jdbc-table-filter.model";
import { NewConnection } from "@connections/shared/new-connection.model";
import { SchemaInfo } from "@connections/shared/schema-info.model";
import { TemplateDefinition } from "@connections/shared/template-definition.model";
import { AppSettingsService } from "@core/app-settings.service";
import { LoggerService } from "@core/logger.service";
import "rxjs/add/observable/of";
import "rxjs/add/observable/throw";
import "rxjs/add/operator/catch";
import "rxjs/add/operator/map";
import { Observable } from "rxjs/Observable";

@Injectable()
export class MockConnectionService extends ConnectionService {

  public static conn1Id = "conn1";
  public static conn1 = MockConnectionService.createJdbcConnection( MockConnectionService.conn1Id );
  public static conn1SchemaInfos = [
    SchemaInfo.create( { name: "conn1SchemaInfo1", type: "Schema" } ),
    SchemaInfo.create( { name: "conn1CatalogInfo", type: "Catalog", schemaNames: [ "conn1CatalogSchema1", "conn1CatalogSchema1" ] } )
  ];
  public static numConn1Schemas = 3;

  public static conn2Id = "conn2";
  public static conn2 = MockConnectionService.createJdbcConnection( MockConnectionService.conn2Id );
  public static conn2SchemaInfos = [
    SchemaInfo.create( { name: "conn2CatalogInfo", type: "Catalog", schemaNames: [ "conn2CatalogSchema1", "conn2CatalogSchema1" ] } ),
    SchemaInfo.create( { name: "conn2SchemaInfo1", type: "Schema" } ),
    SchemaInfo.create( { name: "conn2SchemaInfo2", type: "Schema" } )
  ];
  public static numConn2Schemas = 4;

  public static conn3Id = "conn3";
  public static conn3 = MockConnectionService.createJdbcConnection( MockConnectionService.conn3Id );
  public static conn3SchemaInfos = [
    SchemaInfo.create( { name: "conn3CatalogInfo", type: "Catalog", schemaNames: [ "conn3CatalogSchema1", "conn3CatalogSchema1" ] } ),
    SchemaInfo.create( { name: "conn3SchemaInfo1", type: "Schema" } ),
    SchemaInfo.create( { name: "conn3SchemaInfo2", type: "Schema" } ),
    SchemaInfo.create( { name: "conn3SchemaInfo2", type: "Schema" } )
  ];
  public static numConn3Schemas = 5;

  public static templ1 = new TemplateDefinition();
  public static templ2 = new TemplateDefinition();
  public static templ3 = new TemplateDefinition();

  public conns: Connection[] = [
    MockConnectionService.conn1,
    MockConnectionService.conn2,
    MockConnectionService.conn3 ];

  public templs: TemplateDefinition[] = [
    MockConnectionService.templ1,
    MockConnectionService.templ2,
    MockConnectionService.templ3 ];

  private static createJdbcConnection( id: string ): Connection {
    const newConn = new Connection();
    newConn.setId( id );
    newConn.setJdbc( true );
    newConn.setServiceCatalogSourceName(id);
    return newConn;
  }

  constructor( http: Http, appSettings: AppSettingsService, logger: LoggerService ) {
    super(http, appSettings, logger);
  }

  /**
   * Get the connections from the komodo rest interface
   * @returns {Observable<Connection[]>}
   */
  public getAllConnections(): Observable<Connection[]> {
    return Observable.of(this.conns);
  }

  /**
   * Delete a connection via the komodo rest interface
   * @param {string} connectionId
   * @returns {Observable<boolean>}
   */
  public deleteConnection(connectionId: string): Observable<boolean> {
    const size = this.conns.length;
    this.conns = this.conns.filter( ( conn ) => conn.getId() !== connectionId );
    return Observable.of( size === this.conns.length );
  }

  /**
   * Get the connection templates from the komodo rest interface
   * @returns {Observable<Array<TemplateDefinition<any>>>}
   */
  public getConnectionTemplates(): Observable<TemplateDefinition[]> {
    return Observable.of(this.templs);
  }

  public getConnectionSchemaInfos( connectionId: string): Observable< SchemaInfo[] > {
    if ( connectionId === MockConnectionService.conn1Id ) {
      return Observable.of( MockConnectionService.conn1SchemaInfos );
    }

    if ( connectionId === MockConnectionService.conn2Id ) {
      return Observable.of( MockConnectionService.conn2SchemaInfos );
    }

    if ( connectionId === MockConnectionService.conn3Id ) {
      return Observable.of( MockConnectionService.conn3SchemaInfos );
    }

    const empty: SchemaInfo[] = [];
    return Observable.of( empty );
  }

  public getJdbcConnectionTables( tableFilter: JdbcTableFilter ): Observable< string[] > {
    const tableNames = [];
    tableNames.push( "table1" );
    tableNames.push( "table2" );
    tableNames.push( "table3" );
    return Observable.of( tableNames );
  }

}
