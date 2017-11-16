import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { FormsModule } from "@angular/forms";
import { HttpModule } from "@angular/http";
import { By } from "@angular/platform-browser";
import { RouterTestingModule } from "@angular/router/testing";
import { CoreModule } from "@core/core.module";
import { DataservicesCardsComponent } from "@dataservices/dataservices-cards/dataservices-cards.component";
import { DataservicesListComponent } from "@dataservices/dataservices-list/dataservices-list.component";
import { DataservicesComponent } from "@dataservices/dataservices.component";
import { DataserviceService } from "@dataservices/shared/dataservice.service";
import { MockDataserviceService } from "@dataservices/shared/mock-dataservice.service";
import { MockVdbService } from "@dataservices/shared/mock-vdb.service";
import { VdbService } from "@dataservices/shared/vdb.service";
import { SharedModule } from "@shared/shared.module";
import { ModalModule } from "ngx-bootstrap";

describe("DataservicesComponent", () => {
  let component: DataservicesComponent;
  let fixture: ComponentFixture<DataservicesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ CoreModule, FormsModule, HttpModule, ModalModule.forRoot(), RouterTestingModule, SharedModule ],
      declarations: [ DataservicesComponent, DataservicesListComponent, DataservicesCardsComponent ],
      providers: [
        { provide: VdbService, useClass: MockVdbService },
      ]
    });

    // use mock service
    TestBed.overrideComponent( DataservicesComponent, {
      set: {
        providers: [
          { provide: DataserviceService, useClass: MockDataserviceService },
        ]
      }
    });

    fixture = TestBed.createComponent(DataservicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it("should be created", () => {
    expect(component).toBeTruthy();
  });

  it("should have Dataservices Title", () => {
    // query for the title <h2> by CSS element selector
    const de = fixture.debugElement.query(By.css("h2"));
    const el = de.nativeElement;
    expect(el.textContent).toEqual("Dataservices");
  });

  it("should have Toolbar", () => {
    // query for the toolbar by css classname
    const de = fixture.debugElement.query(By.css(".toolbar-pf"));
    expect(de).toBeDefined();
  });

  it("should have Dataservices", () => {
    // Check component object
    const dataservices = component.allDataservices;
    expect(dataservices.length).toEqual(3);

    // Check html has the same number of dataservice cards
    const cardDebugElems = fixture.debugElement.queryAll(By.css(".dataservice-card-title"));
    expect(cardDebugElems).toBeDefined();
    expect(cardDebugElems.length).toEqual(3);
  });

  it("should have initial card layout", () => {
    // app-dataservices-cards should be present
    let debugEl = fixture.debugElement.query(By.css("app-dataservices-cards"));
    const element = debugEl.nativeElement;
    expect(element).toBeDefined();

    // app-dataservices-list should not be present
    debugEl = fixture.debugElement.query(By.css("app-dataservices-list"));
    expect(debugEl).toBeNull();
  });

  it("should toggle layout", () => {
    // Initial layout should be Card Layout
    let cardDebugElem = fixture.debugElement.query(By.css("app-dataservices-cards"));
    let listDebugElem = fixture.debugElement.query(By.css("app-dataservices-list"));
    expect(cardDebugElem).toBeDefined();
    expect(listDebugElem).toBeNull();
    const cardElem = cardDebugElem.nativeElement;
    expect(cardElem).toBeDefined();

    // Change the layout to ListLayout
    component.setListLayout();
    fixture.detectChanges();

    // Verify that the layout has changed
    cardDebugElem = fixture.debugElement.query(By.css("app-dataservices-cards"));
    listDebugElem = fixture.debugElement.query(By.css("app-dataservices-list"));
    expect(cardDebugElem).toBeNull();
    expect(listDebugElem).toBeDefined();
    const listElem = listDebugElem.nativeElement;
    expect(listElem).toBeDefined();
  });

  it("should filter dataservices", () => {
    // Expect 3 dataservices initially.
    let dataservices = component.filteredDataservices;
    expect(dataservices.length).toEqual(3);

    // Set a name filter which satisfies none of the dataservices
    component.nameFilter = "g";
    component.filterDataservices();
    fixture.detectChanges();

    // Now expect 0 services match
    dataservices = component.filteredDataservices;
    expect(dataservices.length).toEqual(0);
  });

});
