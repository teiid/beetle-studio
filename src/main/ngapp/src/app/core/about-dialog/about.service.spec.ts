import { TestBed, inject } from '@angular/core/testing';
import { HttpModule } from "@angular/http";
import { AboutService } from '@core/about-dialog/about.service';
import { AppSettingsService } from "@core/app-settings.service";
import { LoggerService } from "@core/logger.service";

describe('AboutService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpModule ],
      providers: [ AboutService, AppSettingsService, LoggerService ]
    });
  });

  it('should be created',
      inject([ AboutService, AppSettingsService, LoggerService ],
     ( service: AboutService ) => {
    expect( service ).toBeTruthy();
  }));
});
