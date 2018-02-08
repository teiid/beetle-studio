import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { FormsModule } from "@angular/forms";
import { HttpModule } from "@angular/http";
import { AppSettingsService } from "@core/app-settings.service";
import { LoggerService } from "@core/logger.service";
import { MockAppSettingsService } from "@core/mock-app-settings.service";
import { DataserviceService } from "@dataservices/shared/dataservice.service";
import { MockDataserviceService } from "@dataservices/shared/mock-dataservice.service";
import { MockVdbService } from "@dataservices/shared/mock-vdb.service";
import { NotifierService } from "@dataservices/shared/notifier.service";
import { Table } from "@dataservices/shared/table.model";
import { VdbService } from "@dataservices/shared/vdb.service";
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { CodemirrorModule } from "ng2-codemirror";
import { SqlControlComponent } from "./sql-control.component";

describe("SqlControlComponent", () => {
  let component: SqlControlComponent;
  let fixture: ComponentFixture<SqlControlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, HttpModule, NgxDatatableModule, CodemirrorModule  ],
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
    fixture = TestBed.createComponent(SqlControlComponent);
    component = fixture.componentInstance;

    // Set the inputs for the component
    component.viewSql = "SELECT * FROM views.View1";
    const table = new Table();
    table.setName("views.View1");
    const tables: Table[] = [];
    tables.push(table);
    component.serviceViews = tables;
    component.selectedViews = tables;

    fixture.detectChanges();
  });

  it("should be created", () => {
    console.log("========== [SqlControlComponent] should be created");
    expect(component).toBeTruthy();
  });
});
