import { ActivitiesCardsComponent } from "@activities/activities-cards/activities-cards.component";
import { ActivitiesListComponent } from "@activities/activities-list/activities-list.component";
import { ActivitiesComponent } from "@activities/activities.component";
import { ActivityService } from "@activities/shared/activity.service";
import { MockActivityService } from "@activities/shared/mock-activity.service";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { FormsModule } from "@angular/forms";
import { HttpModule } from "@angular/http";
import { By } from "@angular/platform-browser";
import { RouterTestingModule } from "@angular/router/testing";
import { CoreModule } from "@core/core.module";
import { SharedModule } from "@shared/shared.module";
import { ModalModule } from "ngx-bootstrap";

describe("ActivitiesComponent", () => {
  let component: ActivitiesComponent;
  let fixture: ComponentFixture<ActivitiesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [CoreModule, FormsModule, HttpModule, ModalModule.forRoot(), RouterTestingModule, SharedModule],
      declarations: [ActivitiesComponent, ActivitiesListComponent, ActivitiesCardsComponent],
      providers: [
        {provide: ActivityService, useClass: MockActivityService}
      ]
    })
    .compileComponents().then(() => {
      // nothing to do
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should be created", () => {
    expect(component).toBeTruthy();
  });

  it("should have Activities Title", () => {
    // query for the title <h2> by CSS element selector
    const de = fixture.debugElement.query(By.css("h2"));
    const el = de.nativeElement;
    expect(el.textContent).toEqual("Activities");
  });

  it("should have Toolbar", () => {
    // query for the toolbar by css classname
    const de = fixture.debugElement.query(By.css(".toolbar-pf"));
    expect(de).toBeDefined();
  });

  it("should have Activities", () => {
    // Check component object
    const activities = component.allActivities;
    expect(activities.length).toEqual(3);

    // Check html has the same number of activity cards
    const cardDebugElems = fixture.debugElement.queryAll(By.css(".activity-card-title"));
    expect(cardDebugElems).toBeDefined();
    expect(cardDebugElems.length).toEqual(3);
  });

  it("should have initial card layout", () => {
    // app-activities-cards should be present
    let debugEl = fixture.debugElement.query(By.css("app-activities-cards"));
    const element = debugEl.nativeElement;
    expect(element).toBeDefined();

    // app-activities-list should not be present
    debugEl = fixture.debugElement.query(By.css("app-activities-list"));
    expect(debugEl).toBeNull();
  });

  it("should toggle layout", () => {
    // Initial layout should be Card Layout
    let cardDebugElem = fixture.debugElement.query(By.css("app-activities-cards"));
    let listDebugElem = fixture.debugElement.query(By.css("app-activities-list"));
    expect(cardDebugElem).toBeDefined();
    expect(listDebugElem).toBeNull();
    const cardElem = cardDebugElem.nativeElement;
    expect(cardElem).toBeDefined();

    // Change the layout to ListLayout
    component.setListLayout();
    fixture.detectChanges();

    // Verify that the layout has changed
    cardDebugElem = fixture.debugElement.query(By.css("app-activities-cards"));
    listDebugElem = fixture.debugElement.query(By.css("app-activities-list"));
    expect(cardDebugElem).toBeNull();
    expect(listDebugElem).toBeDefined();
    const listElem = listDebugElem.nativeElement;
    expect(listElem).toBeDefined();
  });

  it("should filter activities", () => {
    // Expect 3 activities initially.
    let activities = component.filteredActivities;
    expect(activities.length).toEqual(3);

    // Set a name filter which satisfies none of the activities
    component.nameFilter = "g";
    component.filterActivities();
    fixture.detectChanges();

    // Now expect 0 activities match
    activities = component.filteredActivities;
    expect(activities.length).toEqual(0);
  });

});
