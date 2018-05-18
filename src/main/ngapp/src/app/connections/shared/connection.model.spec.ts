import { Connection } from "@connections/shared/connection.model";

describe("Connection", () => {
  let connection: Connection;

  beforeEach(() => {
    connection = null;
  });

  it("should create", () => {
    console.log("========== [Connection] should create");
    connection = Connection.create(
      {
        "keng__baseUri": "http://das-beetle-studio.192.168.42.154.nip.io/vdb-builder/v1/",
        "keng__id": "PgConn",
        "keng__dataPath": "/tko:komodo/tko:workspace/admin/PgConn",
        "keng__kType": "Connection",
        "keng__hasChildren": true,
        "dv__jndiName": "java:/postgresql-persistent-jq7wz",
        "dv__driverName": "postgresql",
        "dv__type": true,
        "keng__properties": [
          {
            "name": "description",
            "value": "customer db on postgres"
          },
          {
            "name": "serviceCatalogSource",
            "value": "postgresql-persistent-jq7wz"
          }
        ],
        "keng___links": [
          {
            "rel": "self",
            "href": "http://das-beetle-studio.192.168.42.154.nip.io/vdb-builder/v1/workspace/connections/PgConn"
          },
          {
            "rel": "parent",
            "href": "http://das-beetle-studio.192.168.42.154.nip.io/vdb-builder/v1/workspace/connections"
          },
          {
            "rel": "children",
            "href": "http://das-beetle-studio.192.168.42.154.nip.io/vdb-builder/v1/workspace/search%2Fadmin%2FPgConn"
          }
        ]
      }
    );

    expect(connection.getId()).toEqual("PgConn");
    expect(connection.getDescription()).toEqual("customer db on postgres");
    expect(connection.getDriverName()).toEqual("postgresql");
    expect(connection.getJndiName()).toEqual("java:/postgresql-persistent-jq7wz");
    expect(connection.getServiceCatalogSourceName()).toEqual("postgresql-persistent-jq7wz");
    expect(connection.getDataPath()).toEqual("/tko:komodo/tko:workspace/admin/PgConn");
  });

});
