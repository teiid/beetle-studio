import { inject, TestBed } from "@angular/core/testing";
import { HttpModule } from "@angular/http";
import { LoggerService } from "@core/logger.service";
import { AppSettingsService } from "./app-settings.service";

describe("AppSettingsService", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpModule ],
      providers: [
        AppSettingsService,
        LoggerService
      ]
    });
  });

  it("should be created", inject([AppSettingsService], (service: AppSettingsService) => {
    console.log("========== [AppSettingsService] should be created");
    expect(service).toBeTruthy();
  }));
});
