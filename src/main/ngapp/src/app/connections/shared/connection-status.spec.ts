import { ConnectionStatus } from "@connections/shared/connection-status";

describe("ConnectionStatus", () => {
  let connectionStatus: ConnectionStatus;

  beforeEach(() => {
    connectionStatus = null;
  });

  it("should create", () => {
    console.log("========== [ConnectionStatus] should create");
    connectionStatus = ConnectionStatus.create(
      {
        "connectionName": "PgConn",
        "vdbState": "ACTIVE",
        "schemaState": "ACTIVE",
        "errors": [],
        "schemaModelName": "pgconnschemamodel",
        "schemaVdbName": "pgconnschemavdb",
        "vdbName": "pgconnbtlconn"
      }
    );

    expect(connectionStatus.getConnectionName()).toEqual("PgConn");
    expect(connectionStatus.getSchemaModelName()).toEqual("pgconnschemamodel");
    expect(connectionStatus.getSchemaVdbName()).toEqual("pgconnschemavdb");
    expect(connectionStatus.getServerVdbName()).toEqual("pgconnbtlconn");
    expect(connectionStatus.getErrors()).toEqual([]);
    expect(connectionStatus.isServerVdbActive()).toEqual(true);
    expect(connectionStatus.isServerVdbMissing()).toEqual(false);
    expect(connectionStatus.isServerVdbLoading()).toEqual(false);
    expect(connectionStatus.isServerVdbFailed()).toEqual(false);
  });

});
