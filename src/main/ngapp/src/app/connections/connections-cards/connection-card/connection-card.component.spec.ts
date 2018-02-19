import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { Connection } from "@connections/shared/connection.model";
import { LoggerService } from "@core/logger.service";
import { PatternFlyNgModule } from "patternfly-ng";
import { ConnectionCardComponent } from "./connection-card.component";

describe("ConnectionCardComponent", () => {
  let component: ConnectionCardComponent;
  let fixture: ComponentFixture<ConnectionCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ PatternFlyNgModule, RouterTestingModule ],
      declarations: [ ConnectionCardComponent ],
      providers: [ LoggerService ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConnectionCardComponent);
    component = fixture.componentInstance;

    const connection = new Connection();
    connection.setId( "MyConnection" );
    component.connection = connection;
    component.selectedConnections = [ connection ];

    fixture.detectChanges();
  });

  it("should be created", () => {
    expect(component).toBeTruthy();
  });
});
