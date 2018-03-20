import { Injectable } from '@angular/core';
import {Connection} from "@connections/shared/connection.model";
import {ServiceCatalogSource} from "@connections/shared/service-catalog-source.model";
import {MockConnectionService} from "@connections/shared/mock-connection.service";
import {Observable} from "rxjs/Observable";
import {SchemaInfo} from "@connections/shared/schema-info.model";

@Injectable()
export class TestDataService {

  private static catalogSourceId1 = "postgresql-persistent-j9vqv";
  private static catalogSourceId2 = "postgresql-persistent-a8xrt";
  private static catalogSourceId3 = "mysql-persistent-t3irv";

  // =================================================================
  // ServiceCatalog DataSources
  // =================================================================
  private static catalogSource1 = TestDataService.createServiceCatalogSource(
    TestDataService.catalogSourceId1,
    TestDataService.catalogSourceId1,
    "postgresql",
    true );
  private static catalogSource2 = TestDataService.createServiceCatalogSource(
    TestDataService.catalogSourceId2,
    TestDataService.catalogSourceId2,
    "postgresql",
    true );
  private static catalogSource3 = TestDataService.createServiceCatalogSource(
    TestDataService.catalogSourceId3,
    TestDataService.catalogSourceId3,
    "mysql",
    true );

  private catalogSources: ServiceCatalogSource[] = [TestDataService.catalogSource1,
                                                    TestDataService.catalogSource2,
                                                    TestDataService.catalogSource3];

  // =================================================================
  // Connections
  // =================================================================
  private static connId1 = "conn1";
  private static connId2 = "conn2";
  private static connId3 = "conn3";
  private static conn1 = TestDataService.createConnection(TestDataService.connId1, TestDataService.catalogSource1 );
  private static conn2 = TestDataService.createConnection(TestDataService.connId2, TestDataService.catalogSource2 );
  private static conn3 = TestDataService.createConnection(TestDataService.connId3, TestDataService.catalogSource3 );

  private connections: Connection[] = [TestDataService.conn1,
                                       TestDataService.conn2,
                                       TestDataService.conn3];

  // =================================================================
  // SchemaInfos for the connections
  // =================================================================
  private static conn1SchemaInfos = [
    SchemaInfo.create( { name: "conn1SchemaInfo1", type: "Schema" } ),
    SchemaInfo.create( { name: "conn1CatalogInfo", type: "Catalog", schemaNames: [ "conn1CatalogSchema1", "conn1CatalogSchema1" ] } )
  ];

  private static conn2SchemaInfos = [
    SchemaInfo.create( { name: "conn2CatalogInfo", type: "Catalog", schemaNames: [ "conn2CatalogSchema1", "conn2CatalogSchema1" ] } ),
    SchemaInfo.create( { name: "conn2SchemaInfo1", type: "Schema" } ),
    SchemaInfo.create( { name: "conn2SchemaInfo2", type: "Schema" } )
  ];

  private static conn3SchemaInfos = [
    SchemaInfo.create( { name: "conn3CatalogInfo", type: "Catalog", schemaNames: [ "conn3CatalogSchema1", "conn3CatalogSchema1" ] } ),
    SchemaInfo.create( { name: "conn3SchemaInfo1", type: "Schema" } ),
    SchemaInfo.create( { name: "conn3SchemaInfo2", type: "Schema" } ),
    SchemaInfo.create( { name: "conn3SchemaInfo2", type: "Schema" } )
  ];

  constructor() { }

  /**
   * @returns {Connection[]} the array of test connections
   */
  public getConnections(): Connection[] {
    return this.connections;
  }

  /**
   * @returns {ServiceCatalogSource[]} the array of test Service Catalog datasources
   */
  public getServiceCatalogSources(): ServiceCatalogSource[] {
    return this.catalogSources;
  }

  /**
   * @returns {Map<string, SchemaInfo[]>} the array of test Service Catalog datasources
   */
  public getConnectionSourceSchemaInfoMap( ): Map<string, SchemaInfo[]> {
    const infoMap = new Map<string, SchemaInfo[]>();
    infoMap.set( TestDataService.conn1.getServiceCatalogSourceName(), TestDataService.conn1SchemaInfos );
    infoMap.set( TestDataService.conn2.getServiceCatalogSourceName(), TestDataService.conn2SchemaInfos );
    infoMap.set( TestDataService.conn3.getServiceCatalogSourceName(), TestDataService.conn3SchemaInfos );
    return infoMap;
  }

  /**
   * Create a connection of the specified id using the supplied ServiceCatalogSource
   * @param {string} id
   * @param {ServiceCatalogSource} serviceCatalogSource
   * @returns {Connection}
   */
  private static createConnection( id: string, serviceCatalogSource: ServiceCatalogSource ): Connection {
    const newConn = new Connection();
    newConn.setId( id );
    const driverName = serviceCatalogSource.getType();
    newConn.setDriverName( driverName );
    if( driverName === 'mysql' || driverName === 'postgresql') {
      newConn.setJdbc( true );
    } else {
      newConn.setJdbc( false );
    }
    newConn.setServiceCatalogSourceName(serviceCatalogSource.getName());
    newConn.setJndiName("java:/" + serviceCatalogSource.getName());
    return newConn;
  }

  /**
   * Create a ServiceCatalogSource using the specified info
   * @param {string} id the id
   * @param {string} name the name
   * @param {string} type the type
   * @param {boolean} bound 'true' if bound
   * @returns {ServiceCatalogSource}
   */
  private static createServiceCatalogSource( id: string, name: string, type: string, bound: boolean ) {
    const catalogSource = new ServiceCatalogSource();
    catalogSource.setId(id);
    catalogSource.setName(name);
    catalogSource.setType(type);
    catalogSource.setBound(bound);
    return catalogSource;
  }

}
