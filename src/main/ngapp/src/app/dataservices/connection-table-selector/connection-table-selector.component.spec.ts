import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { FormsModule } from "@angular/forms";
import { HttpModule } from "@angular/http";
import { ConnectionService } from "@connections/shared/connection.service";
import { MockConnectionService } from "@connections/shared/mock-connection.service";
import { AppSettingsService } from "@core/app-settings.service";
import { LoggerService } from "@core/logger.service";
import { JdbcTableSelectorComponent } from "@dataservices/jdbc-table-selector/jdbc-table-selector.component";
import { SelectedTableComponent } from "@dataservices/selected-table/selected-table.component";
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { ConnectionTableSelectorComponent } from "./connection-table-selector.component";

describe("ConnectionTableSelectorComponent", () => {
  let component: ConnectionTableSelectorComponent;
  let fixture: ComponentFixture<ConnectionTableSelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, HttpModule, NgxDatatableModule ],
      declarations: [ ConnectionTableSelectorComponent, JdbcTableSelectorComponent, SelectedTableComponent ],
      providers: [
        AppSettingsService, LoggerService,
        { provide: ConnectionService, useClass: MockConnectionService },
      ]
    })
      .compileComponents().then(() => {
      // nothing to do
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConnectionTableSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should be created", () => {
    expect(component).toBeTruthy();
  });
});
