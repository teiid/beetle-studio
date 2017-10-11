import { ActivityService } from "@activities/shared/activity.service";
import { inject, TestBed } from "@angular/core/testing";
import { HttpModule } from "@angular/http";
import { LoggerService } from "@core/logger.service";

describe("ActivityService", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpModule ],
      providers: [ActivityService, LoggerService]
    });
  });

  it("should be created", inject([ActivityService, LoggerService],
                                            (service: ActivityService, logger: LoggerService) => {
    expect(service).toBeTruthy();
  }));
});
