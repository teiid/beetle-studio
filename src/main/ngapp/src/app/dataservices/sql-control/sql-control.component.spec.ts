import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { FormsModule } from "@angular/forms";
import { HttpModule } from "@angular/http";
import { AppSettingsService } from "@core/app-settings.service";
import { LoggerService } from "@core/logger.service";
import { DataserviceService } from "@dataservices/shared/dataservice.service";
import { MockDataserviceService } from "@dataservices/shared/mock-dataservice.service";
import { MockVdbService } from "@dataservices/shared/mock-vdb.service";
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
        AppSettingsService, LoggerService,
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
    fixture.detectChanges();
  });

  it("should be created", () => {
    expect(component).toBeTruthy();
  });
});
