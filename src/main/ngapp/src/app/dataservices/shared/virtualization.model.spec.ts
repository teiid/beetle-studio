import { PublishState } from "@dataservices/shared/publish-state.enum";
import { Virtualization } from "@dataservices/shared/virtualization.model";

describe("Virtualization", () => {
  let virtualization: Virtualization;

  beforeEach(() => {
    virtualization = null;
  });

  it("should create", () => {
    console.log("========== [Virtualization] should create");
    virtualization = Virtualization.create(
      {
        "vdb_name": "acctsVdb",
        "build_name": "acctsVdb-build-1",
        "deployment_name": "acctsVdb-deployment-1",
        "build_status": "RUNNING", /* NOTFOUND, BUILDING, DEPLOYING, RUNNING, FAILED, CANCELLED */
        "build_status_message": "Accounts VDB build was successful",
        "namespace": "beetle-studio",
        "last_updated": "2018-03-29T17:02:51.181Z",
        "publishState": PublishState.PUBLISHED
      }
    );

    expect(virtualization.getVdbName()).toEqual("acctsVdb");
    expect(virtualization.getBuildName()).toEqual("acctsVdb-build-1");
    expect(virtualization.getDeploymentName()).toEqual("acctsVdb-deployment-1");
    expect(virtualization.getBuildStatus()).toEqual("RUNNING");
    expect(virtualization.getBuildStatusMsg()).toEqual("Accounts VDB build was successful");
    expect(virtualization.getNamespace()).toEqual("beetle-studio");
    expect(virtualization.getLastUpdated()).toEqual("2018-03-29T17:02:51.181Z");
    expect(virtualization.getPublishState()).toEqual(PublishState.PUBLISHED);
  });

});
