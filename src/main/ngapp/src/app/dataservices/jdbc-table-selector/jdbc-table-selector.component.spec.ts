import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { FormsModule } from "@angular/forms";
import { HttpModule } from "@angular/http";
import { ConnectionService } from "@connections/shared/connection.service";
import { MockConnectionService } from "@connections/shared/mock-connection.service";
import { AppSettingsService } from "@core/app-settings.service";
import { LoggerService } from "@core/logger.service";
import { JdbcTableSelectorComponent } from "./jdbc-table-selector.component";

describe("JdbcTableSelectorComponent", () => {
  let component: JdbcTableSelectorComponent;
  let fixture: ComponentFixture<JdbcTableSelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, HttpModule ],
      declarations: [ JdbcTableSelectorComponent ],
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
    fixture = TestBed.createComponent(JdbcTableSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should be created", () => {
    expect(component).toBeTruthy();
  });
});
