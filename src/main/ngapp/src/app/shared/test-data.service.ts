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
import { Connection } from "@connections/shared/connection.model";
import { SchemaInfo } from "@connections/shared/schema-info.model";
import { ServiceCatalogSource } from "@connections/shared/service-catalog-source.model";
import { Dataservice } from "@dataservices/shared/dataservice.model";
import { DeploymentState } from "@dataservices/shared/deployment-state.enum";
import { VdbStatus } from "@dataservices/shared/vdb-status.model";
import { Vdb } from "@dataservices/shared/vdb.model";

@Injectable()
export class TestDataService {

  private static catalogSourceId1 = "postgresql-persistent-j9vqv";
  private static catalogSourceId2 = "postgresql-persistent-a8xrt";
  private static catalogSourceId3 = "mysql-persistent-t3irv";

  // =================================================================
  // VDBs
  // =================================================================

  private static accountsVdb = Vdb.create(
    {
      keng__id: "AccountsVDB",
      vdb__description: "This is an accounts VDB.",
      keng__dataPath: "/path/in/repository/AccountsVDB",
      keng__kType: "Vdb",
      vdb__name: "AccountsVDB",
      vdb__originalFile: "/Users/dsbUser/vdbs/accounts.vdb",
      vdb__preview: false,
      vdb__version: "1"
    },
  );

  private static accountsVdbStatus = VdbStatus.create(
    {
      name: TestDataService.accountsVdb.getName(),
      deployedName: TestDataService.accountsVdb.getName() + "-vdb.xml",
      version: TestDataService.accountsVdb.getVersion(),
      active: true,
      loading: false,
      failed: false,
      errors: [
      ]
    }
  );

  private static employeesVdb = Vdb.create(
    {
      keng__id: "EmployeesVDB",
      vdb__description: "This is an employees VDB.",
      keng__dataPath: "/path/in/repository/EmployeesVDB",
      keng__kType: "Vdb",
      vdb__name: "EmployeesVDB",
      vdb__originalFile: "/Users/dsbUser/vdbs/employees.vdb",
      vdb__preview: false,
      vdb__version: "1"
    },
  );

  private static employeesVdbStatus = VdbStatus.create(
    {
      name: TestDataService.employeesVdb.getName(),
      deployedName: TestDataService.employeesVdb.getName() + "-vdb.xml",
      version: TestDataService.employeesVdb.getVersion(),
      active: true,
      loading: false,
      failed: false,
      errors: [
      ]
    }
  );

  private static productsVdb = Vdb.create(
    {
      keng__id: "ProductsVDB",
      vdb__description: "This is a products VDB.",
      keng__dataPath: "/path/in/repository/ProductsVDB",
      keng__kType: "Vdb",
      vdb__name: "ProductsVDB",
      vdb__originalFile: "/Users/dsbUser/vdbs/products.vdb",
      vdb__preview: false,
      vdb__version: "1"
    },
  );

  private static productsVdbStatus = VdbStatus.create(
    {
      name: TestDataService.productsVdb.getName(),
      deployedName: TestDataService.productsVdb.getName() + "-vdb.xml",
      version: TestDataService.productsVdb.getVersion(),
      active: true,
      loading: false,
      failed: false,
      errors: [
      ]
    }
  );

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

  // =================================================================
  // Connections
  // =================================================================
  private static connId1 = "conn1";
  private static connId2 = "conn2";
  private static connId3 = "conn3";
  private static conn1 = TestDataService.createConnection(TestDataService.connId1, TestDataService.catalogSource1 );
  private static conn2 = TestDataService.createConnection(TestDataService.connId2, TestDataService.catalogSource2 );
  private static conn3 = TestDataService.createConnection(TestDataService.connId3, TestDataService.catalogSource3 );

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

  // =================================================================
  // Dataservices
  // =================================================================

