import {inject, TestBed} from "@angular/core/testing";

import {HttpModule} from "@angular/http";
import {ConnectionService} from "./connection.service";

describe("ConnectionService", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpModule ],
      providers: [ConnectionService]
    });
  });

  it("should be created", inject([ConnectionService], (service: ConnectionService) => {
    expect(service).toBeTruthy();
  }));
});
