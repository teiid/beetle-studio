import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FormsModule } from "@angular/forms";
import { HttpModule } from "@angular/http";
import { By } from "@angular/platform-browser";
import { RouterTestingModule } from "@angular/router/testing";
import { ConnectionCardComponent } from "@connections/connections-cards/connection-card/connection-card.component";
import { ConnectionsCardsComponent } from "@connections/connections-cards/connections-cards.component";
import { ConnectionDetailsComponent } from "@connections/connections-list/connection-details.component";
import { ConnectionsListComponent } from "@connections/connections-list/connections-list.component";
import { ConnectionsComponent } from "@connections/connections.component";
import { ConnectionService } from "@connections/shared/connection.service";
import { MockConnectionService } from "@connections/shared/mock-connection.service";
import { AppSettingsService } from "@core/app-settings.service";
import { CoreModule } from "@core/core.module";
import { MockAppSettingsService } from "@core/mock-app-settings.service";
import { MockVdbService } from "@dataservices/shared/mock-vdb.service";
import { NotifierService } from "@dataservices/shared/notifier.service";
import { VdbService } from "@dataservices/shared/vdb.service";
import { SharedModule } from "@shared/shared.module";
import { ModalModule } from "ngx-bootstrap";
import {
  ActionModule,
  CardModule,
  EmptyStateModule,
  FilterModule,
  ListModule,
  NotificationModule,
  SortModule,
  WizardModule
} from "patternfly-ng";
import { SelectionService } from "@core/selection.service";

describe("ConnectionsComponent", () => {
  let component: ConnectionsComponent;
  let fixture: ComponentFixture<ConnectionsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        CoreModule,
        FormsModule,
        HttpModule,
        ModalModule.forRoot(),
        RouterTestingModule,
        SharedModule,
        ActionModule,
        CardModule,
        EmptyStateModule,
        FilterModule,
        ListModule,
        NotificationModule,
        SortModule,
        WizardModule
      ],
      declarations: [
        ConnectionsComponent,
        ConnectionDetailsComponent,
        ConnectionsListComponent,
        ConnectionCardComponent,
        ConnectionsCardsComponent
      ],
      providers: [
        AppSettingsService,
        NotifierService,
        SelectionService,
        { provide: AppSettingsService, useClass: MockAppSettingsService },
        { provide: ConnectionService, useClass: MockConnectionService },
        { provide: VdbService, useClass: MockVdbService }
      ]
    });

    fixture = TestBed.createComponent(ConnectionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should be created", () => {
    console.log("========== [ConnectionsComponent] should be created");
    expect(component).toBeTruthy();
  });

  it("should have Connections Title", () => {
    console.log("========== [ConnectionsComponent] should have Connections Title");
    // query for the title <h2> by CSS element selector
    const de = fixture.debugElement.query(By.css("h2"));
    const el = de.nativeElement;
    expect(el.textContent).toEqual("Connections");
  });

  it("should have Toolbar", () => {
    console.log("========== [ConnectionsComponent] should have Toolbar");
    // query for the toolbar by css classname
    const de = fixture.debugElement.query(By.css(".toolbar-pf"));
    expect(de).toBeDefined();
  });

  it("should have Connections", () => {
    console.log("========== [ConnectionsComponent] should have Connections");
    // Check component object
    const connections = component.allConnections;
    expect(connections.length).toEqual(2);

    // Check html has the same number of connection cards
    const cardDebugElems = fixture.debugElement.queryAll(By.css(".object-card"));
    expect(cardDebugElems).toBeDefined();
    expect(cardDebugElems.length).toEqual(2);
  });

  it("should have initial card layout", () => {
    console.log("========== [ConnectionsComponent] should have initial card layout");
    // app-connections-cards should be present
    let debugEl = fixture.debugElement.query(By.css("app-connections-cards"));
    const element = debugEl.nativeElement;
    expect(element).toBeDefined();

    // app-connections-list should not be present
    debugEl = fixture.debugElement.query(By.css("app-connections-list"));
    expect(debugEl).toBeNull();
  });

  it("should toggle layout", () => {
    console.log("========== [ConnectionsComponent] should toggle layout");
    // Initial layout should be Card Layout
    let cardDebugElem = fixture.debugElement.query(By.css("app-connections-cards"));
    let listDebugElem = fixture.debugElement.query(By.css("app-connections-list"));
    expect(cardDebugElem).toBeDefined();
    expect(listDebugElem).toBeNull();
    const cardElem = cardDebugElem.nativeElement;
    expect(cardElem).toBeDefined();

    // Change the layout to ListLayout
    component.setListLayout();
    fixture.detectChanges();

    // Verify that the layout has changed
    cardDebugElem = fixture.debugElement.query(By.css("app-connections-cards"));
    listDebugElem = fixture.debugElement.query(By.css("app-connections-list"));
    expect(cardDebugElem).toBeNull();
    expect(listDebugElem).toBeDefined();
    const listElem = listDebugElem.nativeElement;
    expect(listElem).toBeDefined();
  });

  // it("should filter connections", () => {
  //   console.log("========== [ConnectionsComponent] should filter connections");
  //   // Expect 3 connections initially.
  //   let connections = component.filteredConnections;
  //   expect(connections.length).toEqual(3);
  //
  //   // Set a name filter which satisfies none of the connections
  //   component.nameFilter = "g";
  //   component.filterConnections();
  //   fixture.detectChanges();
  //
  //   // Now expect 0 connections match
  //   connections = component.filteredConnections;
  //   expect(connections.length).toEqual(0);
  // });

});
