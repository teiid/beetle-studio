import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { FormsModule } from "@angular/forms";
import { HttpModule } from "@angular/http";
import { Connection } from "@connections/shared/connection.model";
import { ConnectionService } from "app/connections/shared/connection.service";
import { MockConnectionService } from "app/connections/shared/mock-connection.service";
import { AppSettingsService } from "app/core/app-settings.service";
import { LoggerService } from "app/core/logger.service";
import { MockAppSettingsService } from "app/core/mock-app-settings.service";
import { RelationalTableSelectorComponent } from "app/dataservices/relational-table-selector/relational-table-selector.component";
import { SelectedTableComponent } from "app/dataservices/selected-table/selected-table.component";
import { MockVdbService } from "app/dataservices/shared/mock-vdb.service";
import { NotifierService } from "app/dataservices/shared/notifier.service";
import { VdbService } from "app/dataservices/shared/vdb.service";
import { WizardService } from "app/dataservices/shared/wizard.service";
import { PatternFlyNgModule } from "patternfly-ng";

describe("RelationalTableSelectorComponent", () => {
  let component: RelationalTableSelectorComponent;
  let fixture: ComponentFixture<RelationalTableSelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, HttpModule, PatternFlyNgModule ],
      declarations: [ RelationalTableSelectorComponent, SelectedTableComponent ],
      providers: [
        AppSettingsService, LoggerService, NotifierService, WizardService,
        { provide: AppSettingsService, useClass: MockAppSettingsService },
        { provide: ConnectionService, useClass: MockConnectionService },
        { provide: VdbService, useClass: MockVdbService },
      ]
    })
      .compileComponents().then(() => {
      // nothing to do
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RelationalTableSelectorComponent);
    component = fixture.componentInstance;
    const conn: Connection = new Connection();
    conn.setId("conn1");
    component.connection = conn;
    component.setConnection(conn);
    fixture.detectChanges();
  });

  it("should be created", () => {
    console.log("========== [RelationalTableSelectorComponent] should be created");
    expect(component).toBeTruthy();
  });

});
