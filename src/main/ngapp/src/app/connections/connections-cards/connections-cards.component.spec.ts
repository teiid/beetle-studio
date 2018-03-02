import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { ConnectionCardComponent } from "@connections/connections-cards/connection-card/connection-card.component";
import { ConnectionsCardsComponent } from "@connections/connections-cards/connections-cards.component";
import { LoggerService } from "@core/logger.service";
import { PatternFlyNgModule } from "patternfly-ng";

describe("ConnectionsCardsComponent", () => {
  let component: ConnectionsCardsComponent;
  let fixture: ComponentFixture<ConnectionsCardsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ PatternFlyNgModule, RouterTestingModule ],
      declarations: [ ConnectionCardComponent, ConnectionsCardsComponent ],
      providers: [ LoggerService ]
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
