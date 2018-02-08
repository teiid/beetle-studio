import { ActivityService } from "@activities/shared/activity.service";
import { inject, TestBed } from "@angular/core/testing";
import { HttpModule } from "@angular/http";
import { AppSettingsService } from "@core/app-settings.service";
import { LoggerService } from "@core/logger.service";
import { MockAppSettingsService } from "@core/mock-app-settings.service";

describe("ActivityService", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpModule ],
      providers: [
        ActivityService,
        { provide: AppSettingsService, useClass: MockAppSettingsService },
        LoggerService]
    });
  });

  it("should be created", inject([ActivityService, AppSettingsService, LoggerService],
                                            (service: ActivityService, logger: LoggerService) => {
    console.log("========== [ActivityService] should be created");
    expect(service).toBeTruthy();
  }));
});
