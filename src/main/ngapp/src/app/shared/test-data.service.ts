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
import { ConnectionStatus } from "@connections/shared/connection-status";
import { Connection } from "@connections/shared/connection.model";
import { SchemaNode } from "@connections/shared/schema-node.model";
import { ServiceCatalogSource } from "@connections/shared/service-catalog-source.model";
import { ConnectionSummary } from "@dataservices/shared/connection-summary.model";
import { Dataservice } from "@dataservices/shared/dataservice.model";
import { PublishState } from "@dataservices/shared/publish-state.enum";
import { QueryResults } from "@dataservices/shared/query-results.model";
import { VdbStatus } from "@dataservices/shared/vdb-status.model";
import { Vdb } from "@dataservices/shared/vdb.model";
import { Virtualization } from "@dataservices/shared/virtualization.model";
import { Column } from "@dataservices/shared/column.model";
import { ViewEditorState } from "@dataservices/shared/view-editor-state.model";

@Injectable()
export class TestDataService {

  private static readonly connectionVdbSuffix = "btlconn";
  private static readonly connectionSchemaModelSuffix = "schemamodel";
  private static readonly connectionSchemaVdbSuffix = "schemavdb";

  private static readonly pgConnCatalogSourceId = "postgresql-persistent-lq6sg";
  private static readonly catalogSourceId1 = "postgresql-persistent-j9vqv";
  private static readonly catalogSourceId2 = "postgresql-persistent-a8xrt";
  private static readonly catalogSourceId3 = "mysql-persistent-t3irv";
  private static readonly catalogSourceId4 = "mongodb-persistent-x9prt";
  private static readonly catalogSourceId5 = "mongodb-persistent-z8amy";

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

  private static status1 = VdbStatus.create(
    {
      "name": TestDataService.accountsVdb.getName(),
      "deployedName": TestDataService.accountsVdb.getName() + "-vdb.xml",
      "version": TestDataService.accountsVdb.getVersion(),
      "active": true,
      "loading": false,
      "failed": false,
      "errors": []
    }
  );

  private static status2 = VdbStatus.create(
    {
      "name": TestDataService.employeesVdb.getName(),
      "deployedName": TestDataService.employeesVdb.getName() + "-vdb.xml",
      "version": TestDataService.employeesVdb.getVersion(),
      "active": true,
      "loading": false,
      "failed": false,
      "errors": []
    }
  );

  private static status3 = VdbStatus.create(
    {
      "name": TestDataService.productsVdb.getName(),
      "deployedName": TestDataService.productsVdb.getName() + "-vdb.xml",
      "version": TestDataService.productsVdb.getVersion(),
      "active": true,
      "loading": false,
      "failed": false,
      "errors": []
    }
  );

