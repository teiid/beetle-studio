import { ConnectionSummary } from "@dataservices/shared/connection-summary.model";

describe("ConnectionSummary", () => {
  let connectionSummary: ConnectionSummary;

  beforeEach(() => {
    connectionSummary = null;
  });

  it("should create", () => {
    console.log("========== [ConnectionSummary] should create");
    connectionSummary = ConnectionSummary.create(
      {
        "connection": {
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
        },
        "status": {
          "connectionName": "PgConn",
          "vdbState": "ACTIVE",
          "schemaState": "ACTIVE",
          "errors": [],
          "schemaModelName": "pgconnschemamodel",
          "schemaVdbName": "pgconnschemavdb",
          "vdbName": "pgconnbtlconn"
        }
      }
    );

    expect(connectionSummary.getConnection().getId()).toEqual("PgConn");
    expect(connectionSummary.getConnection().getDescription()).toEqual("customer db on postgres");
    expect(connectionSummary.getConnection().getDriverName()).toEqual("postgresql");
    expect(connectionSummary.getConnection().getJndiName()).toEqual("java:/postgresql-persistent-jq7wz");
    expect(connectionSummary.getConnection().getServiceCatalogSourceName()).toEqual("postgresql-persistent-jq7wz");
    expect(connectionSummary.getConnection().getDataPath()).toEqual("/tko:komodo/tko:workspace/admin/PgConn");

    expect(connectionSummary.getStatus().getConnectionName()).toEqual("PgConn");
    expect(connectionSummary.getStatus().getSchemaModelName()).toEqual("pgconnschemamodel");
    expect(connectionSummary.getStatus().getSchemaVdbName()).toEqual("pgconnschemavdb");
    expect(connectionSummary.getStatus().getServerVdbName()).toEqual("pgconnbtlconn");
    expect(connectionSummary.getStatus().getErrors()).toEqual([]);
  });

});
