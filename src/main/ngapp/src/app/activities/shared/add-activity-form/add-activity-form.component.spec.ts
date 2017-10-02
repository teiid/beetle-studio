import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddActivityFormComponent } from './add-activity-form.component';

describe('AddActivityFormComponent', () => {
  let component: AddActivityFormComponent;
  let fixture: ComponentFixture<AddActivityFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddActivityFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddActivityFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
