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
import { VdbStatus } from "@dataservices/shared/vdb-status.model";
import { Vdb } from "@dataservices/shared/vdb.model";

@Injectable()
export class TestDataService {

  private static pgConnCatalogSourceId = "postgresql-persistent-lq6sg";
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
    }
  );

  // =================================================================
  // VDB Status
  // =================================================================

  private static vdbStatuses =
    {
      "keng__baseUri": "http://das-beetle-studio.192.168.42.142.nip.io/vdb-builder/v1/",
      "vdbs": [
        {
          "name": TestDataService.accountsVdb.getName(),
          "deployedName": TestDataService.accountsVdb.getName() + "-vdb.xml",
          "version": TestDataService.accountsVdb.getVersion(),
          "active": true,
          "loading": false,
          "failed": false,
          "errors": []
        },
        {
          "name": TestDataService.employeesVdb.getName(),
          "deployedName": TestDataService.employeesVdb.getName() + "-vdb.xml",
          "version": TestDataService.employeesVdb.getVersion(),
          "active": true,
          "loading": false,
          "failed": false,
          "errors": []
        },
        {
          "name": TestDataService.productsVdb.getName(),
          "deployedName": TestDataService.productsVdb.getName() + "-vdb.xml",
          "version": TestDataService.productsVdb.getVersion(),
          "active": true,
          "loading": false,
          "failed": false,
          "errors": []
        }
      ],
      "keng___links": [
        {
          "rel": "self",
          "href": "http://localhost:4200/vdb-builder/v1/metadata/status/vdbs"
        },
        {
          "rel": "parent",
          "href": "http://localhost:4200/vdb-builder/v1/metadata/status"
        }
      ]
    };

  // =================================================================
  // ServiceCatalog DataSources
  // =================================================================
  private static pgConnCatalogSource = TestDataService.createServiceCatalogSource(
    TestDataService.pgConnCatalogSourceId,
    TestDataService.pgConnCatalogSourceId,
    "postgresql",
    true );
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

  private static pgConn = Connection.create(
    {
      "keng__baseUri": "http://localhost:4200/vdb-builder/v1/",
      "keng__id": "PGConn",
      "keng__dataPath": "/tko:komodo/tko:workspace/admin/PGConn",
      "keng__kType": "Connection",
      "keng__hasChildren": false,
      "dv__jndiName": "java:/postgresql-persistent-lq6sg",
      "dv__driverName": "postgresql",
      "dv__type": true,
      "keng__properties": [
        {
          "name": "description",
          "value": "Postgres connection"
        },
        {
          "name": "serviceCatalogSource",
          "value": "postgresql-persistent-lq6sg"
        }
      ],
      "keng___links": [
        {
          "rel": "self",
          "href": "http://localhost:4200/vdb-builder/v1/workspace/connections/PGConn"
        },
        {
          "rel": "parent",
          "href": "http://localhost:4200/vdb-builder/v1/workspace/connections"
        },
        {
          "rel": "children",
          "href": "http://localhost:4200/vdb-builder/v1/workspace/search?parent=%2Ftko%3Akomodo%2Ftko%3Aworkspace%2Fadmin%2FPGConn"
        }
      ]
    }
  );

  private static conn1 = Connection.create(
    {
      "keng__baseUri": "http://localhost:4200/vdb-builder/v1/",
      "keng__id": "conn1",
      "keng__dataPath": "/tko:komodo/tko:workspace/admin/conn1",
      "keng__kType": "Connection",
      "keng__hasChildren": false,
      "dv__jndiName": "java:/postgresql-persistent-j9vqv",
      "dv__driverName": "postgresql",
      "dv__type": true,
      "keng__properties": [
        {
          "name": "description",
          "value": "Postgres connection"
        },
        {
          "name": "serviceCatalogSource",
          "value": "postgresql-persistent-j9vqv"
        }
      ],
      "keng___links": [
        {
          "rel": "self",
          "href": "http://localhost:4200/vdb-builder/v1/workspace/connections/conn1"
        },
        {
          "rel": "parent",
          "href": "http://localhost:4200/vdb-builder/v1/workspace/connections"
        },
        {
          "rel": "children",
          "href": "http://localhost:4200/vdb-builder/v1/workspace/search?parent=%2Ftko%3Akomodo%2Ftko%3Aworkspace%2Fadmin%2Fconn1"
        }
      ]
    }
  );

  private static conn2 = Connection.create(
    {
      "keng__baseUri": "http://localhost:4200/vdb-builder/v1/",
      "keng__id": "conn2",
      "keng__dataPath": "/tko:komodo/tko:workspace/admin/conn2",
      "keng__kType": "Connection",
      "keng__hasChildren": false,
      "dv__jndiName": "java:/postgresql-persistent-a8xrt",
      "dv__driverName": "postgresql",
      "dv__type": true,
      "keng__properties": [
        {
          "name": "description",
          "value": "Postgres connection"
        },
        {
          "name": "serviceCatalogSource",
          "value": "postgresql-persistent-a8xrt"
        }
      ],
      "keng___links": [
        {
          "rel": "self",
          "href": "http://localhost:4200/vdb-builder/v1/workspace/connections/conn2"
        },
        {
          "rel": "parent",
          "href": "http://localhost:4200/vdb-builder/v1/workspace/connections"
        },
        {
          "rel": "children",
          "href": "http://localhost:4200/vdb-builder/v1/workspace/search?parent=%2Ftko%3Akomodo%2Ftko%3Aworkspace%2Fadmin%2Fconn2"
        }
      ]
    }
  );

  private static conn3 = Connection.create(
    {
      "keng__baseUri": "http://localhost:4200/vdb-builder/v1/",
      "keng__id": "conn3",
      "keng__dataPath": "/tko:komodo/tko:workspace/admin/conn3",
      "keng__kType": "Connection",
      "keng__hasChildren": false,
      "dv__jndiName": "java:/mysql-persistent-t3irv",
      "dv__driverName": "mysql",
      "dv__type": true,
      "keng__properties": [
        {
          "name": "description",
          "value": "MySQL connection"
        },
        {
          "name": "serviceCatalogSource",
          "value": "mysql-persistent-t3irv"
        }
      ],
      "keng___links": [
        {
          "rel": "self",
          "href": "http://localhost:4200/vdb-builder/v1/workspace/connections/conn3"
        },
        {
          "rel": "parent",
          "href": "http://localhost:4200/vdb-builder/v1/workspace/connections"
        },
        {
          "rel": "children",
          "href": "http://localhost:4200/vdb-builder/v1/workspace/search?parent=%2Ftko%3Akomodo%2Ftko%3Aworkspace%2Fadmin%2Fconn3"
        }
      ]
    }
  );

  // =================================================================
  // SchemaInfos for the connections
  // =================================================================

  private static pgConnSchemaInfos = [
    SchemaInfo.create( { name: "pgConnSchemaInfo1", type: "Schema" } ),
    SchemaInfo.create( { name: "pgConnCatalogInfo", type: "Catalog", schemaNames: [ "pgConnCatalogSchema1", "pgConnCatalogSchema2" ] } )
  ];

  private static conn1SchemaInfos = [
    SchemaInfo.create( { name: "conn1SchemaInfo1", type: "Schema" } ),
    SchemaInfo.create( { name: "conn1CatalogInfo", type: "Catalog", schemaNames: [ "conn1CatalogSchema1", "conn1CatalogSchema2" ] } )
  ];

  private static conn2SchemaInfos = [
    SchemaInfo.create( { name: "conn2CatalogInfo", type: "Catalog", schemaNames: [ "conn2CatalogSchema1", "conn2CatalogSchema2" ] } ),
    SchemaInfo.create( { name: "conn2SchemaInfo1", type: "Schema" } ),
    SchemaInfo.create( { name: "conn2SchemaInfo2", type: "Schema" } )
  ];

  private static conn3SchemaInfos = [
    SchemaInfo.create( { name: "conn3CatalogInfo", type: "Catalog", schemaNames: [ "conn3CatalogSchema1", "conn3CatalogSchema2" ] } ),
    SchemaInfo.create( { name: "conn3SchemaInfo1", type: "Schema" } ),
    SchemaInfo.create( { name: "conn3SchemaInfo2", type: "Schema" } ),
    SchemaInfo.create( { name: "conn3SchemaInfo3", type: "Schema" } )
  ];

  // =================================================================
  // Dataservices
  // =================================================================

  private static accountsService = Dataservice.create(
    {
      "keng__baseUri": "http://localhost:4200/vdb-builder/v1/",
      "keng__id": "Accounts",
      "keng__dataPath": "/tko:komodo/tko:workspace/admin/Accounts",
      "keng__kType": "Dataservice",
      "keng__hasChildren": true,
      "tko__description": "A dataservice for accounts.",
      "serviceVdbName": TestDataService.accountsVdb.getName(),
      "serviceVdbVersion": TestDataService.accountsVdb.getVersion(),
      "serviceViewModel": "views",
      "serviceViews": [
        "AcctView1",
        "AcctView2"
      ],
      "serviceViewTables": [
        TestDataService.conn1.getId() + "BtlSource.AcctView1Table1",
        TestDataService.conn1.getId() + "BtlSource.AcctView1Table2",
        TestDataService.conn1.getId() + "BtlSource.AcctView1Table3",
        TestDataService.conn1.getId() + "BtlSource.AcctView2Table1"
      ],
      "connections": 0,
      "drivers": 0,
      "keng___links": [
        {
          "rel": "self",
          "href": "http://localhost:4200/vdb-builder/v1/workspace/dataservices/Accounts"
        },
        {
          "rel": "parent",
          "href": "http://localhost:4200/vdb-builder/v1/workspace/dataservices"
        },
        {
          "rel": "children",
          "href": "http://localhost:4200/vdb-builder/v1/workspace/search?parent=%2Ftko%3Akomodo%2Ftko%3Aworkspace%2Fadmin%2FAccounts"
        },
        {
          "rel": "vdbs",
          "href": "http://localhost:4200/vdb-builder/v1/workspace/dataservices/CustService/Vdbs"
        },
        {
          "rel": "connections",
          "href": "http://localhost:4200/vdb-builder/v1/workspace/dataservices/CustService/connections"
        }
      ]
    }
  );

  private static employeesService = Dataservice.create(
    {
      "keng__baseUri": "http://localhost:4200/vdb-builder/v1/",
      "keng__id": "Employees",
      "keng__dataPath": "/tko:komodo/tko:workspace/admin/Employees",
      "keng__kType": "Dataservice",
      "keng__hasChildren": true,
      "tko__description": "A dataservice for employees.",
      "serviceVdbName": TestDataService.employeesVdb.getName(),
      "serviceVdbVersion": TestDataService.employeesVdb.getVersion(),
      "serviceViewModel": "views",
      "serviceViews": [
        "EmpView1",
        "EmpView2",
        "EmpView3",
        "EmpView4"
      ],
      "serviceViewTables": [
        TestDataService.conn2.getId() + "BtlSource.EmpView1Table1",
        TestDataService.conn2.getId() + "BtlSource.EmpView2Table1",
        TestDataService.conn2.getId() + "BtlSource.EmpView2Table2",
        TestDataService.conn2.getId() + "BtlSource.EmpView3Table1",
        TestDataService.conn2.getId() + "BtlSource.EmpView3Table2",
        TestDataService.conn2.getId() + "BtlSource.EmpView3Table3",
        TestDataService.conn2.getId() + "BtlSource.EmpView4Table1",
        TestDataService.conn2.getId() + "BtlSource.EmpView4Table2",
        TestDataService.conn2.getId() + "BtlSource.EmpView4Table3",
        TestDataService.conn2.getId() + "BtlSource.EmpView4Table4"
      ],
      "connections": 0,
      "drivers": 0,
      "keng___links": [
        {
          "rel": "self",
          "href": "http://localhost:4200/vdb-builder/v1/workspace/dataservices/Employees"
        },
        {
          "rel": "parent",
          "href": "http://localhost:4200/vdb-builder/v1/workspace/dataservices"
        },
        {
          "rel": "children",
          "href": "http://localhost:4200/vdb-builder/v1/workspace/search?parent=%2Ftko%3Akomodo%2Ftko%3Aworkspace%2Fadmin%2FEmployees"
        },
        {
          "rel": "vdbs",
          "href": "http://localhost:4200/vdb-builder/v1/workspace/dataservices/CustService/Vdbs"
        },
        {
          "rel": "connections",
          "href": "http://localhost:4200/vdb-builder/v1/workspace/dataservices/CustService/connections"
        }
      ]
    }
  );

  private static productsService = Dataservice.create(
    {
      "keng__baseUri": "http://localhost:4200/vdb-builder/v1/",
      "keng__id": "Products",
      "keng__dataPath": "/tko:komodo/tko:workspace/admin/Products",
      "keng__kType": "Dataservice",
      "keng__hasChildren": true,
      "tko__description": "A dataservice for products.",
      "serviceVdbName": TestDataService.productsVdb.getName(),
      "serviceVdbVersion": TestDataService.productsVdb.getVersion(),
      "serviceViewModel": "views",
      "serviceViews": [
        "ProdView1",
        "ProdView2",
        "ProdView3",
        "ProdView4",
        "ProdView5",
        "ProdView6"
      ],
      "serviceViewTables": [
        TestDataService.conn3.getId() + "BtlSource.ProdView1Table1",
        TestDataService.conn3.getId() + "BtlSource.ProdView2Table1",
        TestDataService.conn3.getId() + "BtlSource.ProdView2Table2",
        TestDataService.conn3.getId() + "BtlSource.ProdView3Table1",
        TestDataService.conn3.getId() + "BtlSource.ProdView3Table2",
        TestDataService.conn3.getId() + "BtlSource.ProdView3Table3",
        TestDataService.conn3.getId() + "BtlSource.ProdView4Table1",
        TestDataService.conn3.getId() + "BtlSource.ProdView4Table2",
        TestDataService.conn3.getId() + "BtlSource.ProdView4Table3",
        TestDataService.conn3.getId() + "BtlSource.ProdView4Table4",
        TestDataService.conn3.getId() + "BtlSource.ProdView5Table1",
        TestDataService.conn3.getId() + "BtlSource.ProdView5Table2",
        TestDataService.conn3.getId() + "BtlSource.ProdView5Table3",
        TestDataService.conn3.getId() + "BtlSource.ProdView5Table4",
        TestDataService.conn3.getId() + "BtlSource.ProdView5Table5",
        TestDataService.conn3.getId() + "BtlSource.ProdView6Table1",
        TestDataService.conn3.getId() + "BtlSource.ProdView6Table2",
        TestDataService.conn3.getId() + "BtlSource.ProdView6Table3",
        TestDataService.conn3.getId() + "BtlSource.ProdView6Table4",
        TestDataService.conn3.getId() + "BtlSource.ProdView6Table5",
        TestDataService.conn3.getId() + "BtlSource.ProdView6Table6"
      ],
      "connections": 0,
      "drivers": 0,
      "keng___links": [
        {
          "rel": "self",
          "href": "http://localhost:4200/vdb-builder/v1/workspace/dataservices/Products"
        },
        {
          "rel": "parent",
          "href": "http://localhost:4200/vdb-builder/v1/workspace/dataservices"
        },
        {
          "rel": "children",
          "href": "http://localhost:4200/vdb-builder/v1/workspace/search?parent=%2Ftko%3Akomodo%2Ftko%3Aworkspace%2Fadmin%2FProducts"
        },
        {
          "rel": "vdbs",
          "href": "http://localhost:4200/vdb-builder/v1/workspace/dataservices/CustService/Vdbs"
        },
        {
          "rel": "connections",
          "href": "http://localhost:4200/vdb-builder/v1/workspace/dataservices/CustService/connections"
        }
      ]
    }
  );

  private catalogSources: ServiceCatalogSource[] = [
    TestDataService.pgConnCatalogSource,
    TestDataService.catalogSource1,
    TestDataService.catalogSource2,
    TestDataService.catalogSource3];

  private connections: Connection[] = [
    TestDataService.pgConn,
    TestDataService.conn1,
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

  private jdbcTableMap = new Map<string, string[]>();
  private vdbStatuses: VdbStatus[];

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
    this.vdbStatuses = TestDataService.vdbStatuses.vdbs.map(( vdbStatus ) => VdbStatus.create( vdbStatus ) );

    this.jdbcTableMap.set( "pgConnSchemaInfo1", [
      "pgConnTable1",
      "pgConnTable2",
      "pgConnTable3",
      "pgConnTable4",
      "pgConnTable5",
      "pgConnTable6"
    ] );
    this.jdbcTableMap.set( "pgConnCatalogSchema1", [
      "pgConnTableA",
      "pgConnTableB",
      "pgConnTableC",
      "pgConnTableD",
      "pgConnTableE",
      "pgConnTableF",
      "pgConnTableG"
    ] );
    this.jdbcTableMap.set( "pgConnCatalogSchema2", [
      "cat2TableRed",
      "cat2TableWhite",
      "cat2TableBlue"
    ] );
    this.jdbcTableMap.set( "conn1SchemaInfo1", [
      "conn1Table1",
      "conn1Table2",
      "conn1Table3",
      "conn1Table4",
      "conn1Table5",
      "conn1Table6"
    ] );
    this.jdbcTableMap.set( "conn1CatalogSchema1", [
      "conn1TableA",
      "conn1TableB",
      "conn1TableC",
      "conn1TableD",
      "conn1TableE",
      "conn1TableF",
      "conn1TableG"
    ] );
    this.jdbcTableMap.set( "conn1CatalogSchema2", [
      "conn1TableRed",
      "conn1TableWhite",
      "conn1TableBlue"
    ] );
    this.jdbcTableMap.set( "conn2CatalogSchema1", [
      "conn2Table1",
      "conn2Table2",
      "conn2Table3",
      "conn2Table4",
      "conn2Table5",
      "conn2Table6",
      "conn2Table7"
    ] );
    this.jdbcTableMap.set( "conn2CatalogSchema2", [
      "conn2Cat2TableA",
      "conn2Cat2TableB",
      "conn2Cat2TableC",
      "conn2Cat2TableD",
      "conn2Cat2TableE",
      "conn2Cat2TableF",
      "conn2Cat2TableG"
    ] );
    this.jdbcTableMap.set( "conn2SchemaInfo1", [
      "conn2TableLarry",
      "conn2TableCurly",
      "conn2TableMoe"
    ] );
    this.jdbcTableMap.set( "conn2SchemaInfo2", [
      "conn2TableRed",
      "conn2TableWhite",
      "conn2TableBlue"
    ] );
    this.jdbcTableMap.set( "conn3CatalogSchema1", [
      "conn3Table1",
      "conn3Table2",
      "conn3Table3",
      "conn2Table4"
    ] );
    this.jdbcTableMap.set( "conn3CatalogSchema2", [
      "conn3Cat2TableA",
      "conn3Cat2TableB",
      "conn3Cat2TableC"
    ] );
    this.jdbcTableMap.set( "conn3SchemaInfo1", [
      "conn3TableJohn",
      "conn3TablePaul",
      "conn3TableRingo"
    ] );
    this.jdbcTableMap.set( "conn3SchemaInfo2", [
      "conn3TablePurple",
      "conn3TableBlue",
      "conn3TableGreen"
    ] );
    this.jdbcTableMap.set( "conn3SchemaInfo3", [
      "conn3TableOrange",
      "conn3TableYellow",
      "conn3TableBrown"
    ] );
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
    infoMap.set( TestDataService.pgConn.getServiceCatalogSourceName(), TestDataService.pgConnSchemaInfos );
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

  public getJdbcConnectionTableMap(): Map<string, string[]> {
    return this.jdbcTableMap;
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