  private static readonly vdbStatuses =
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
  private static catalogSourceMongo1 = TestDataService.createServiceCatalogSource(
    TestDataService.catalogSourceId4,
    TestDataService.catalogSourceId4,
    "mongodb",
    true );
  private static catalogSourceMongo2 = TestDataService.createServiceCatalogSource(
    TestDataService.catalogSourceId5,
    TestDataService.catalogSourceId5,
    "mongodb",
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
  // ConnectionStatus
  // =================================================================

  private static conn1Status = ConnectionStatus.create(
    {
      "connectionName": TestDataService.conn1.getId(),
      "vdbState": "ACTIVE",
      "vdbName": TestDataService.conn1.getId() + TestDataService.connectionVdbSuffix,
      "schemaState": "ACTIVE",
      "schemaVdbName": TestDataService.conn1.getId() + TestDataService.connectionSchemaVdbSuffix,
      "schemaModelName": TestDataService.conn1.getId() + TestDataService.connectionSchemaModelSuffix,
      "errors": []
    },
  );

  private static conn2Status = ConnectionStatus.create(
    {
      "connectionName": TestDataService.conn2.getId(),
      "vdbState": "ACTIVE",
      "vdbName": TestDataService.conn2.getId() + TestDataService.connectionVdbSuffix,
      "schemaState": "ACTIVE",
      "schemaVdbName": TestDataService.conn2.getId() + TestDataService.connectionSchemaVdbSuffix,
      "schemaModelName": TestDataService.conn2.getId() + TestDataService.connectionSchemaModelSuffix,
      "errors": []
    },
  );

  private static conn3Status = ConnectionStatus.create(
    {
      "connectionName": TestDataService.conn3.getId(),
      "vdbState": "ACTIVE",
      "vdbName": TestDataService.conn3.getId() + TestDataService.connectionVdbSuffix,
      "schemaState": "ACTIVE",
      "schemaVdbName": TestDataService.conn3.getId() + TestDataService.connectionSchemaVdbSuffix,
      "schemaModelName": TestDataService.conn3.getId() + TestDataService.connectionSchemaModelSuffix,
      "errors": []
    },
  );

  // =================================================================
  // Connection Summaries
  // =================================================================

  private static connSummariesConnOnly = [
    TestDataService.createConnectionSummary(TestDataService.conn1, null),
    TestDataService.createConnectionSummary(TestDataService.conn2, null),
    // TestDataService.createConnectionSummary(TestDataService.conn3, null)
  ];

  private static connSummariesSchemaStatusOnly = [
    TestDataService.createConnectionSummary(null, TestDataService.conn1Status),
    TestDataService.createConnectionSummary(null, TestDataService.conn2Status),
    // TestDataService.createConnectionSummary(null, TestDataService.conn3Status)
  ];

  private static connSummariesBothConnAndStatus = [
    TestDataService.createConnectionSummary(TestDataService.conn1, TestDataService.conn1Status),
    TestDataService.createConnectionSummary(TestDataService.conn2, TestDataService.conn2Status),
    // TestDataService.createConnectionSummary(TestDataService.conn3, TestDataService.conn3Status)
  ];

  // =================================================================
  // Schemas for the connections
  // =================================================================
  private static pgConnSchemaJson = {
    "connectionName": "pgConn",
    "name": "restaurants",
    "type": "collection",
    "path": "collection=restaurants",
    "queryable": true,
    "children": [
      {
        "connectionName": "pgConn",
        "name": "grades",
        "type": "embedded",
        "path": "collection=restaurants/embedded=grades",
        "queryable": true,
        "children": []
      },
      {
        "connectionName": "pgConn",
        "name": "location",
        "type": "embedded",
        "path": "collection=restaurants/embedded=location",
        "queryable": true,
        "children": []
      }
    ]
  };

  private static conn1SchemaJson = {
    "connectionName": "conn1",
    "name": "public",
    "type": "schema",
    "path": "schema=public",
    "queryable": false,
    "children": [
      {
        "connectionName": "conn1",
        "name": "customer",
        "type": "table",
        "path": "schema=public/table=customer",
        "queryable": true,
        "children": []
      },
      {
        "connectionName": "conn1",
        "name": "stuff",
        "type": "table",
        "path": "schema=public/table=stuff",
        "queryable": true,
        "children": []
      }
    ]
  };

  private static conn2SchemaJson = {
    "connectionName": "conn2",
    "name": "restaurants",
    "type": "collection",
    "path": "collection=restaurants",
    "queryable": true,
    "children": [
      {
        "connectionName": "conn2",
        "name": "grades",
        "type": "embedded",
        "path": "collection=restaurants/embedded=grades",
        "queryable": true,
        "children": []
      },
      {
        "connectionName": "conn2",
        "name": "location",
        "type": "embedded",
        "path": "collection=restaurants/embedded=location",
        "queryable": true,
        "children": []
      }
    ]
  };

  private static conn3SchemaJson = {
    "connectionName": "conn3",
    "name": "public",
    "type": "schema",
    "path": "schema=public",
    "queryable": false,
    "children": [
      {
        "connectionName": "conn3",
        "name": "customer",
        "type": "table",
        "path": "schema=public/table=customer",
        "queryable": true,
        "children": []
      },
      {
        "connectionName": "conn3",
        "name": "stuff",
        "type": "table",
        "path": "schema=public/table=stuff",
        "queryable": true,
        "children": []
      }
    ]
  };

  // =================================================================
  // Result sets
  // =================================================================
  private static employeeJson = {
    "columns": [
      {
        "name": "ssn",
        "label": "ssn",
        "type": "string"
      },
      {
        "name": "firstname",
        "label": "firstname",
        "type": "string"
      },
      {
        "name": "lastname",
        "label": "lastname",
        "type": "string"
      },
      {
        "name": "st_address",
        "label": "st_address",
        "type": "string"
      },
      {
        "name": "apt_number",
        "label": "apt_number",
        "type": "string"
      },
      {
        "name": "city",
        "label": "city",
        "type": "string"
      },
      {
        "name": "state",
        "label": "state",
        "type": "string"
      },
      {
        "name": "zipcode",
        "label": "zipcode",
        "type": "string"
      },
      {
        "name": "phone",
        "label": "phone",
        "type": "string"
      }
    ],
    "rows": [
      {
        "row": [
          "CST01002  ",
          "Joseph",
          "Smith",
          "1234 Main Street",
          "Apartment 56",
          "New York",
          "New York",
          "10174",
          "(646)555-1776"
        ]
      },
      {
        "row": [
          "CST01003  ",
          "Nicholas",
          "Ferguson",
          "202 Palomino Drive",
          "",
          "Pittsburgh",
          "Pennsylvania",
          "15071",
          "(412)555-4327"
        ]
      },
      {
        "row": [
          "CST01004  ",
          "Jane",
          "Aire",
          "15 State Street",
          "",
          "Philadelphia",
          "Pennsylvania",
          "19154",
          "(814)555-6789"
        ]
      },
      {
        "row": [
          "CST01005  ",
          "Charles",
          "Jones",
          "1819 Maple Street",
          "Apartment 17F",
          "Stratford",
          "Connecticut",
          "06614",
          "(203)555-3947"
        ]
      },
      {
        "row": [
          "CST01006  ",
          "Virginia",
          "Jefferson",
          "1710 South 51st Street",
          "Apartment 3245",
          "New York",
          "New York",
          "10175",
          "(718)555-2693"
        ]
      },
      {
        "row": [
          "CST01007  ",
          "Ralph",
          "Bacon",
          "57 Barn Swallow Avenue",
          "",
          "Charlotte",
          "North Carolina",
          "28205",
          "(704)555-4576"
        ]
      },
      {
        "row": [
          "CST01008  ",
          "Bonnie",
          "Dragon",
          "88 Cinderella Lane",
          "",
          "Jacksonville",
          "Florida",
          "32225",
          "(904)555-6514"
        ]
      },
      {
        "row": [
          "CST01009  ",
          "Herbert",
          "Smith",
          "12225 Waterfall Way",
          "Building 100, Suite 9",
          "Portland",
          "Oregon",
          "97220",
          "(971)555-7803"
        ]
      },
      {
        "row": [
          "CST01015  ",
          "Jack",
          "Corby",
          "1 Lone Star Way",
          "",
          "Dallas",
          "Texas",
          "75231",
          "(469)555-8023"
        ]
      },
      {
        "row": [
          "CST01019  ",
          "Robin",
          "Evers",
          "1814 Falcon Avenue",
          "",
          "Atlanta",
          "Georgia",
          "30355",
          "(470)555-4390"
        ]
      },
      {
        "row": [
          "CST01020  ",
          "Lloyd",
          "Abercrombie",
          "1954 Hughes Parkway",
          "",
          "Los Angeles",
          "California",
          "90099",
          "(213)555-2312"
        ]
      },
      {
        "row": [
          "CST01021  ",
          "Scott",
          "Watters",
          "24 Mariner Way",
          "",
          "Seattle",
          "Washington",
          "98124",
          "(206)555-6790"
        ]
      },
      {
        "row": [
          "CST01022  ",
          "Sandra",
          "King",
          "96 Lakefront Parkway",
          "",
          "Minneapolis",
          "Minnesota",
          "55426",
          "(651)555-9017"
        ]
      },
      {
        "row": [
          "CST01027  ",
          "Maryanne",
          "Peters",
          "35 Grand View Circle",
          "Apartment 5F",
          "Cincinnati",
          "Ohio",
          "45232",
          "(513)555-9067"
        ]
      },
      {
        "row": [
          "CST01034  ",
          "Corey",
          "Snyder",
          "1760 Boston Commons Avenue",
          "Suite 543",
          "Boston",
          "Massachusetts",
          "02136 ",
          "(617)555-3546"
        ]
      }
    ]
  };

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
      "serviceViewDefinitions": [
      ],
      "serviceViewTables": [
        "connection=" + TestDataService.conn1.getId().toLowerCase() + "/schema=public/table=tbl1",
        "connection=" + TestDataService.conn1.getId().toLowerCase() + "/schema=public/table=tbl1"
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
      "serviceViewDefinitions": [
        "employeesView1",
        "employeesView2"
      ],
      "serviceViewTables": [
        "connection=" + TestDataService.conn2.getId().toLowerCase() + "/schema=public/table=tbl1",
        "connection=" + TestDataService.conn2.getId().toLowerCase() + "/schema=public/table=tbl2",
        "connection=" + TestDataService.conn2.getId().toLowerCase() + "/schema=public/table=tbl3",
        "connection=" + TestDataService.conn2.getId().toLowerCase() + "/schema=public/table=tbl4"
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
      "tko__description": "A dataservice for products. Make this a much longer description, to see what happens...  Make this a much longer description, to see what happens...  Make this a much longer description, to see what happens...  Make this a much longer description, to see what happens...  Make this a much longer description, to see what happens...  Make it even longer now and longer",
      "serviceVdbName": TestDataService.productsVdb.getName(),
      "serviceVdbVersion": TestDataService.productsVdb.getVersion(),
      "serviceViewModel": "views",
      "serviceViewDefinitions": [
        "productsView1",
        "productsView2",
        "productsView3"
      ],
      "serviceViewTables": [
        "connection=" + TestDataService.conn3.getId().toLowerCase() + "/schema=public/table=tbl1",
        "connection=" + TestDataService.conn3.getId().toLowerCase() + "/schema=public/table=tbl2",
        "connection=" + TestDataService.conn3.getId().toLowerCase() + "/schema=public/table=tbl3",
        "connection=" + TestDataService.conn3.getId().toLowerCase() + "/schema=public/table=tbl4",
        "connection=" + TestDataService.conn3.getId().toLowerCase() + "/schema=public/table=tbl5",
        "connection=" + TestDataService.conn3.getId().toLowerCase() + "/schema=public/table=tbl6"
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

  // =================================================================
  // Virtualizations
  // =================================================================

  private static accountsVirtualization = Virtualization.create(
    {
      "vdb_name": TestDataService.accountsVdb.getName(),
      "build_name": TestDataService.accountsVdb.getName() + "-build-1",
      "deployment_name": TestDataService.accountsVdb.getName() + "-deployment-1",
      "build_status": "RUNNING", /* NOTFOUND, BUILDING, DEPLOYING, RUNNING, FAILED, CANCELLED */
      "build_status_message": "Accounts VDB build was successful",
      "namespace": "beetle-studio",
      "last_updated": "2018-03-29T17:02:51.181Z",
      "publishState": PublishState.PUBLISHED,
      "routes": [
        {
          "name": TestDataService.accountsVdb.getName() + "-odata",
          "protocol": "odata",
          "target": TestDataService.accountsVdb.getName() + "-odata",
          "host": TestDataService.accountsVdb.getName() + "-odata" + "-beetle-studio.192.168.xx.yy",
          "port": "odata",
          "secure": true
        }
      ]
    }
  );

  private static employeesVirtualization = Virtualization.create(
    {
      "vdb_name": TestDataService.employeesVdb.getName(),
      "build_name": TestDataService.employeesVdb.getName() + "-build-1",
      "deployment_name": TestDataService.employeesVdb.getName() + "-deployment-1",
      "build_status": "RUNNING", /* NOTFOUND, BUILDING, DEPLOYING, RUNNING, FAILED, CANCELLED */
      "build_status_message": "Employees VDB build was successful",
      "namespace": "beetle-studio",
      "last_updated": "2018-03-29T17:02:51.181Z",
      "publishState": PublishState.PUBLISHED,
      "routes": [
        {
          "name": TestDataService.employeesVdb.getName() + "-odata",
          "protocol": "odata",
          "target": TestDataService.employeesVdb.getName() + "-odata",
          "host": TestDataService.employeesVdb.getName() + "-odata" + "-beetle-studio.192.168.xx.yy",
          "port": "odata",
          "secure": true
        }
      ]
    }
  );

  private static productsVirtualization = Virtualization.create(
    {
      "vdb_name": TestDataService.productsVdb.getName(),
      "build_name": TestDataService.productsVdb.getName() + "-build-1",
      "deployment_name": TestDataService.productsVdb.getName() + "-deployment-1",
      "build_status": "RUNNING", /* NOTFOUND, BUILDING, DEPLOYING, RUNNING, FAILED, CANCELLED */
      "build_status_message": "Products VDB build was successful",
      "namespace": "beetle-studio",
      "last_updated": "2018-03-29T17:02:51.181Z",
      "publishState": PublishState.PUBLISHED,
      "routes": [
        {
          "name": TestDataService.productsVdb.getName() + "-odata",
          "protocol": "odata",
          "target": TestDataService.productsVdb.getName() + "-odata",
          "host": TestDataService.productsVdb.getName() + "-odata" + "-beetle-studio.192.168.xx.yy",
          "port": "odata",
          "secure": true
        }
      ]
    }
  );

  // =================================================================
  // ViewEditorStates
  // =================================================================

  private static employeesViewState1 = ViewEditorState.create(
    {
      "keng__baseUri": "http://das-beetle-studio.192.168.42.154.nip.io/vdb-builder/v1/",
      "id": "employeesvdb.employeesView1",
      "undoables": [
        {
          "undo": {
            "id": "UpdateViewNameCommand",
            "args": {
              "oldName": "v"
            }
          },
          "redo": {
            "id": "UpdateViewNameCommand",
            "args": {
              "newName": "v"
            }
          }
        },
        {
          "undo": {
            "id": "UpdateViewNameCommand",
            "args": {
              "newName": "v",
              "oldName": "vi"
            }
          },
          "redo": {
            "id": "UpdateViewNameCommand",
            "args": {
              "newName": "vi",
              "oldName": "v"
            }
          }
        },
        {
          "undo": {
            "id": "UpdateViewNameCommand",
            "args": {
              "newName": "vi",
              "oldName": "vie"
            }
          },
          "redo": {
            "id": "UpdateViewNameCommand",
            "args": {
              "newName": "vie",
              "oldName": "vi"
            }
          }
        },
        {
          "undo": {
            "id": "UpdateViewNameCommand",
            "args": {
              "newName": "vie",
              "oldName": "view"
            }
          },
          "redo": {
            "id": "UpdateViewNameCommand",
            "args": {
              "newName": "view",
              "oldName": "vie"
            }
          }
        },
        {
          "undo": {
            "id": "RemoveSourcesCommand",
            "args": {
              "ObjectId": "AddSourcesCommand1532727452660",
              "removedSourcePaths": "connection=pgConn/schema=public/table=account"
            }
          },
          "redo": {
            "id": "AddSourcesCommand",
            "args": {
              "ObjectId": "AddSourcesCommand1532727452660",
              "addedSourcePaths": "connection=pgConn/schema=public/table=account"
            }
          }
        },
        {
          "undo": {
            "id": "RemoveSourcesCommand",
            "args": {
              "ObjectId": "AddSourcesCommand1532727472867",
              "removedSourcePaths": "connection=pgConn/schema=public/table=product"
            }
          },
          "redo": {
            "id": "AddSourcesCommand",
            "args": {
              "ObjectId": "AddSourcesCommand1532727472867",
              "addedSourcePaths": "connection=pgConn/schema=public/table=product"
            }
          }
        },
        {
          "undo": {
            "id": "RemoveCompositionCommand",
            "args": {
              "ObjectId": "AddCompositionCommand1532727472875",
              "removedComposition": "{\"name\":\"account-product\",\"leftSourcePath\":\"connection=pgConn/schema=public/table=account\",\"rightSourcePath\":\"connection=pgConn/schema=public/table=product\",\"leftCriteriaColumn\":\"account_id\",\"rightCriteriaColumn\":\"id\",\"type\":\"INNER_JOIN\",\"operator\":\"EQ\"}"
            }
          },
          "redo": {
            "id": "AddCompositionCommand",
            "args": {
              "ObjectId": "AddCompositionCommand1532727472875",
              "addedComposition": "{\"name\":\"account-product\",\"leftSourcePath\":\"connection=pgConn/schema=public/table=account\",\"rightSourcePath\":\"connection=pgConn/schema=public/table=product\",\"leftCriteriaColumn\":\"account_id\",\"rightCriteriaColumn\":\"id\",\"type\":\"INNER_JOIN\",\"operator\":\"EQ\"}"
            }
          }
        }
      ],
      "viewDefinition":
        {
          "viewName": "employeesView1",
          "keng__description": "Single Source",
          "isComplete": true,
          "sourcePaths":
            [
              "connection=conn1/schema=public/table=customer"
            ]
        }
    }
  );

  private static employeesViewState2 = ViewEditorState.create(
    {
      "keng__baseUri": "http://das-beetle-studio.192.168.42.154.nip.io/vdb-builder/v1/",
      "id": "employeesvdb.employeesView2",
      "undoables": [
        {
          "undo": {
            "id": "UpdateViewNameCommand",
            "args": {
              "oldName": "v"
            }
          },
          "redo": {
            "id": "UpdateViewNameCommand",
            "args": {
              "newName": "v"
            }
          }
        },
        {
          "undo": {
            "id": "UpdateViewNameCommand",
            "args": {
              "newName": "v",
              "oldName": "vi"
            }
          },
          "redo": {
            "id": "UpdateViewNameCommand",
            "args": {
              "newName": "vi",
              "oldName": "v"
            }
          }
        },
        {
          "undo": {
            "id": "UpdateViewNameCommand",
            "args": {
              "newName": "vi",
              "oldName": "vie"
            }
          },
          "redo": {
            "id": "UpdateViewNameCommand",
            "args": {
              "newName": "vie",
              "oldName": "vi"
            }
          }
        },
        {
          "undo": {
            "id": "UpdateViewNameCommand",
            "args": {
              "newName": "vie",
              "oldName": "view"
            }
          },
          "redo": {
            "id": "UpdateViewNameCommand",
            "args": {
              "newName": "view",
              "oldName": "vie"
            }
          }
        },
        {
          "undo": {
            "id": "RemoveSourcesCommand",
            "args": {
              "ObjectId": "AddSourcesCommand1532727452660",
              "removedSourcePaths": "connection=pgConn/schema=public/table=account"
            }
          },
          "redo": {
            "id": "AddSourcesCommand",
            "args": {
              "ObjectId": "AddSourcesCommand1532727452660",
              "addedSourcePaths": "connection=pgConn/schema=public/table=account"
            }
          }
        },
        {
          "undo": {
            "id": "RemoveSourcesCommand",
            "args": {
              "ObjectId": "AddSourcesCommand1532727472867",
              "removedSourcePaths": "connection=pgConn/schema=public/table=product"
            }
          },
          "redo": {
            "id": "AddSourcesCommand",
            "args": {
              "ObjectId": "AddSourcesCommand1532727472867",
              "addedSourcePaths": "connection=pgConn/schema=public/table=product"
            }
          }
        },
        {
          "undo": {
            "id": "RemoveCompositionCommand",
            "args": {
              "ObjectId": "AddCompositionCommand1532727472875",
              "removedComposition": "{\"name\":\"account-product\",\"leftSourcePath\":\"connection=pgConn/schema=public/table=account\",\"rightSourcePath\":\"connection=pgConn/schema=public/table=product\",\"leftCriteriaColumn\":\"account_id\",\"rightCriteriaColumn\":\"id\",\"type\":\"INNER_JOIN\",\"operator\":\"EQ\"}"
            }
          },
          "redo": {
            "id": "AddCompositionCommand",
            "args": {
              "ObjectId": "AddCompositionCommand1532727472875",
              "addedComposition": "{\"name\":\"account-product\",\"leftSourcePath\":\"connection=pgConn/schema=public/table=account\",\"rightSourcePath\":\"connection=pgConn/schema=public/table=product\",\"leftCriteriaColumn\":\"account_id\",\"rightCriteriaColumn\":\"id\",\"type\":\"INNER_JOIN\",\"operator\":\"EQ\"}"
            }
          }
        }
      ],
      "viewDefinition":
        {
          "viewName": "employeesView2",
          "keng__description": "Join between customer and stuff",
          "isComplete": true,
          "sourcePaths":
            [
              "connection=conn1/schema=public/table=customer",
              "connection=conn1/schema=public/table=stuff"
            ],
          "compositions":
            [
              {
                "name": "customer-stuff",
                "leftSourcePath": "connection=conn1/schema=public/table=customer",
                "rightSourcePath": "connection=conn1/schema=public/table=stuff",
                "leftCriteriaColumn": "leftCriteriaCol",
                "rightCriteriaColumn": "rightCriteriaCol",
                "type": "INNER_JOIN",
                "operator": "EQ"
              }
            ]
        }
    }
  );

  private static productsViewState1 = ViewEditorState.create(
    {
      "keng__baseUri": "http://das-beetle-studio.192.168.42.154.nip.io/vdb-builder/v1/",
      "id": "productsvdb.productsView1",
      "undoables": [
        {
          "undo": {
            "id": "UpdateViewNameCommand",
            "args": {
              "oldName": "v"
            }
          },
          "redo": {
            "id": "UpdateViewNameCommand",
            "args": {
              "newName": "v"
            }
          }
        },
        {
          "undo": {
            "id": "UpdateViewNameCommand",
            "args": {
              "newName": "v",
              "oldName": "vi"
            }
          },
          "redo": {
            "id": "UpdateViewNameCommand",
            "args": {
              "newName": "vi",
              "oldName": "v"
            }
          }
        },
        {
          "undo": {
            "id": "UpdateViewNameCommand",
            "args": {
              "newName": "vi",
              "oldName": "vie"
            }
          },
          "redo": {
            "id": "UpdateViewNameCommand",
            "args": {
              "newName": "vie",
              "oldName": "vi"
            }
          }
        },
        {
          "undo": {
            "id": "UpdateViewNameCommand",
            "args": {
              "newName": "vie",
              "oldName": "view"
            }
          },
          "redo": {
            "id": "UpdateViewNameCommand",
            "args": {
              "newName": "view",
              "oldName": "vie"
            }
          }
        },
        {
          "undo": {
            "id": "RemoveSourcesCommand",
            "args": {
              "ObjectId": "AddSourcesCommand1532727452660",
              "removedSourcePaths": "connection=pgConn/schema=public/table=account"
            }
          },
          "redo": {
            "id": "AddSourcesCommand",
            "args": {
              "ObjectId": "AddSourcesCommand1532727452660",
              "addedSourcePaths": "connection=pgConn/schema=public/table=account"
            }
          }
        },
        {
          "undo": {
            "id": "RemoveSourcesCommand",
            "args": {
              "ObjectId": "AddSourcesCommand1532727472867",
              "removedSourcePaths": "connection=pgConn/schema=public/table=product"
            }
          },
          "redo": {
            "id": "AddSourcesCommand",
            "args": {
              "ObjectId": "AddSourcesCommand1532727472867",
              "addedSourcePaths": "connection=pgConn/schema=public/table=product"
            }
          }
        },
        {
          "undo": {
            "id": "RemoveCompositionCommand",
            "args": {
              "ObjectId": "AddCompositionCommand1532727472875",
              "removedComposition": "{\"name\":\"account-product\",\"leftSourcePath\":\"connection=pgConn/schema=public/table=account\",\"rightSourcePath\":\"connection=pgConn/schema=public/table=product\",\"leftCriteriaColumn\":\"account_id\",\"rightCriteriaColumn\":\"id\",\"type\":\"INNER_JOIN\",\"operator\":\"EQ\"}"
            }
          },
          "redo": {
            "id": "AddCompositionCommand",
            "args": {
              "ObjectId": "AddCompositionCommand1532727472875",
              "addedComposition": "{\"name\":\"account-product\",\"leftSourcePath\":\"connection=pgConn/schema=public/table=account\",\"rightSourcePath\":\"connection=pgConn/schema=public/table=product\",\"leftCriteriaColumn\":\"account_id\",\"rightCriteriaColumn\":\"id\",\"type\":\"INNER_JOIN\",\"operator\":\"EQ\"}"
            }
          }
        }
      ],
      "viewDefinition":
        {
          "viewName": "productsView1",
          "keng__description": "signle source conn1 stuff",
          "isComplete": true,
          "sourcePaths":
            [
              "connection=conn1/schema=public/table=stuff"
            ]
        }
    }
  );

  private static productsViewState2 = ViewEditorState.create(
    {
      "keng__baseUri": "http://das-beetle-studio.192.168.42.154.nip.io/vdb-builder/v1/",
      "id": "productsvdb.productsView2",
      "undoables": [
        {
          "undo": {
            "id": "UpdateViewNameCommand",
            "args": {
              "oldName": "v"
            }
          },
          "redo": {
            "id": "UpdateViewNameCommand",
            "args": {
              "newName": "v"
            }
          }
        },
        {
          "undo": {
            "id": "UpdateViewNameCommand",
            "args": {
              "newName": "v",
              "oldName": "vi"
            }
          },
          "redo": {
            "id": "UpdateViewNameCommand",
            "args": {
              "newName": "vi",
              "oldName": "v"
            }
          }
        },
        {
          "undo": {
            "id": "UpdateViewNameCommand",
            "args": {
              "newName": "vi",
              "oldName": "vie"
            }
          },
          "redo": {
            "id": "UpdateViewNameCommand",
            "args": {
              "newName": "vie",
              "oldName": "vi"
            }
          }
        },
        {
          "undo": {
            "id": "UpdateViewNameCommand",
            "args": {
              "newName": "vie",
              "oldName": "view"
            }
          },
          "redo": {
            "id": "UpdateViewNameCommand",
            "args": {
              "newName": "view",
              "oldName": "vie"
            }
          }
        },
        {
          "undo": {
            "id": "RemoveSourcesCommand",
            "args": {
              "ObjectId": "AddSourcesCommand1532727452660",
              "removedSourcePaths": "connection=pgConn/schema=public/table=account"
            }
          },
          "redo": {
            "id": "AddSourcesCommand",
            "args": {
              "ObjectId": "AddSourcesCommand1532727452660",
              "addedSourcePaths": "connection=pgConn/schema=public/table=account"
            }
          }
        },
        {
          "undo": {
            "id": "RemoveSourcesCommand",
            "args": {
              "ObjectId": "AddSourcesCommand1532727472867",
              "removedSourcePaths": "connection=pgConn/schema=public/table=product"
            }
          },
          "redo": {
            "id": "AddSourcesCommand",
            "args": {
              "ObjectId": "AddSourcesCommand1532727472867",
              "addedSourcePaths": "connection=pgConn/schema=public/table=product"
            }
          }
        },
        {
          "undo": {
            "id": "RemoveCompositionCommand",
            "args": {
              "ObjectId": "AddCompositionCommand1532727472875",
              "removedComposition": "{\"name\":\"account-product\",\"leftSourcePath\":\"connection=pgConn/schema=public/table=account\",\"rightSourcePath\":\"connection=pgConn/schema=public/table=product\",\"leftCriteriaColumn\":\"account_id\",\"rightCriteriaColumn\":\"id\",\"type\":\"INNER_JOIN\",\"operator\":\"EQ\"}"
            }
          },
          "redo": {
            "id": "AddCompositionCommand",
            "args": {
              "ObjectId": "AddCompositionCommand1532727472875",
              "addedComposition": "{\"name\":\"account-product\",\"leftSourcePath\":\"connection=pgConn/schema=public/table=account\",\"rightSourcePath\":\"connection=pgConn/schema=public/table=product\",\"leftCriteriaColumn\":\"account_id\",\"rightCriteriaColumn\":\"id\",\"type\":\"INNER_JOIN\",\"operator\":\"EQ\"}"
            }
          }
        }
      ],
      "viewDefinition":
        {
          "viewName": "productsView2",
          "keng__description": "join restaurants and grades",
          "isComplete": true,
          "sourcePaths":
            [
              "connection=conn2/collections=restaurants",
              "connection=conn2/collections=restaurants/embedded=grades"
            ],
          "compositions":
            [
              {
                "name": "compositionName",
                "leftSourcePath": "connection=conn2/collections=restaurants",
                "rightSourcePath": "connection=conn2/collections=restaurants/embedded=grades",
                "leftCriteriaColumn": "leftCriteriaCol",
                "rightCriteriaColumn": "rightCriteriaCol",
                "type": "INNER_JOIN",
                "operator": "EQ"
              }
            ]
        }
    }
  );

  private static productsViewState3 = ViewEditorState.create(
    {
      "keng__baseUri": "http://das-beetle-studio.192.168.42.154.nip.io/vdb-builder/v1/",
      "id": "productsvdb.productsView3",
      "undoables": [
        {
          "undo": {
            "id": "UpdateViewNameCommand",
            "args": {
              "oldName": "v"
            }
          },
          "redo": {
            "id": "UpdateViewNameCommand",
            "args": {
              "newName": "v"
            }
          }
        },
        {
          "undo": {
            "id": "UpdateViewNameCommand",
            "args": {
              "newName": "v",
              "oldName": "vi"
            }
          },
          "redo": {
            "id": "UpdateViewNameCommand",
            "args": {
              "newName": "vi",
              "oldName": "v"
            }
          }
        },
        {
          "undo": {
            "id": "UpdateViewNameCommand",
            "args": {
              "newName": "vi",
              "oldName": "vie"
            }
          },
          "redo": {
            "id": "UpdateViewNameCommand",
            "args": {
              "newName": "vie",
              "oldName": "vi"
            }
          }
        },
        {
          "undo": {
            "id": "UpdateViewNameCommand",
            "args": {
              "newName": "vie",
              "oldName": "view"
            }
          },
          "redo": {
            "id": "UpdateViewNameCommand",
            "args": {
              "newName": "view",
              "oldName": "vie"
            }
          }
        },
        {
          "undo": {
            "id": "RemoveSourcesCommand",
            "args": {
              "ObjectId": "AddSourcesCommand1532727452660",
              "removedSourcePaths": "connection=pgConn/schema=public/table=account"
            }
          },
          "redo": {
            "id": "AddSourcesCommand",
            "args": {
              "ObjectId": "AddSourcesCommand1532727452660",
              "addedSourcePaths": "connection=pgConn/schema=public/table=account"
            }
          }
        },
        {
          "undo": {
            "id": "RemoveSourcesCommand",
            "args": {
              "ObjectId": "AddSourcesCommand1532727472867",
              "removedSourcePaths": "connection=pgConn/schema=public/table=product"
            }
          },
          "redo": {
            "id": "AddSourcesCommand",
            "args": {
              "ObjectId": "AddSourcesCommand1532727472867",
              "addedSourcePaths": "connection=pgConn/schema=public/table=product"
            }
          }
        },
        {
          "undo": {
            "id": "RemoveCompositionCommand",
            "args": {
              "ObjectId": "AddCompositionCommand1532727472875",
              "removedComposition": "{\"name\":\"account-product\",\"leftSourcePath\":\"connection=pgConn/schema=public/table=account\",\"rightSourcePath\":\"connection=pgConn/schema=public/table=product\",\"leftCriteriaColumn\":\"account_id\",\"rightCriteriaColumn\":\"id\",\"type\":\"INNER_JOIN\",\"operator\":\"EQ\"}"
            }
          },
          "redo": {
            "id": "AddCompositionCommand",
            "args": {
              "ObjectId": "AddCompositionCommand1532727472875",
              "addedComposition": "{\"name\":\"account-product\",\"leftSourcePath\":\"connection=pgConn/schema=public/table=account\",\"rightSourcePath\":\"connection=pgConn/schema=public/table=product\",\"leftCriteriaColumn\":\"account_id\",\"rightCriteriaColumn\":\"id\",\"type\":\"INNER_JOIN\",\"operator\":\"EQ\"}"
            }
          }
        }
      ],
      "viewDefinition":
        {
          "viewName": "productsView3",
          "keng__description": "join restaurants and customer",
          "isComplete": true,
          "sourcePaths":
            [
              "connection=conn2/collections=restaurants",
              "connection=conn1/schema=public/table=customer"
            ],
          "compositions":
            [
              {
                "name": "compositionName",
                "leftSourcePath": "connection=conn2/collections=restaurants",
                "rightSourcePath": "connection=conn1/schema=public/table=customer",
                "leftCriteriaColumn": "leftCriteriaCol",
                "rightCriteriaColumn": "rightCriteriaCol",
                "type": "INNER_JOIN",
                "operator": "EQ"
              }
            ]
        }
    }
  );

  private catalogSources: ServiceCatalogSource[] = [
    TestDataService.pgConnCatalogSource,
    TestDataService.catalogSource1,
    TestDataService.catalogSource2,
    TestDataService.catalogSource3,
    TestDataService.catalogSourceMongo1,
    TestDataService.catalogSourceMongo2];

  private connections: Connection[] = [
    TestDataService.pgConn,
    TestDataService.conn1,
    TestDataService.conn2,
    TestDataService.conn3];

  private vdbs: Vdb[] = [
    TestDataService.accountsVdb,
    TestDataService.employeesVdb,
    TestDataService.productsVdb
  ];

  private readonly vdbStatuses: VdbStatus[];
  private readonly virtualizations: Virtualization[];
  private readonly dataServices: Dataservice[];

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

  /**
   * Create a ConnectionSummary using the specified info
   * @param {Connection} conn the connection
   * @param {ConnectionStatus} status the connection status
   * @returns {ConnectionSummary}
   */
  private static createConnectionSummary( conn: Connection, status: ConnectionStatus ): ConnectionSummary {
    const connectionSummary = new ConnectionSummary();
    connectionSummary.setConnection(conn);
    connectionSummary.setStatus(status);
    return connectionSummary;
  }

  constructor() {
    this.vdbStatuses = TestDataService.vdbStatuses.vdbs.map(( vdbStatus ) => VdbStatus.create( vdbStatus ) );
    this.virtualizations = [
      TestDataService.accountsVirtualization,
      TestDataService.employeesVirtualization,
      TestDataService.productsVirtualization
    ];
    this.dataServices = [];
    const svc1: Dataservice = TestDataService.accountsService;
    const svc2: Dataservice = TestDataService.employeesService;
    const svc3: Dataservice = TestDataService.productsService;

    this.dataServices.push(svc1);
    this.dataServices.push(svc2);
    this.dataServices.push(svc3);
  }

  /**
   * Get connection summaries based on supplied parameters
   * @param {boolean} includeConnection include connection in the summary
   * @param {boolean} includeSchemaStatus include schema status in the summary
   * @returns {Connection[]} the array of test connections
   */
  public getConnectionSummaries(includeConnection: boolean, includeSchemaStatus: boolean): ConnectionSummary[] {
    if (includeConnection && includeSchemaStatus) {
      return TestDataService.connSummariesBothConnAndStatus;
    } else if (includeConnection && !includeSchemaStatus) {
      return TestDataService.connSummariesConnOnly;
    } else if (includeSchemaStatus && !includeConnection) {
      return TestDataService.connSummariesSchemaStatusOnly;
    }
  }

  /**
   * @returns {ServiceCatalogSource[]} the array of test Service Catalog datasources
   */
  public getServiceCatalogSources(): ServiceCatalogSource[] {
    return this.catalogSources;
  }

  /**
   * @returns {Dataservice[]} the array of test dataservices
   */
  public getDataservices(): Dataservice[] {
    return this.dataServices;
  }

  /**
   * @returns {QueryResults} test query results
   */
  public getQueryResults(): QueryResults {

    return new QueryResults(TestDataService.employeeJson);
  }

  /**
   * @returns {Map<string, SchemaNode[]>} the array of SchemaNodes for connection
   */
  public getConnectionSchemaMap(): Map<string, SchemaNode[]> {
    const nodesMap = new Map<string, SchemaNode[]>();

    const pgConnSchemaRoots: SchemaNode[] = [];
    const sNode = SchemaNode.create(TestDataService.pgConnSchemaJson);
    pgConnSchemaRoots.push(sNode);

    const conn1SchemaRoots: SchemaNode[] = [];
    const sNode1 = SchemaNode.create(TestDataService.conn1SchemaJson);
    conn1SchemaRoots.push(sNode1);

    const conn2SchemaRoots: SchemaNode[] = [];
    const sNode2 = SchemaNode.create(TestDataService.conn2SchemaJson);
    conn2SchemaRoots.push(sNode2);

    const conn3SchemaRoots: SchemaNode[] = [];
    const sNode3 = SchemaNode.create(TestDataService.conn3SchemaJson);
    conn3SchemaRoots.push(sNode3);

    // nodesMap.set( TestDataService.pgConn.getId(), pgConnSchemaRoots );
    nodesMap.set( TestDataService.conn1.getId(), conn1SchemaRoots );
    nodesMap.set( TestDataService.conn2.getId(), conn2SchemaRoots );
    // nodesMap.set( TestDataService.conn3.getId(), conn3SchemaRoots );
    return nodesMap;
  }

  /**
   * @returns {Map<string, Column[]>} the array of Columns for connection:tableOption
   */
  public getConnectionSchemaColumnsMap(): Map<string, Column[]> {
    const columnsMap = new Map<string, Column[]>();

    const col1 = new Column();
    col1.setName("col1");
    col1.setDatatype("string");
    col1.setSize(6);
    col1.setSelected(false);
    const col2 = new Column();
    col2.setName("col2");
    col2.setDatatype("string");
    col2.setSize(6);
    col2.setSelected(false);
    const col3 = new Column();
    col3.setName("col3");
    col3.setDatatype("string");
    col3.setSize(6);
    col3.setSelected(false);
    const col4 = new Column();
    col4.setName("col4");
    col4.setDatatype("string");
    col4.setSize(6);
    col4.setSelected(false);
    const col5 = new Column();
    col5.setName("col5");
    col5.setDatatype("string");
    col5.setSize(6);
    col5.setSelected(false);
    const col6 = new Column();
    col6.setName("col6");
    col6.setDatatype("string");
    col6.setSize(6);
    col6.setSelected(false);
    const col7 = new Column();
    col7.setName("col7");
    col7.setDatatype("string");
    col7.setSize(6);
    col7.setSelected(false);
    const col8 = new Column();
    col8.setName("col8");
    col8.setDatatype("string");
    col8.setSize(6);
    col8.setSelected(false);
    const col9 = new Column();
    col9.setName("col9");
    col9.setDatatype("string");
    col9.setSize(6);
    col9.setSelected(false);
    const col10 = new Column();
    col10.setName("col10");
    col10.setDatatype("string");
    col10.setSize(6);
    col10.setSelected(false);

    const conn1Table1Id = TestDataService.conn1.getId() + ":" + "schema=public/table=customer";
    const conn1Table2Id = TestDataService.conn1.getId() + ":" + "schema=public/table=stuff";
    const conn2Table1Id = TestDataService.conn2.getId() + ":" + "collection=restaurants";
    const conn2Table2Id = TestDataService.conn2.getId() + ":" + "collection=restaurants/embedded=grades";
    const conn2Table3Id = TestDataService.conn2.getId() + ":" + "collection=restaurants/embedded=location";
    columnsMap.set( conn1Table1Id, [col1, col2] );
    columnsMap.set( conn1Table2Id, [col3, col5, col4] );
    columnsMap.set( conn2Table1Id, [col6] );
    columnsMap.set( conn2Table2Id, [col7, col8] );
    columnsMap.set( conn2Table3Id, [col9, col10] );
    return columnsMap;
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

  /**
   * @returns {Virtualization[]} the virtualization collection
   */
  public getVirtualizations(): Virtualization[] {
    return this.virtualizations;
  }

  /**
   * @returns {Map<string, ViewEditorState>} the ViewEditorState by id map
   */
  public getViewEditorStateMap(): Map<string, ViewEditorState> {
    const stateMap = new Map<string, ViewEditorState>();

    const state1 = ViewEditorState.create(TestDataService.employeesViewState1);
    const state2 = ViewEditorState.create(TestDataService.employeesViewState2);
    const state3 = ViewEditorState.create(TestDataService.productsViewState1);
    const state4 = ViewEditorState.create(TestDataService.productsViewState2);
    const state5 = ViewEditorState.create(TestDataService.productsViewState3);

    stateMap.set(state1.getId(), state1);
    stateMap.set(state2.getId(), state2);
    stateMap.set(state3.getId(), state3);
    stateMap.set(state4.getId(), state4);
    stateMap.set(state5.getId(), state5);

    return stateMap;
  }

}
