import {async, ComponentFixture, TestBed} from "@angular/core/testing";
import {FormsModule} from "@angular/forms";
import {HttpModule} from "@angular/http";
import {RouterTestingModule} from "@angular/router/testing";
import {ConnectionsCardsComponent} from "@connections/connections-cards/connections-cards.component";
import {ConnectionsListComponent} from "@connections/connections-list/connections-list.component";
import {ConnectionsComponent} from "@connections/connections.component";
import {CoreModule} from "@core/core.module";
import {SharedModule} from "@shared/shared.module";
import {ModalModule} from "ngx-bootstrap";

describe("ConnectionsComponent", () => {
  let component: ConnectionsComponent;
  let fixture: ComponentFixture<ConnectionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ CoreModule, FormsModule, HttpModule, ModalModule.forRoot(), RouterTestingModule, SharedModule ],
      declarations: [ ConnectionsComponent, ConnectionsListComponent, ConnectionsCardsComponent ]
    })
    .compileComponents().then(() => {
      // nothing to do
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConnectionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should be created", () => {
    expect(component).toBeTruthy();
  });
});
