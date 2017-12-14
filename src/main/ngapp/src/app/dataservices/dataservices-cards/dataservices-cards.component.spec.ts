import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { DataservicesCardsComponent } from "@dataservices/dataservices-cards/dataservices-cards.component";

describe("DataservicesCardsComponent", () => {
  let component: DataservicesCardsComponent;
  let fixture: ComponentFixture<DataservicesCardsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ RouterTestingModule ],
      declarations: [ DataservicesCardsComponent ]
    })
    .compileComponents().then(() => {
      // nothing to do
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataservicesCardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should be created", () => {
    console.log("========== [DataservicesCardsComponent] should be created");
    expect(component).toBeTruthy();
  });
});
