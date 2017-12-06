import { inject, TestBed } from "@angular/core/testing";
import { HttpModule } from "@angular/http";
import { AppSettingsService } from "@core/app-settings.service";
import { LoggerService } from "@core/logger.service";
import { NotifierService } from "@dataservices/shared/notifier.service";
import { VdbService } from "@dataservices/shared/vdb.service";

describe("VdbService", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpModule ],
      providers: [
        VdbService,
        AppSettingsService,
        NotifierService,
        LoggerService
      ]
    });
  });

  it("should be created", inject([VdbService, AppSettingsService, LoggerService],
                                            ( service: VdbService ) => {
    expect(service).toBeTruthy();
  }));
});
