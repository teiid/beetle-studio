import { inject, TestBed } from "@angular/core/testing";
import { HttpModule } from "@angular/http";
import { AboutService } from "@core/about-dialog/about.service";
import { AppSettingsService } from "@core/app-settings.service";
import { LoggerService } from "@core/logger.service";
import { MockAppSettingsService } from "@core/mock-app-settings.service";

describe("AboutService", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpModule ],
      providers: [
        AboutService,
        { provide: AppSettingsService, useClass: MockAppSettingsService },
        LoggerService ]
    });
  });

  it("should be created",
      inject([ AboutService, AppSettingsService, LoggerService ],
     ( service: AboutService ) => {
        console.log("========== [AboutService] should be created");
        expect( service ).toBeTruthy();
  }));
});
