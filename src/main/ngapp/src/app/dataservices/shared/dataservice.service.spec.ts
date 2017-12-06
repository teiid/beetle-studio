import { inject, TestBed } from "@angular/core/testing";
import { HttpModule } from "@angular/http";
import { AppSettingsService } from "@core/app-settings.service";
import { LoggerService } from "@core/logger.service";
import { DataserviceService } from "@dataservices/shared/dataservice.service";
import { MockVdbService } from "@dataservices/shared/mock-vdb.service";
import { NotifierService } from "@dataservices/shared/notifier.service";
import { VdbService } from "@dataservices/shared/vdb.service";

describe("DataserviceService", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpModule ],
      providers: [
        DataserviceService,
        AppSettingsService,
        LoggerService,
        NotifierService,
        { provide: VdbService, useClass: MockVdbService }
      ]
    });
  });

  it("should be created", inject([DataserviceService, AppSettingsService, LoggerService],
                                            ( service: DataserviceService ) => {
    expect(service).toBeTruthy();
  }));
});
