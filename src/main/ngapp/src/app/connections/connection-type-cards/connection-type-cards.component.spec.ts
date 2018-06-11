import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { RouterTestingModule } from "@angular/router/testing";
import { ConnectionTypeCardComponent } from "@connections/connection-type-cards/connection-type-card/connection-type-card.component";
import {
  ActionModule,
  CardModule,
  EmptyStateModule,
  FilterModule,
  ListModule,
  NotificationModule,
  SortModule,
  WizardModule } from "patternfly-ng";
import { ConnectionTypeCardsComponent } from "./connection-type-cards.component";

describe("ConnectionTypeCardsComponent", () => {
  let component: ConnectionTypeCardsComponent;
  let fixture: ComponentFixture<ConnectionTypeCardsComponent>;

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
      declarations: [ ConnectionTypeCardComponent, ConnectionTypeCardsComponent ]
    })
    .compileComponents().then(() => {
      // nothing to do
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConnectionTypeCardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should be created", () => {
    expect(component).toBeTruthy();
  });
});
