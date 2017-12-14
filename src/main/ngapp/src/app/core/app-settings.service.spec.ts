import { inject, TestBed } from "@angular/core/testing";

import { AppSettingsService } from "./app-settings.service";

describe("AppSettingsService", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AppSettingsService]
    });
  });

  it("should be created", inject([AppSettingsService], (service: AppSettingsService) => {
    console.log("========== [AppSettingsServiceComponent] should be created");
    expect(service).toBeTruthy();
  }));
});
