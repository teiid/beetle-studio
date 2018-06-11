import { View } from "@dataservices/shared/view.model";

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

});
