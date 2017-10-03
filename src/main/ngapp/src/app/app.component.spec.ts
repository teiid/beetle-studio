import { TestBed, async } from '@angular/core/testing';

import { AppComponent } from './app.component';
import { RouterTestingModule } from "@angular/router/testing";
import { CoreModule } from "@core/core.module";

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ CoreModule, RouterTestingModule ],
      declarations: [
        AppComponent
      ],
    }).compileComponents();
  }));

  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));

});
