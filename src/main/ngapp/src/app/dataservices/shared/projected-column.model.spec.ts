import { ProjectedColumn } from "@dataservices/shared/projected-column.model";

describe("ProjectedColumn", () => {
  let projCol1: ProjectedColumn;
  let projCol2: ProjectedColumn;

  beforeEach(() => {
    projCol1 = null;
    projCol2 = null;
  });

  it("should create", () => {
    console.log("========== [ProjectedColumn] should create");
    projCol1 = ProjectedColumn.create(
      {
        "name": "colName1",
        "type": "string",
        "selected": true
      }
    );
    projCol2 = ProjectedColumn.create(
      {
        "name": "colName2",
        "type": "integer",
        "selected": false
      }
    );

    expect(projCol1.getName()).toEqual("colName1");
    expect(projCol1.getType()).toEqual("string");
    expect(projCol1.selected).toEqual(true);

    expect(projCol2.getName()).toEqual("colName2");
    expect(projCol2.getType()).toEqual("integer");
    expect(projCol2.selected).toEqual(false);
  });

});
