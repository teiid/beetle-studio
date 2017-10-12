import { inject, TestBed } from "@angular/core/testing";
import { HttpModule } from "@angular/http";
import { ConnectionService } from "@connections/shared/connection.service";
import { LoggerService } from "@core/logger.service";

describe("ConnectionService", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpModule ],
      providers: [ConnectionService, LoggerService]
    });
  });

  it("should be created", inject([ConnectionService, LoggerService],
                                            (service: ConnectionService, logger: LoggerService ) => {
    expect(service).toBeTruthy();
  }));
});
