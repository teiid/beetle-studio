import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { ConnectionsCardsComponent } from "@connections/connections-cards/connections-cards.component";

describe("ConnectionsCardsComponent", () => {
  let component: ConnectionsCardsComponent;
  let fixture: ComponentFixture<ConnectionsCardsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ RouterTestingModule ],
      declarations: [ ConnectionsCardsComponent ]
    })
    .compileComponents().then(() => {
      // nothing to do
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConnectionsCardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should be created", () => {
    console.log("========== [ConnectionCardsComponent] should be created");
    expect(component).toBeTruthy();
  });
});
