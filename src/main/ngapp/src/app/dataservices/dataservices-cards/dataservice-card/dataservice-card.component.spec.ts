import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { DataserviceCardComponent } from "@dataservices/dataservices-cards/dataservice-card/dataservice-card.component";
import { Dataservice } from "@dataservices/shared/dataservice.model";
import { PatternFlyNgModule } from "patternfly-ng";

describe("DataserviceCardComponent", () => {
  let component: DataserviceCardComponent;
  let fixture: ComponentFixture<DataserviceCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ PatternFlyNgModule, RouterTestingModule ],
      declarations: [ DataserviceCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataserviceCardComponent);
    component = fixture.componentInstance;

    const ds = new Dataservice();
    ds.setId("serv1");
    component.dataservice = ds;

    component.selectedDataservices = [];
    fixture.detectChanges();
  });

  it("should be created", () => {
    console.log("========== [DataserviceCardComponent] should be created");
    expect(component).toBeTruthy();
  });
});
