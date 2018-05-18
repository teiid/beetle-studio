import { ServiceCatalogSource } from "@connections/shared/service-catalog-source.model";

describe("ServiceCatalogSource", () => {
  let serviceCatSrc: ServiceCatalogSource;

  beforeEach(() => {
    serviceCatSrc = null;
  });

  it("should create", () => {
    console.log("========== [ServiceCatalogSource] should create");
    serviceCatSrc = ServiceCatalogSource.create(
      {
        "keng__baseUri": "http://das-beetle-studio.192.168.42.154.nip.io/vdb-builder/v1/",
        "keng__id": "mongodb-persistent-762zc",
        "keng__dataPath": "/tko:komodo/tko:workspace/admin/2018-05-17_20-35-29-543",
        "keng__kType": "ServiceCatalogDataSource",
        "keng__hasChildren": false,
        "sc__name": "mongodb-persistent-762zc",
        "sc__type": "mongodb",
        "sc__bound": true,
        "sc__translator": "mongodb",
        "keng___links": [
          {
            "rel": "self",
            "href": "http://das-beetle-studio.192.168.42.154.nip.io/vdb-builder/v1/metadata/connections/mongodb-persistent-762zc"
          },
          {
            "rel": "parent",
            "href": "http://das-beetle-studio.192.168.42.154.nip.io/vdb-builder/v1/metadata/connections"
          },
          {
            "rel": "children",
            "href": "http://das-beetle-studio.192.168.42.1154.nip.ip/xxx"
          }
        ]
      }
    );

    expect(serviceCatSrc.getName()).toEqual("mongodb-persistent-762zc");
    expect(serviceCatSrc.getType()).toEqual("mongodb");
    expect(serviceCatSrc.isBound()).toEqual(true);
  });

});
