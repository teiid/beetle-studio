import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { FormsModule } from "@angular/forms";
import { LoggerService } from "@core/logger.service";
import { DataserviceCardComponent } from "@dataservices/dataservices-cards/dataservice-card/dataservice-card.component";
import { DataservicesCardsComponent } from "@dataservices/dataservices-cards/dataservices-cards.component";
import { SharedModule } from "@shared/shared.module";
import { PatternFlyNgModule } from "patternfly-ng";
import { TooltipModule } from 'ngx-bootstrap';
import { CodemirrorModule } from "ng2-codemirror";

describe("DataservicesCardsComponent", () => {
  let component: DataservicesCardsComponent;
  let fixture: ComponentFixture<DataservicesCardsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule, PatternFlyNgModule,
        TooltipModule, CodemirrorModule, FormsModule,
        SharedModule
      ],
      declarations: [ DataservicesCardsComponent, DataserviceCardComponent ],
      providers: [ LoggerService ]
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
