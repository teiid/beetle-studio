import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';

import {AddConnectionComponent} from './add-connection.component';
import {AddConnectionFormComponent} from "@connections/add-connection/add-connection-form/add-connection-form.component";
import {FormsModule} from "@angular/forms";
import {ConnectionService} from "@connections/shared/connection.service";
import {MockConnectionService} from "@connections/shared/mock-connection.service";
import {HttpModule} from "@angular/http";
import {CoreModule} from "@core/core.module";

describe('AddConnectionComponent', () => {
  let component: AddConnectionComponent;
  let fixture: ComponentFixture<AddConnectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ CoreModule, FormsModule, HttpModule, RouterTestingModule ],
      declarations: [ AddConnectionComponent, AddConnectionFormComponent ],
      providers: [
        { provide: ConnectionService, useClass: MockConnectionService },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddConnectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
