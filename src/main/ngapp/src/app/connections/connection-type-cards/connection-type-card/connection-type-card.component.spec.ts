import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { RouterTestingModule } from "@angular/router/testing";
import { ConnectionType } from "@connections/shared/connection-type.model";
import {
  ActionModule,
  CardModule,
  EmptyStateModule,
  FilterModule,
  ListModule,
  NotificationModule,
  SortModule,
  WizardModule } from "patternfly-ng";
import { ConnectionTypeCardComponent } from "./connection-type-card.component";

describe("ConnectionTypeCardComponent", () => {
  let component: ConnectionTypeCardComponent;
  let fixture: ComponentFixture<ConnectionTypeCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        ActionModule,
        CardModule,
        EmptyStateModule,
        FilterModule,
        ListModule,
        NotificationModule,
        SortModule,
        WizardModule
      ],
      declarations: [ ConnectionTypeCardComponent ]
    })
    .compileComponents().then(() => {
      // nothing to do
    });
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
