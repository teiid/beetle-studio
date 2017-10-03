import { TestBed, inject } from '@angular/core/testing';
import { HttpModule } from "@angular/http";

import { ActivityService } from './activity.service';

describe('ActivityService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpModule ],
      providers: [ActivityService]
    });
  });

  it('should be created', inject([ActivityService], (service: ActivityService) => {
    expect(service).toBeTruthy();
  }));
});
