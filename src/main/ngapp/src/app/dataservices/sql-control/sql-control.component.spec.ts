import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { FormsModule } from "@angular/forms";
import { HttpModule } from "@angular/http";
import { AppSettingsService } from "@core/app-settings.service";
import { LoggerService } from "@core/logger.service";
import { MockAppSettingsService } from "@core/mock-app-settings.service";
import { Dataservice } from "@dataservices/shared/dataservice.model";
import { DataserviceService } from "@dataservices/shared/dataservice.service";
import { MockDataserviceService } from "@dataservices/shared/mock-dataservice.service";
import { MockVdbService } from "@dataservices/shared/mock-vdb.service";
import { NotifierService } from "@dataservices/shared/notifier.service";
import { VdbService } from "@dataservices/shared/vdb.service";
import { CodemirrorModule } from "ng2-codemirror";
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
import { SqlControlComponent } from "./sql-control.component";
import { SqlView } from "@dataservices/shared/sql-view.model";

describe("SqlControlComponent", () => {
  let component: SqlControlComponent;
  let fixture: ComponentFixture<SqlControlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        HttpModule,
        CodemirrorModule,
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
      declarations: [ SqlControlComponent ],
      providers: [
        AppSettingsService,
        LoggerService,
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
    // select a dataservice before constructing component
    const service = TestBed.get( DataserviceService );
    let dataservices: Dataservice[];
    service.getAllDataservices().subscribe( ( values ) => { dataservices = values; } );
    // noinspection JSUnusedAssignment
    service.setSelectedDataservice( dataservices[ 0 ] );

    fixture = TestBed.createComponent(SqlControlComponent);
    component = fixture.componentInstance;

    // Set the inputs for the component
    component.viewSql = "SELECT * FROM views.View1";
    const sqlView = new SqlView("views.View1");
    const sqlViews: SqlView[] = [];
    sqlViews.push(sqlView);
    component.serviceViews = sqlViews;
    component.selectedViews = sqlViews;

    fixture.detectChanges();
  });

  it("should be created", () => {
    console.log("========== [SqlControlComponent] should be created");
    expect(component).toBeTruthy();
  });
});
