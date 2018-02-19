import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { LoggerService } from "@core/logger.service";
import { BasicContentComponent } from "@dataservices/dataservices-list/basic-content.component";
import { DataservicesListComponent } from "@dataservices/dataservices-list/dataservices-list.component";
import { ViewsContentComponent } from "@dataservices/dataservices-list/views-content.component";
import { PatternFlyNgModule } from "patternfly-ng";

describe("DataservicesListComponent", () => {
  let component: DataservicesListComponent;
  let fixture: ComponentFixture<DataservicesListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ PatternFlyNgModule, RouterTestingModule ],
      declarations: [ BasicContentComponent, DataservicesListComponent, ViewsContentComponent ],
      providers: [ LoggerService ]
    })
    .compileComponents().then(() => {
      // nothing to do
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataservicesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should be created", () => {
    console.log("========== [DataservicesListComponent] should be created");
    expect(component).toBeTruthy();
  });
});
