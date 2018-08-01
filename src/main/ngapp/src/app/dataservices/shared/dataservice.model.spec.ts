import { Dataservice } from "@dataservices/shared/dataservice.model";
import { DeploymentState } from "@dataservices/shared/deployment-state.enum";
import { PublishState } from "@dataservices/shared/publish-state.enum";

describe("Dataservice", () => {
  let dataservice: Dataservice;

  beforeEach(() => {
    dataservice = null;
  });

  it("should create", () => {
    console.log("========== [Dataservice] should create");
    dataservice = Dataservice.create(
      {
        "keng__baseUri": "http://das-beetle-studio.192.168.42.154.nip.io/vdb-builder/v1/",
        "keng__id": "mongoVirtualization",
        "keng__dataPath": "/tko:komodo/tko:workspace/admin/mongoVirtualization",
        "keng__kType": "Dataservice",
        "keng__hasChildren": true,
        "serviceVdbName": "mongovirtualizationvdb",
        "serviceVdbVersion": "1",
        "serviceViewModel": "views",
        "serviceViewDefinitions": [
          "addressView",
          "gradesView",
          "restaurantsView"
        ],
        "connections": 0,
        "drivers": 0,
        "keng___links": [
          {
            "rel": "self",
            "href": "http://das-beetle-studio.192.168.42.154.nip.io/vdb-builder/v1/workspace/dataservices/mongoVirtualization"
          },
          {
            "rel": "parent",
            "href": "http://das-beetle-studio.192.168.42.154.nip.io/vdb-builder/v1/workspace/dataservices"
          },
          {
            "rel": "children",
            "href": "http://das-beetle-studio.192.168.42.154.nip.io/vdb-builder/v1/workspace/xxx"
          },
          {
            "rel": "vdbs",
            "href": "http://das-beetle-studio.192.168.42.154.nip.io/vdb-builder/v1/workspace/yyy"
          },
          {
            "rel": "connections",
            "href": "http://das-beetle-studio.192.168.42.154.nip.io/vdb-builder/v1/workspace/zzz"
          }
        ]
      }
    );

    expect(dataservice.getId()).toEqual("mongoVirtualization");
    expect(dataservice.getServiceVdbName()).toEqual("mongovirtualizationvdb");
    expect(dataservice.getServiceVdbVersion()).toEqual("1");
    expect(dataservice.getServiceViewModel()).toEqual("views");
    expect(dataservice.getServiceViewNames().length).toEqual(3);
    expect(dataservice.getServiceDeploymentState()).toEqual(DeploymentState.LOADING);
    expect(dataservice.getServicePublishState()).toEqual(PublishState.NOT_PUBLISHED);
  });

});
