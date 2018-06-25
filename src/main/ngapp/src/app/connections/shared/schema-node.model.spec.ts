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
        "path": "collection=restaurants",
        "connectionName": "conn1",
        "queryable": true,
        "children": [
        ],
      });

    expect(schemaNode.getName()).toEqual("restaurants");
    expect(schemaNode.getType()).toEqual("collection");
    expect(schemaNode.getPath()).toEqual("collection=restaurants");
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
        "path": "collection=restaurants",
        "connectionName": "conn1",
        "queryable": true,
        "children": [
          {
            "name": "grades",
            "type": "embedded",
            "path": "collection=restaurants/embedded=grades",
            "connectionName": "conn1",
            "queryable": true,
            "children": []
          },
          {
            "name": "address",
            "type": "embedded",
            "path": "collection=restaurants/embedded=address",
            "connectionName": "conn1",
            "queryable": true,
            "children": []
          },
        ],
      });

    expect(schemaNode.getName()).toEqual("restaurants");
    expect(schemaNode.getType()).toEqual("collection");
    expect(schemaNode.getPath()).toEqual("collection=restaurants");
    expect(schemaNode.getConnectionName()).toEqual("conn1");
    expect(schemaNode.isQueryable()).toEqual(true);
    expect(schemaNode.getMaxLevels()).toEqual(2);
    expect(schemaNode.getChildren().length).toEqual(2);

    expect(schemaNode.getChildren()[0].getName()).toEqual("grades");
    expect(schemaNode.getChildren()[0].getType()).toEqual("embedded");
    expect(schemaNode.getChildren()[0].getPath()).toEqual("collection=restaurants/embedded=grades");
    expect(schemaNode.getChildren()[0].getConnectionName()).toEqual("conn1");
    expect(schemaNode.getChildren()[0].isQueryable()).toEqual(true);
    expect(schemaNode.getChildren()[0].getMaxLevels()).toEqual(1);
    expect(schemaNode.getChildren()[0].getChildren().length).toEqual(0);

    expect(schemaNode.getChildren()[1].getName()).toEqual("address");
    expect(schemaNode.getChildren()[1].getType()).toEqual("embedded");
    expect(schemaNode.getChildren()[1].getPath()).toEqual("collection=restaurants/embedded=address");
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
        "path": "catalog=myCatalog",
        "connectionName": "conn1",
        "queryable": false,
        "children": [
          {
            "name": "mySchema1",
            "type": "schema",
            "path": "catalog=myCatalog/schema=mySchema1",
            "connectionName": "conn1",
            "queryable": false,
            "children": [
              {
                "name": "myTable1",
                "type": "table",
                "path": "catalog=myCatalog/schema=mySchema1/table=myTable1",
                "connectionName": "conn1",
                "queryable": true,
                "children": []
              },
              {
                "name": "myTable2",
                "type": "table",
                "path": "catalog=myCatalog/schema=mySchema1/table=myTable2",
                "connectionName": "conn1",
                "queryable": true,
                "children": []
              }
            ]
          },
          {
            "name": "mySchema2",
            "type": "schema",
            "path": "catalog=myCatalog/schema=mySchema2",
            "connectionName": "conn1",
            "queryable": false,
            "children": [
              {
                "name": "myTableA",
                "type": "table",
                "path": "catalog=myCatalog/schema=mySchema2/table=myTableA",
                "connectionName": "conn1",
                "queryable": true,
                "children": []
              },
              {
                "name": "myTableB",
                "type": "table",
                "path": "catalog=myCatalog/schema=mySchema2/table=myTableB",
                "connectionName": "conn1",
                "queryable": true,
                "children": []
              },
              {
                "name": "myTableC",
                "type": "table",
                "path": "catalog=myCatalog/schema=mySchema2/table=myTableC",
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
    expect(schemaNode.getPath()).toEqual("catalog=myCatalog");
    expect(schemaNode.getConnectionName()).toEqual("conn1");
    expect(schemaNode.isQueryable()).toEqual(false);
    expect(schemaNode.getMaxLevels()).toEqual(3);
    expect(schemaNode.getChildren().length).toEqual(2);

    // Root Child 1 (mySchema1)
    const schema1: SchemaNode = schemaNode.getChildren()[0];
    expect(schema1.getName()).toEqual("mySchema1");
    expect(schema1.getType()).toEqual("schema");
    expect(schema1.getPath()).toEqual("catalog=myCatalog/schema=mySchema1");
    expect(schema1.getConnectionName()).toEqual("conn1");
    expect(schema1.isQueryable()).toEqual(false);
    expect(schema1.getMaxLevels()).toEqual(2);
    expect(schema1.getChildren().length).toEqual(2);

    // Root Child 2 (mySchema2)
    const schema2: SchemaNode = schemaNode.getChildren()[1];
    expect(schema2.getName()).toEqual("mySchema2");
    expect(schema2.getType()).toEqual("schema");
    expect(schema2.getPath()).toEqual("catalog=myCatalog/schema=mySchema2");
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
    expect(tableA.getPath()).toEqual("catalog=myCatalog/schema=mySchema2/table=myTableA");
    expect(tableA.getConnectionName()).toEqual("conn1");
    expect(tableA.isQueryable()).toEqual(true);
    expect(tableA.getMaxLevels()).toEqual(1);
    expect(tableA.getChildren().length).toEqual(0);

    expect(tableB.getName()).toEqual("myTableB");
    expect(tableB.getType()).toEqual("table");
    expect(tableB.getPath()).toEqual("catalog=myCatalog/schema=mySchema2/table=myTableB");
    expect(tableB.getConnectionName()).toEqual("conn1");
    expect(tableB.isQueryable()).toEqual(true);
    expect(tableB.getMaxLevels()).toEqual(1);
    expect(tableB.getChildren().length).toEqual(0);

    expect(tableC.getName()).toEqual("myTableC");
    expect(tableC.getType()).toEqual("table");
    expect(tableC.getPath()).toEqual("catalog=myCatalog/schema=mySchema2/table=myTableC");
    expect(tableC.getConnectionName()).toEqual("conn1");
    expect(tableC.isQueryable()).toEqual(true);
    expect(tableC.getMaxLevels()).toEqual(1);
    expect(tableC.getChildren().length).toEqual(0);
  });

});
