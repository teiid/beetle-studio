import { Column } from "@dataservices/shared/column.model";

describe("Column", () => {
  let column: Column;

  beforeEach(() => {
    column = null;
  });

  it("should create", () => {
    console.log("========== [Column] should create");
    column = Column.create(
      {
        "keng__baseUri": "http://das-beetle-studio.192.168.42.67.nip.io/vdb-builder/v1/",
        "keng__id": "account_id",
        "keng__dataPath": "/tko:komodo/tko:workspace/admin/pgConn/pgconnschemavdb/pgconnschemamodel/account/account_id",
        "keng__kType": "Column",
        "keng__hasChildren": false,
        "Datatype": "INTEGER",
        "keng___links": [
          {
            "rel": "self",
            "href": "http://das-beetle-studio.192.168.42.67.nip.io/vdb-builder/v1/workspace/blah/account/Columns/account_id"
          },
          {
            "rel": "parent",
            "href": "http://das-beetle-studio.192.168.42.67.nip.io/vdb-builder/v1/workspace/blah/account"
          },
          {
            "rel": "children",
            "href": "http://das-beetle-studio.192.168.42.67.nip.io/vdb-builder/v1/workspace/s"
          }
        ]
      }
    );

    expect(column.getName()).toEqual("account_id");
    expect(column.getDatatype()).toEqual("INTEGER");
  });

});
