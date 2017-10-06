import { ActivityService } from "@activities/shared/activity.service";
import { inject, TestBed } from "@angular/core/testing";
import { HttpModule } from "@angular/http";

describe("ActivityService", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpModule ],
      providers: [ActivityService]
    });
  });

  it("should be created", inject([ActivityService], (service: ActivityService) => {
    expect(service).toBeTruthy();
  }));
});
