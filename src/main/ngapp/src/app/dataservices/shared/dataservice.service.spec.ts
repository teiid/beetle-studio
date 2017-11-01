import { inject, TestBed } from "@angular/core/testing";
import { HttpModule } from "@angular/http";
import { LoggerService } from "@core/logger.service";
import { DataserviceService } from "@dataservices/shared/dataservice.service";

describe("DataserviceService", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpModule ],
      providers: [DataserviceService, LoggerService]
    });
  });

  it("should be created", inject([DataserviceService, LoggerService],
                                            ( service: DataserviceService ) => {
    expect(service).toBeTruthy();
  }));
});
