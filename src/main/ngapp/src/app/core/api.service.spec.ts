import { inject, TestBed } from "@angular/core/testing";
import { HttpModule } from "@angular/http";
import { ApiService } from "@core/api.service";
import { LoggerService } from "@core/logger.service";

describe("ApiService", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpModule],
      providers: [LoggerService]
    });
  });

  it("should be created", inject([LoggerService],
                                            (service: MockService ) => {
    expect(service).toBeTruthy();
  }));
});

class MockService extends ApiService {

  constructor( logger: LoggerService ) {
    super( logger );
  }

}
