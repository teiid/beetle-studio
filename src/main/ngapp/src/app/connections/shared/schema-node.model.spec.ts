import { SchemaNode } from "@connections/shared/schema-node.model";

describe("SchemaNode", () => {
  let schemaNode: SchemaNode;

  beforeEach(() => {
    schemaNode = null;
  });

  it("should create, root only", () => {
    console.log("========== [SchemaNode] should create, root only");
    schemaNode = SchemaNode.create(
      {
        "name": "restaurants",
        "type": "collection",
        "connectionName": "conn1",
        "queryable": true,
        "children": [
        ],
      });

    expect(schemaNode.getName()).toEqual("restaurants");
    expect(schemaNode.getType()).toEqual("collection");
    expect(schemaNode.getConnectionName()).toEqual("conn1");
    expect(schemaNode.isQueryable()).toEqual(true);
    expect(schemaNode.getMaxLevels()).toEqual(1);
  });

  it("should create, root with 2 children", () => {
    console.log("========== [SchemaNode] should create, root with 2 children");
    schemaNode = SchemaNode.create(
      {
        "name": "restaurants",
        "type": "collection",
        "connectionName": "conn1",
        "queryable": true,
        "children": [
          {
            "name": "grades",
            "type": "embedded",
            "connectionName": "conn1",
            "queryable": true,
            "children": []
          },
          {
            "name": "address",
            "type": "embedded",
            "connectionName": "conn1",
            "queryable": true,
            "children": []
          },
        ],
      });

    expect(schemaNode.getName()).toEqual("restaurants");
    expect(schemaNode.getType()).toEqual("collection");
    expect(schemaNode.getConnectionName()).toEqual("conn1");
    expect(schemaNode.isQueryable()).toEqual(true);
    expect(schemaNode.getMaxLevels()).toEqual(2);
    expect(schemaNode.getChildren().length).toEqual(2);

    expect(schemaNode.getChildren()[0].getName()).toEqual("grades");
    expect(schemaNode.getChildren()[0].getType()).toEqual("embedded");
    expect(schemaNode.getChildren()[0].getConnectionName()).toEqual("conn1");
    expect(schemaNode.getChildren()[0].isQueryable()).toEqual(true);
    expect(schemaNode.getChildren()[0].getMaxLevels()).toEqual(1);
    expect(schemaNode.getChildren()[0].getChildren().length).toEqual(0);

    expect(schemaNode.getChildren()[1].getName()).toEqual("address");
    expect(schemaNode.getChildren()[1].getType()).toEqual("embedded");
    expect(schemaNode.getChildren()[1].getConnectionName()).toEqual("conn1");
    expect(schemaNode.getChildren()[1].isQueryable()).toEqual(true);
    expect(schemaNode.getChildren()[1].getMaxLevels()).toEqual(1);
    expect(schemaNode.getChildren()[1].getChildren().length).toEqual(0);
  });

  it("should create, root with 3 levels", () => {
    console.log("========== [SchemaNode] should create, root with 3 levels");
    schemaNode = SchemaNode.create(
      {
        "name": "myCatalog",
        "type": "catalog",
        "connectionName": "conn1",
        "queryable": false,
        "children": [
          {
            "name": "mySchema1",
            "type": "schema",
            "connectionName": "conn1",
            "queryable": false,
            "children": [
              {
                "name": "myTable1",
                "type": "table",
                "connectionName": "conn1",
                "queryable": true,
                "children": []
              },
              {
                "name": "myTable2",
                "type": "table",
                "connectionName": "conn1",
                "queryable": true,
                "children": []
              }
            ]
          },
          {
            "name": "mySchema2",
            "type": "schema",
            "connectionName": "conn1",
            "queryable": false,
            "children": [
              {
                "name": "myTableA",
                "type": "table",
                "connectionName": "conn1",
                "queryable": true,
                "children": []
              },
              {
                "name": "myTableB",
                "type": "table",
                "connectionName": "conn1",
                "queryable": true,
                "children": []
              },
              {
                "name": "myTableC",
                "type": "table",
                "connectionName": "conn1",
                "queryable": true,
                "children": []
              }
            ]
          },
        ],
      });

    // Root Node (myCatalog)
    expect(schemaNode.getName()).toEqual("myCatalog");
    expect(schemaNode.getType()).toEqual("catalog");
    expect(schemaNode.getConnectionName()).toEqual("conn1");
    expect(schemaNode.isQueryable()).toEqual(false);
    expect(schemaNode.getMaxLevels()).toEqual(3);
    expect(schemaNode.getChildren().length).toEqual(2);

    // Root Child 1 (mySchema1)
    const schema1: SchemaNode = schemaNode.getChildren()[0];
    expect(schema1.getName()).toEqual("mySchema1");
    expect(schema1.getType()).toEqual("schema");
    expect(schema1.getConnectionName()).toEqual("conn1");
    expect(schema1.isQueryable()).toEqual(false);
    expect(schema1.getMaxLevels()).toEqual(2);
    expect(schema1.getChildren().length).toEqual(2);

    // Root Child 2 (mySchema2)
    const schema2: SchemaNode = schemaNode.getChildren()[1];
    expect(schema2.getName()).toEqual("mySchema2");
    expect(schema2.getType()).toEqual("schema");
    expect(schema2.getConnectionName()).toEqual("conn1");
    expect(schema2.isQueryable()).toEqual(false);
    expect(schema2.getMaxLevels()).toEqual(2);
    expect(schema2.getChildren().length).toEqual(3);

    // mySchema2 children
    const tableA: SchemaNode = schema2.getChildren()[0];
    const tableB: SchemaNode = schema2.getChildren()[1];
    const tableC: SchemaNode = schema2.getChildren()[2];

    expect(tableA.getName()).toEqual("myTableA");
    expect(tableA.getType()).toEqual("table");
    expect(tableA.getConnectionName()).toEqual("conn1");
    expect(tableA.isQueryable()).toEqual(true);
    expect(tableA.getMaxLevels()).toEqual(1);
    expect(tableA.getChildren().length).toEqual(0);

    expect(tableB.getName()).toEqual("myTableB");
    expect(tableB.getType()).toEqual("table");
    expect(tableB.getConnectionName()).toEqual("conn1");
    expect(tableB.isQueryable()).toEqual(true);
    expect(tableB.getMaxLevels()).toEqual(1);
    expect(tableB.getChildren().length).toEqual(0);

    expect(tableC.getName()).toEqual("myTableC");
    expect(tableC.getType()).toEqual("table");
    expect(tableC.getConnectionName()).toEqual("conn1");
    expect(tableC.isQueryable()).toEqual(true);
    expect(tableC.getMaxLevels()).toEqual(1);
    expect(tableC.getChildren().length).toEqual(0);
  });

});
