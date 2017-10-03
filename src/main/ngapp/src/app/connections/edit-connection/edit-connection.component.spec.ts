import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {EditConnectionComponent} from './edit-connection.component';
import {RouterTestingModule} from '@angular/router/testing';
import {ConnectionService} from "@connections/shared/connection.service";
import {MockConnectionService} from "@connections/shared/mock-connection.service";
import {HttpModule} from "@angular/http";
import {CoreModule} from "@core/core.module";

describe('EditConnectionComponent', () => {
  let component: EditConnectionComponent;
  let fixture: ComponentFixture<EditConnectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ CoreModule, HttpModule, RouterTestingModule ],
      declarations: [ EditConnectionComponent ],
      providers: [
        { provide: ConnectionService, useClass: MockConnectionService },
      ]
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