  private static accountsService = Dataservice.create(
    {
      keng__id: "Accounts",
      tko__description: "A dataservice for accounts.",
      serviceVdbName: TestDataService.accountsVdb.getName(),
      serviceVdbVersion: TestDataService.accountsVdb.getVersion(),
      serviceViews: [
        "AcctView1",
        "AcctView2"
      ],
      serviceViewModel: "AccountsViewModel",
      serviceViewTables: [
        "AcctView1Table1",
        "AcctView1Table2",
        "AcctView1Table3",
        "AcctView2Table1"
      ],
      deploymentState: DeploymentState.LOADING
    }
  );

  private static employeesService = Dataservice.create(
    {
      keng__id: "Employees",
      tko__description: "A dataservice for employees.",
      serviceVdbName: TestDataService.employeesVdb.getName(),
      serviceVdbVersion: TestDataService.employeesVdb.getVersion(),
      serviceViews: [
        "EmpView1",
        "EmpView2",
        "EmpView3",
        "EmpView4"
      ],
      serviceViewModel: "EmployeesViewModel",
      serviceViewTables: [
        "EmpView1Table1",
        "EmpView2Table1",
        "EmpView2Table2",
        "EmpView3Table1",
        "EmpView3Table2",
        "EmpView3Table3",
        "EmpView4Table1",
        "EmpView4Table2",
        "EmpView4Table3",
        "EmpView4Table4"
      ],
      deploymentState: DeploymentState.LOADING
    }
  );

  private static productsService = Dataservice.create(
    {
      keng__id: "Products",
      tko__description: "A dataservice for products. These are really good products. These products are the best products money can buy.",
      serviceVdbName: TestDataService.productsVdb.getName(),
      serviceVdbVersion: TestDataService.productsVdb.getVersion(),
      serviceViews: [
        "ProdView1",
        "ProdView2",
        "ProdView3",
        "ProdView4",
        "ProdView5",
        "ProdView6"
      ],
      serviceViewModel: "ProductsViewModel",
      serviceViewTables: [
        "ProdView1Table1",
        "ProdView2Table1",
        "ProdView2Table2",
        "ProdView3Table1",
        "ProdView3Table2",
        "ProdView3Table3",
        "ProdView4Table1",
        "ProdView4Table2",
        "ProdView4Table3",
        "ProdView4Table4",
        "ProdView5Table1",
        "ProdView5Table2",
        "ProdView5Table3",
        "ProdView5Table4",
        "ProdView5Table5",
        "ProdView6Table1",
        "ProdView6Table2",
        "ProdView6Table3",
        "ProdView6Table4",
        "ProdView6Table5",
        "ProdView6Table6"
      ],
      deploymentState: DeploymentState.LOADING
    }
  );

  private catalogSources: ServiceCatalogSource[] = [TestDataService.catalogSource1,
    TestDataService.catalogSource2,
    TestDataService.catalogSource3];

  private connections: Connection[] = [TestDataService.conn1,
    TestDataService.conn2,
    TestDataService.conn3];

  private dataServices: Dataservice[] = [
    TestDataService.accountsService,
    TestDataService.employeesService,
    TestDataService.productsService
  ];

  private vdbs: Vdb[] = [
    TestDataService.accountsVdb,
    TestDataService.employeesVdb,
    TestDataService.productsVdb
  ];

  private vdbStatuses: VdbStatus[] = [
    TestDataService.accountsVdbStatus,
    TestDataService.employeesVdbStatus,
    TestDataService.productsVdbStatus
  ];

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
    if ( driverName === "mysql" || driverName === "postgresql") {
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
  private static createServiceCatalogSource( id: string, name: string, type: string, bound: boolean ): ServiceCatalogSource {
    const catalogSource = new ServiceCatalogSource();
    catalogSource.setId(id);
    catalogSource.setName(name);
    catalogSource.setType(type);
    catalogSource.setBound(bound);
    return catalogSource;
  }

  constructor() {
    // nothing to do
  }

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
   * @returns {Dataservice[]} the array of test dataservices
   */
  public getDataservices(): Dataservice[] {
    return this.dataServices;
  }

  /**
   * @returns {Vdb[]} the VDB collection
   */
  public getVdbs(): Vdb[] {
    return this.vdbs;
  }

  /**
   * @returns {VdbStatus[]} the VDB status collection
   */
  public getVdbStatuses(): VdbStatus[] {
    return this.vdbStatuses;
  }

}
