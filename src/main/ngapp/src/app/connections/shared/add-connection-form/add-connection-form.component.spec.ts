import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormsModule } from '@angular/forms';
import { AddConnectionFormComponent } from './add-connection-form.component';
import {RouterTestingModule} from '@angular/router/testing';

describe('AddConnectionFormComponent', () => {
  let component: AddConnectionFormComponent;
  let fixture: ComponentFixture<AddConnectionFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, RouterTestingModule ],
      declarations: [ AddConnectionFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddConnectionFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
