import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditConnectionComponent } from './edit-connection.component';
import {RouterTestingModule} from '@angular/router/testing';
import {BreadcrumbsComponent} from '@core/breadcrumbs/breadcrumbs.component';
import {BreadcrumbComponent} from '@core/breadcrumbs/breadcrumb/breadcrumb.component';

describe('EditConnectionComponent', () => {
  let component: EditConnectionComponent;
  let fixture: ComponentFixture<EditConnectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ RouterTestingModule ],
      declarations: [ EditConnectionComponent, BreadcrumbsComponent, BreadcrumbComponent ]
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
