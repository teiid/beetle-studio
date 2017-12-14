import { ActivitiesCardsComponent } from "@activities/activities-cards/activities-cards.component";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { RouterModule } from "@angular/router";

describe("ActivitiesCardsComponent", () => {
  let component: ActivitiesCardsComponent;
  let fixture: ComponentFixture<ActivitiesCardsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterModule],
      declarations: [ ActivitiesCardsComponent ]
    })
    .compileComponents().then(() => {
      // nothing to do
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivitiesCardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should be created", () => {
    console.log("========== [ActivitiesCardsComponent] should be created");
    expect(component).toBeTruthy();
  });
});
