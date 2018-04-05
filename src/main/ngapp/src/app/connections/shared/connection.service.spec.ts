import { inject, TestBed } from "@angular/core/testing";
import { HttpModule } from "@angular/http";
import { ConnectionService } from "@connections/shared/connection.service";
import { AppSettingsService } from "@core/app-settings.service";
import { LoggerService } from "@core/logger.service";
import { NotifierService } from "@dataservices/shared/notifier.service";
import { VdbService } from "@dataservices/shared/vdb.service";

describe("ConnectionService", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpModule ],
      providers: [AppSettingsService, ConnectionService, LoggerService, NotifierService, VdbService]
    });
  });

  it("should be created", inject([ConnectionService, AppSettingsService, LoggerService],
                                            (service: ConnectionService ) => {
    expect(service).toBeTruthy();
  }));
});
