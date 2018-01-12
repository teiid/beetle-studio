import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { FormsModule } from "@angular/forms";
import { HttpModule } from "@angular/http";
import { ConnectionService } from "@connections/shared/connection.service";
import { MockConnectionService } from "@connections/shared/mock-connection.service";
import { AppSettingsService } from "@core/app-settings.service";
import { LoggerService } from "@core/logger.service";
import { SelectedTableComponent } from "@dataservices/selected-table/selected-table.component";
import { MockVdbService } from "@dataservices/shared/mock-vdb.service";
import { NotifierService } from "@dataservices/shared/notifier.service";
import { VdbService } from "@dataservices/shared/vdb.service";
import { WizardService } from "@dataservices/shared/wizard.service";
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { JdbcTableSelectorComponent } from "./jdbc-table-selector.component";
import { PatternFlyNgModule } from "patternfly-ng";

describe("JdbcTableSelectorComponent", () => {
  let component: JdbcTableSelectorComponent;
  let fixture: ComponentFixture<JdbcTableSelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, HttpModule, NgxDatatableModule, PatternFlyNgModule ],
      declarations: [ JdbcTableSelectorComponent, SelectedTableComponent ],
      providers: [
        AppSettingsService, LoggerService, NotifierService, WizardService,
        { provide: ConnectionService, useClass: MockConnectionService },
        { provide: VdbService, useClass: MockVdbService },
      ]
    })
      .compileComponents().then(() => {
      // nothing to do
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JdbcTableSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should be created", () => {
    console.log("========== [JdbcTableSelectorComponent] should be created");
    expect(component).toBeTruthy();
  });
});
