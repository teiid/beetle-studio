import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PageErrorComponent } from './page-error.component';
import { HttpModule } from "@angular/http";

describe('PageErrorComponent', () => {
  let component: PageErrorComponent;
  let fixture: ComponentFixture<PageErrorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ HttpModule ],
      declarations: [ PageErrorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PageErrorComponent);
    component = fixture.componentInstance;
    component.error = 'test';
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
