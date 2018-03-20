import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { FormsModule } from "@angular/forms";
import { HttpModule } from "@angular/http";
import { ConnectionService } from "@connections/shared/connection.service";
import { MockConnectionService } from "@connections/shared/mock-connection.service";
import { AppSettingsService } from "@core/app-settings.service";
import { LoggerService } from "@core/logger.service";
import { MockAppSettingsService } from "@core/mock-app-settings.service";
import { JdbcTableSelectorComponent } from "@dataservices/jdbc-table-selector/jdbc-table-selector.component";
import { SelectedTableComponent } from "@dataservices/selected-table/selected-table.component";
import { MockVdbService } from "@dataservices/shared/mock-vdb.service";
import { NotifierService } from "@dataservices/shared/notifier.service";
import { VdbService } from "@dataservices/shared/vdb.service";
import { WizardService } from "@dataservices/shared/wizard.service";
import { PatternFlyNgModule } from "patternfly-ng";

describe("JdbcTableSelectorComponent", () => {
  let component: JdbcTableSelectorComponent;
  let fixture: ComponentFixture<JdbcTableSelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, HttpModule, PatternFlyNgModule ],
      declarations: [ JdbcTableSelectorComponent, SelectedTableComponent ],
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
    fixture = TestBed.createComponent(JdbcTableSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should be created", () => {
    console.log("========== [JdbcTableSelectorComponent] should be created");
    expect(component).toBeTruthy();
  });

  // it("should have correct number of schemas", () => {
  //   console.log("========== [JdbcTableSelectorComponent] should have correct number of schemas");
  //   component.connection = MockConnectionService.conn2;
  //   component.ngOnInit();
  //   component.setConnection( MockConnectionService.conn1 );
  //   expect( component.getSchemas().length ).toBe( MockConnectionService.numConn1Schemas );
  // });
  //
  // it( "should clear schemas", () => {
  //   console.log("========== [JdbcTableSelectorComponent] should clear schemas");
  //   component.connection = MockConnectionService.conn3;
  //   component.ngOnInit();
  //   expect( component.getSchemas().length ).toBe( MockConnectionService.numConn3Schemas );
  //
  //   component.clearSchemas();
  //   expect( component.getSchemas().length ).toBe( 0 );
  // });
  //
  // it( "should select schema", () => {
  //   console.log("========== [JdbcTableSelectorComponent] should select schema");
  //   component.connection = MockConnectionService.conn1;
  //   component.ngOnInit();
  //   expect( component.selectedSchema ).toBeNull();
  //   expect( component.hasSelectedSchema ).toBeFalsy();
  //
  //   component.selectedSchema = component.getSchemas()[ 0 ];
  //   expect( component.hasSelectedSchema ).toBeTruthy();
  // });

});
