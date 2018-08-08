import { ViewEditorState } from "@dataservices/shared/view-editor-state.model";
import { CompositionType } from "@dataservices/shared/composition-type.enum";
import { CompositionOperator } from "@dataservices/shared/composition-operator.enum";

describe("ViewEditorState", () => {
  let viewEditorState: ViewEditorState;

  beforeEach(() => {
    viewEditorState = null;
  });

  it("should create", () => {
    console.log("========== [ViewEditorState] should create");
    viewEditorState = ViewEditorState.create(
      {
        "keng__baseUri": "http://das-beetle-studio.192.168.42.154.nip.io/vdb-builder/v1/",
        "id": "virt1vdb.view",
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
            "viewName": "viewDefnName",
            "keng__description": "viewDescription",
            "isComplete": true,
            "sourcePaths":
              [
                "sourcePath1",
                "sourcePath2"
              ],
            "compositions":
              [
                {
                  "name": "compositionName",
                  "leftSourcePath": "sourcePath1",
                  "rightSourcePath": "sourcePath2",
                  "leftCriteriaColumn": "leftCriteriaCol",
                  "rightCriteriaColumn": "rightCriteriaCol",
                  "type": "INNER_JOIN",
                  "operator": "EQ"
                }
              ]
          }
      }
    );

    expect(viewEditorState.getId()).toEqual("virt1vdb.view");

    // Check undoable 1
    expect(viewEditorState.getUndoables().length).toEqual(5);
    const undoable1 = viewEditorState.getUndoables()[0];
    const undoCmd1 = undoable1.undoCommand;
    const redoCmd1 = undoable1.redoCommand;
    expect(undoCmd1.id).toEqual("UpdateViewNameCommand");
    expect(undoCmd1.getArg("oldName")).toEqual("v");
    expect(redoCmd1.id).toEqual("UpdateViewNameCommand");
    expect(redoCmd1.getArg("newName")).toEqual("v");

    // Check undoable 5
    const undoable5 = viewEditorState.getUndoables()[4];
    const undoCmd5 = undoable5.undoCommand;
    const redoCmd5 = undoable5.redoCommand;
    expect(undoCmd5.id).toEqual("RemoveCompositionCommand");
    expect(undoCmd5.getArg("ObjectId")).toEqual("AddCompositionCommand1532727472875");
    expect(redoCmd5.id).toEqual("AddCompositionCommand");
    expect(redoCmd5.getArg("ObjectId")).toEqual("AddCompositionCommand1532727472875");

    // Check the View Definition
    const viewDefn = viewEditorState.getViewDefinition();
    expect(viewDefn).toBeDefined();

    expect(viewDefn.getName()).toEqual("viewDefnName");
    expect(viewDefn.getDescription()).toEqual("viewDescription");
    expect(viewDefn.complete).toEqual(true);
    expect(viewDefn.getSourcePaths().length).toEqual(2);
    expect(viewDefn.getSourcePaths()[0]).toEqual("sourcePath1");
    expect(viewDefn.getSourcePaths()[1]).toEqual("sourcePath2");
    expect(viewDefn.getCompositions().length).toEqual(1);
    expect(viewDefn.getCompositions()[0].getName()).toEqual("compositionName");
    expect(viewDefn.getCompositions()[0].getLeftSourcePath()).toEqual("sourcePath1");
    expect(viewDefn.getCompositions()[0].getRightSourcePath()).toEqual("sourcePath2");
    expect(viewDefn.getCompositions()[0].getLeftCriteriaColumn()).toEqual("leftCriteriaCol");
    expect(viewDefn.getCompositions()[0].getRightCriteriaColumn()).toEqual("rightCriteriaCol");
    expect(viewDefn.getCompositions()[0].getType()).toEqual(CompositionType.INNER_JOIN);
    expect(viewDefn.getCompositions()[0].getOperator()).toEqual(CompositionOperator.EQ);
  });

});
