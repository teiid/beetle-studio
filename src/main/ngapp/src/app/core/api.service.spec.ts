import { inject, TestBed } from "@angular/core/testing";
import { HttpModule } from "@angular/http";
import { ApiService } from "@core/api.service";
import { AppSettingsService } from "@core/app-settings.service";
import { LoggerService } from "@core/logger.service";

describe("ApiService", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpModule],
      providers: [AppSettingsService, LoggerService]
    });
  });

  it("should be created", inject([LoggerService],
                                            (service: MockService ) => {
    console.log("========== [ApiServiceComponent] should be created");
    expect(service).toBeTruthy();
  }));
});

class MockService extends ApiService {

  constructor( appSettings: AppSettingsService, logger: LoggerService ) {
    super( appSettings, logger );
  }

}
