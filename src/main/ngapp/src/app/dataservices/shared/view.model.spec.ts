import { View } from "@dataservices/shared/view.model";
import { Composition } from "@dataservices/shared/composition.model";
import { CompositionType } from "@dataservices/shared/composition-type.enum";
import { CompositionOperator } from "@dataservices/shared/composition-operator.enum";

describe("View", () => {
  let view: View;

  beforeEach(() => {
    view = null;
  });

  it("should create", () => {
    console.log("========== [View] should create");
    view = View.create(
      {
        "keng__baseUri": "http://das-beetle-studio.192.168.42.57.nip.io/vdb-builder/v1/",
        "keng__id": "myView",
        "keng__dataPath": "/tko:komodo/tko:workspace/admin/virt1vdb/views/myView",
        "keng__kType": "View",
        "keng__hasChildren": true,
        "keng___links": [
          {
            "rel": "self",
            "href": "http://das-beetle-studio.192.168.42.57.nip.io/vdb-builder/v1/workspace/vdbs/virt1vdb/Models/views/Views/myView"
          },
          {
            "rel": "parent",
            "href": "http://das-beetle-studio.192.168.42.57.nip.io/vdb-builder/v1/workspace/vdbs/virt1vdb/Models/views"
          },
          {
            "rel": "children",
            "href": "http://das-beetle-studio.192.168.42.57.nip.io/vdb-builder/v1/workspace/search?parent=myView"
          }
        ]
      }
    );

    expect(view.getName()).toEqual("myView");
  });

  it("should test toJSON", () => {
    console.log("========== [View] should test toJSON");

    view = new View();
    view.setName("viewName");
    view.setDescription("viewDescription");
    view.addSourcePath("sourcePath1");
    view.addSourcePath("sourcePath2");

    const composition = new Composition();
    composition.setName("compositionName");
    composition.setLeftSourcePath("leftSourcePath");
    composition.setRightSourcePath("rightSourcePath");
    composition.setLeftCriteriaColumn("leftCriteriaCol");
    composition.setRightCriteriaColumn("rightCriteriaCol");
    composition.setType(CompositionType.INNER_JOIN);
    composition.setOperator(CompositionOperator.EQ);

    view.addComposition(composition);

    // Test the toJSON function
    const viewJson = view.toJSON();

    expect(viewJson['name']).toEqual("viewName");
    expect(viewJson['description']).toEqual("viewDescription");
    expect(viewJson['sourcePaths'].length).toEqual(2);
    expect(viewJson['sourcePaths'][0]).toEqual("sourcePath1");
    expect(viewJson['sourcePaths'][1]).toEqual("sourcePath2");
    expect(viewJson['compositions'].length).toEqual(1);
    expect(viewJson['compositions'][0].getName()).toEqual("compositionName");
    expect(viewJson['compositions'][0].getLeftSourcePath()).toEqual("leftSourcePath");
    expect(viewJson['compositions'][0].getRightSourcePath()).toEqual("rightSourcePath");
    expect(viewJson['compositions'][0].getLeftCriteriaColumn()).toEqual("leftCriteriaCol");
    expect(viewJson['compositions'][0].getRightCriteriaColumn()).toEqual("rightCriteriaCol");
    expect(viewJson['compositions'][0].getType()).toEqual("INNER_JOIN");
    expect(viewJson['compositions'][0].getOperator()).toEqual("EQ");

    const strView = JSON.stringify(viewJson);
    const test = "";
  });

});
