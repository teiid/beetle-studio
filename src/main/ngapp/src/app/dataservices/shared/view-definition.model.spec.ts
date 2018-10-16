import { ViewDefinition } from "@dataservices/shared/view-definition.model";
import { CompositionOperator } from "@dataservices/shared/composition-operator.enum";
import { CompositionType } from "@dataservices/shared/composition-type.enum";

describe("ViewDefinition", () => {
  let viewDefn1: ViewDefinition;
  let viewDefn2: ViewDefinition;

  beforeEach(() => {
    viewDefn1 = null;
    viewDefn2 = null;
  });

  it("should create", () => {
    console.log("========== [ViewDefinition] should create");
    viewDefn1 = ViewDefinition.create(
      {
        "viewName": "viewDefnName",
        "keng__description": "viewDescription",
        "isComplete": true,
        "sourcePaths":
          [
            "connection=pgConn/schema=public/table=account",
            "connection=pgConn/schema=public/table=holdings"
          ],
        "compositions":
          [
            {
              "name": "compositionName",
              "leftSourcePath": "connection=pgConn/schema=public/table=account",
              "rightSourcePath": "connection=pgConn/schema=public/table=holdings",
              "leftCriteriaColumn": "leftCriteriaCol",
              "rightCriteriaColumn": "rightCriteriaCol",
              "type": "INNER_JOIN",
              "operator": "EQ"
            }
          ],
        "projectedColumns": [
          {
            "name": "ALL",
            "type": "ALL",
            "selected": true
          }
        ]
      }
    );

    viewDefn2 = ViewDefinition.create(
      {
        "viewName": "viewDefnName",
        "keng__description": "viewDescription",
        "isComplete": true,
        "sourcePaths":
          [
            "connection=pgConn/schema=public/table=account",
            "connection=pgConn/schema=public/table=holdings"
          ],
        "compositions":
          [
            {
              "name": "compositionName",
              "leftSourcePath": "connection=pgConn/schema=public/table=account",
              "rightSourcePath": "connection=pgConn/schema=public/table=holdings",
              "leftCriteriaColumn": "leftCriteriaCol",
              "rightCriteriaColumn": "rightCriteriaCol",
              "type": "INNER_JOIN",
              "operator": "EQ"
            }
          ],
        "projectedColumns": [
          {
            "name": "col1",
            "type": "string",
            "selected": true
          },
          {
            "name": "col2",
            "type": "integer",
            "selected": false
          },
          {
            "name": "col3",
            "type": "string",
            "selected": true
          }
        ]
      }
    );

    expect(viewDefn1.getName()).toEqual("viewDefnName");
    expect(viewDefn1.getDescription()).toEqual("viewDescription");
    expect(viewDefn1.complete).toEqual(true);
    expect(viewDefn1.getSourcePaths().length).toEqual(2);
    expect(viewDefn1.getSourcePaths()[0]).toEqual("connection=pgConn/schema=public/table=account");
    expect(viewDefn1.getSourcePaths()[1]).toEqual("connection=pgConn/schema=public/table=holdings");
    expect(viewDefn1.getCompositions().length).toEqual(1);
    expect(viewDefn1.getCompositions()[0].getName()).toEqual("compositionName");
    expect(viewDefn1.getCompositions()[0].getLeftSourcePath()).toEqual("connection=pgConn/schema=public/table=account");
    expect(viewDefn1.getCompositions()[0].getRightSourcePath()).toEqual("connection=pgConn/schema=public/table=holdings");
    expect(viewDefn1.getCompositions()[0].getLeftCriteriaColumn()).toEqual("leftCriteriaCol");
    expect(viewDefn1.getCompositions()[0].getRightCriteriaColumn()).toEqual("rightCriteriaCol");
    expect(viewDefn1.getCompositions()[0].getType()).toEqual(CompositionType.INNER_JOIN);
    expect(viewDefn1.getCompositions()[0].getOperator()).toEqual(CompositionOperator.EQ);
    expect(viewDefn1.getProjectedColumns().length).toEqual(1);
    expect(viewDefn1.getProjectedColumns()[0].getName()).toEqual("ALL");
    expect(viewDefn1.getProjectedColumns()[0].getType()).toEqual("ALL");
    expect(viewDefn1.getProjectedColumns()[0].selected).toEqual(true);
    expect(viewDefn1.getPreviewSql()).toEqual("SELECT * FROM pgconnschemamodel.account AS A INNER JOIN pgconnschemamodel.holdings AS B ON A.leftCriteriaCol = B.rightCriteriaCol;");

    expect(viewDefn2.getName()).toEqual("viewDefnName");
    expect(viewDefn2.getDescription()).toEqual("viewDescription");
    expect(viewDefn2.complete).toEqual(true);
    expect(viewDefn2.getSourcePaths().length).toEqual(2);
    expect(viewDefn2.getSourcePaths()[0]).toEqual("connection=pgConn/schema=public/table=account");
    expect(viewDefn2.getSourcePaths()[1]).toEqual("connection=pgConn/schema=public/table=holdings");
    expect(viewDefn2.getCompositions().length).toEqual(1);
    expect(viewDefn2.getCompositions()[0].getName()).toEqual("compositionName");
    expect(viewDefn2.getCompositions()[0].getLeftSourcePath()).toEqual("connection=pgConn/schema=public/table=account");
    expect(viewDefn2.getCompositions()[0].getRightSourcePath()).toEqual("connection=pgConn/schema=public/table=holdings");
    expect(viewDefn2.getCompositions()[0].getLeftCriteriaColumn()).toEqual("leftCriteriaCol");
    expect(viewDefn2.getCompositions()[0].getRightCriteriaColumn()).toEqual("rightCriteriaCol");
    expect(viewDefn2.getCompositions()[0].getType()).toEqual(CompositionType.INNER_JOIN);
    expect(viewDefn2.getCompositions()[0].getOperator()).toEqual(CompositionOperator.EQ);
    expect(viewDefn2.getProjectedColumns().length).toEqual(3);
    expect(viewDefn2.getProjectedColumns()[0].getName()).toEqual("col1");
    expect(viewDefn2.getProjectedColumns()[0].getType()).toEqual("string");
    expect(viewDefn2.getProjectedColumns()[0].selected).toEqual(true);
    expect(viewDefn2.getProjectedColumns()[1].getName()).toEqual("col2");
    expect(viewDefn2.getProjectedColumns()[1].getType()).toEqual("integer");
    expect(viewDefn2.getProjectedColumns()[1].selected).toEqual(false);
    expect(viewDefn2.getProjectedColumns()[2].getName()).toEqual("col3");
    expect(viewDefn2.getProjectedColumns()[2].getType()).toEqual("string");
    expect(viewDefn2.getProjectedColumns()[2].selected).toEqual(true);
    expect(viewDefn2.getPreviewSql()).toEqual("SELECT col1, col3 FROM pgconnschemamodel.account AS A INNER JOIN pgconnschemamodel.holdings AS B ON A.leftCriteriaCol = B.rightCriteriaCol;");

  });

});
