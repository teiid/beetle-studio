import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { RouterTestingModule } from "@angular/router/testing";
import { ConnectionType } from "@connections/shared/connection-type.model";
import { PatternFlyNgModule } from "patternfly-ng";
import { ConnectionTypeCardComponent } from "./connection-type-card.component";

describe("ConnectionTypeCardComponent", () => {
  let component: ConnectionTypeCardComponent;
  let fixture: ComponentFixture<ConnectionTypeCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ RouterTestingModule, PatternFlyNgModule ],
      declarations: [ ConnectionTypeCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConnectionTypeCardComponent);
    component = fixture.componentInstance;

    const connType = new ConnectionType();
    connType.setName("connType1");
    component.connectionType = connType;

    component.selectedConnectionTypes = [];
    fixture.detectChanges();
  });

  it("should be created", () => {
    expect(component).toBeTruthy();
  });
});
