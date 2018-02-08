import { inject, TestBed } from "@angular/core/testing";
import { HttpModule } from "@angular/http";
import { AppSettingsService } from "@core/app-settings.service";
import { LoggerService } from "@core/logger.service";
import { MockAppSettingsService } from "@core/mock-app-settings.service";
import { NotifierService } from "@dataservices/shared/notifier.service";
import { VdbService } from "@dataservices/shared/vdb.service";

describe("VdbService", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpModule ],
      providers: [
        VdbService,
        { provide: AppSettingsService, useClass: MockAppSettingsService },
        NotifierService,
        LoggerService
      ]
    });
  });

  it("should be created", inject([VdbService, AppSettingsService, LoggerService],
                                            ( service: VdbService ) => {
    console.log("========== [VdbService] should be created");
    expect(service).toBeTruthy();
  }));
});
