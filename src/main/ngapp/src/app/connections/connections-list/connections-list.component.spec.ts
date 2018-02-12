import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { ConnectionDetailsComponent } from "@connections/connections-list/connection-details.component";
import { ConnectionsListComponent } from "@connections/connections-list/connections-list.component";
import { PatternFlyNgModule } from "patternfly-ng";

describe("ConnectionsListComponent", () => {
  let component: ConnectionsListComponent;
  let fixture: ComponentFixture<ConnectionsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ PatternFlyNgModule, RouterTestingModule ],
      declarations: [ ConnectionDetailsComponent, ConnectionsListComponent ]
    })
    .compileComponents().then(() => {
      // nothing to do
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConnectionsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should be created", () => {
    console.log("========== [ConnectionsListComponent] should be created");
    expect(component).toBeTruthy();
  });
});
