import { VdbStatus } from "@dataservices/shared/vdb-status.model";

describe("VdbStatus", () => {
  let vdbStatus: VdbStatus;

  beforeEach(() => {
    vdbStatus = null;
  });

  it("should create", () => {
    console.log("========== [VdbStatus] should create");
    vdbStatus = VdbStatus.create(
      {
        "name": "acctsVdb",
        "deployedName": "acctsVdb-vdb.xml",
        "version": "1",
        "active": true,
        "loading": false,
        "failed": false,
        "errors": []
      }
    );

    expect(vdbStatus.getName()).toEqual("acctsVdb");
    expect(vdbStatus.getDeployedName()).toEqual("acctsVdb-vdb.xml");
    expect(vdbStatus.getVersion()).toEqual("1");
    expect(vdbStatus.getErrors()).toEqual([]);
    expect(vdbStatus.isActive()).toEqual(true);
    expect(vdbStatus.isLoading()).toEqual(false);
    expect(vdbStatus.isFailed()).toEqual(false);
  });

});
