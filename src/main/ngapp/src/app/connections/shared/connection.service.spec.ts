import {TestBed, inject} from '@angular/core/testing';

import {ConnectionService} from './connection.service';
import {HttpModule} from "@angular/http";

describe('ConnectionService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpModule ],
      providers: [ConnectionService]
    });
  });

  it('should be created', inject([ConnectionService], (service: ConnectionService) => {
    expect(service).toBeTruthy();
  }));
});
