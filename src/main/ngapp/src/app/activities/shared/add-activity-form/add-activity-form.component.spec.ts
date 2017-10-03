import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';

import { AddActivityFormComponent } from './add-activity-form.component';
import { CoreModule } from '@core/core.module';

describe('AddActivityFormComponent', () => {
  let component: AddActivityFormComponent;
  let fixture: ComponentFixture<AddActivityFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ CoreModule, FormsModule, RouterTestingModule ],
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
