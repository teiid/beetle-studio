import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditConnectionComponent } from './edit-connection.component';

describe('EditConnectionComponent', () => {
  let component: EditConnectionComponent;
  let fixture: ComponentFixture<EditConnectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditConnectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditConnectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
