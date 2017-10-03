import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ConnectionsComponent} from './connections.component';
import {FormsModule} from "@angular/forms";
import {RouterTestingModule} from "@angular/router/testing";
import {ConnectionsListComponent} from "@connections/connections-list/connections-list.component";
import {ConnectionsCardsComponent} from "@connections/connections-cards/connections-cards.component";
import {ModalModule} from "ngx-bootstrap";
import {HttpModule} from "@angular/http";
import {CoreModule} from "@core/core.module";
import {SharedModule} from "@shared/shared.module";

describe('ConnectionsComponent', () => {
  let component: ConnectionsComponent;
  let fixture: ComponentFixture<ConnectionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ CoreModule, FormsModule, HttpModule, ModalModule.forRoot(), RouterTestingModule, SharedModule ],
      declarations: [ ConnectionsComponent, ConnectionsListComponent, ConnectionsCardsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConnectionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
