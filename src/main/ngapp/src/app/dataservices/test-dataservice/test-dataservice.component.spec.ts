import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { FormsModule } from "@angular/forms";
import { RouterTestingModule } from "@angular/router/testing";
import { AppSettingsService } from "@core/app-settings.service";
import { CoreModule } from "@core/core.module";
import { MockAppSettingsService } from "@core/mock-app-settings.service";
import { DataserviceService } from "@dataservices/shared/dataservice.service";
import { MockDataserviceService } from "@dataservices/shared/mock-dataservice.service";
import { MockVdbService } from "@dataservices/shared/mock-vdb.service";
import { NotifierService } from "@dataservices/shared/notifier.service";
import { VdbService } from "@dataservices/shared/vdb.service";
import { SqlControlComponent } from "@dataservices/sql-control/sql-control.component";
import { TestDataserviceComponent } from "@dataservices/test-dataservice/test-dataservice.component";
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { CodemirrorModule } from "ng2-codemirror";

describe("TestDataserviceComponent", () => {
  let component: TestDataserviceComponent;
  let fixture: ComponentFixture<TestDataserviceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ CoreModule, FormsModule, RouterTestingModule, NgxDatatableModule, CodemirrorModule ],
      declarations: [ SqlControlComponent, TestDataserviceComponent ],
      providers: [
        NotifierService,
        { provide: AppSettingsService, useClass: MockAppSettingsService },
        { provide: DataserviceService, useClass: MockDataserviceService },
        { provide: VdbService, useClass: MockVdbService }
      ]
    })
      .compileComponents().then(() => {
      // nothing to do
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestDataserviceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should be created", () => {
    console.log("========== [TestDataserviceComponent] should be created");
    expect(component).toBeTruthy();
  });
});
