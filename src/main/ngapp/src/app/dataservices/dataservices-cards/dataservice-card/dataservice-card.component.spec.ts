import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { FormsModule } from "@angular/forms";
import { RouterTestingModule } from "@angular/router/testing";
import { LoggerService } from "@core/logger.service";
import { DataserviceService } from "@dataservices/shared/dataservice.service";
import { DataserviceCardComponent } from "@dataservices/dataservices-cards/dataservice-card/dataservice-card.component";
import { Dataservice } from "@dataservices/shared/dataservice.model";
import { SharedModule } from "@shared/shared.module";
import { MockVdbService } from "@dataservices/shared/mock-vdb.service";
import { VdbService } from "@dataservices/shared/vdb.service";
import { AppSettingsService } from "@core/app-settings.service";
import { MockAppSettingsService } from "@core/mock-app-settings.service";
import { NotifierService } from "@dataservices/shared/notifier.service";
import {
  ActionModule,
  CardModule,
  EmptyStateModule,
  FilterModule,
  ListModule,
  NotificationModule,
  SortModule,
  TableModule,
  WizardModule
} from "patternfly-ng";
import { TooltipModule } from 'ngx-bootstrap';
import { CodemirrorModule } from "ng2-codemirror";
import { HttpModule } from "@angular/http";

describe("DataserviceCardComponent", () => {
  let component: DataserviceCardComponent;
  let fixture: ComponentFixture<DataserviceCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        TooltipModule,
        CodemirrorModule,
        FormsModule,
        HttpModule,
        SharedModule,
        ActionModule,
        CardModule,
        EmptyStateModule,
        FilterModule,
        ListModule,
        NotificationModule,
        SortModule,
        TableModule,
        WizardModule
      ],
      declarations: [ DataserviceCardComponent ],
      providers: [
        LoggerService, DataserviceService, NotifierService,
        { provide: VdbService, useClass: MockVdbService },
        { provide: AppSettingsService, useClass: MockAppSettingsService }
      ]
    })
    .compileComponents().then(() => {
      // nothing to do
    });
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
