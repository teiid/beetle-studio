import { inject, TestBed } from "@angular/core/testing";
import { HttpModule } from "@angular/http";
import { ApiService } from "@core/api.service";
import { LoggerService } from "@core/logger.service";

describe("ApiService", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpModule],
      providers: [ApiService, LoggerService]
    });
  });

  it("should be created", inject([ApiService, LoggerService],
                                            (service: ApiService, logger: LoggerService) => {
    expect(service).toBeTruthy();
  }));
});
