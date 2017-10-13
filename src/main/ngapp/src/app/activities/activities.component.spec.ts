import { ActivitiesCardsComponent } from "@activities/activities-cards/activities-cards.component";
import { ActivitiesListComponent } from "@activities/activities-list/activities-list.component";
import { ActivitiesComponent } from "@activities/activities.component";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { FormsModule } from "@angular/forms";
import { HttpModule } from "@angular/http";
import { RouterTestingModule } from "@angular/router/testing";
import { CoreModule } from "@core/core.module";
import { SharedModule } from "@shared/shared.module";
import { ModalModule } from "ngx-bootstrap";

describe("ActivitiesComponent", () => {
  let component: ActivitiesComponent;
  let fixture: ComponentFixture<ActivitiesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ CoreModule, FormsModule, HttpModule, ModalModule.forRoot(), RouterTestingModule, SharedModule ],
      declarations: [ ActivitiesComponent, ActivitiesListComponent, ActivitiesCardsComponent ]
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
});
