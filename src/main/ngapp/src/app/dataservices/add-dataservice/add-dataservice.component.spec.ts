import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterTestingModule } from "@angular/router/testing";
import { ConnectionService } from "@connections/shared/connection.service";
import { MockConnectionService } from "@connections/shared/mock-connection.service";
import { CoreModule } from "@core/core.module";
import { AddDataserviceWizardComponent } from "@dataservices/add-dataservice-wizard/add-dataservice-wizard.component";
import { ConnectionTableSelectorComponent } from "@dataservices/connection-table-selector/connection-table-selector.component";
import { JdbcTableSelectorComponent } from "@dataservices/jdbc-table-selector/jdbc-table-selector.component";
import { SelectedTableComponent } from "@dataservices/selected-table/selected-table.component";
import { DataserviceService } from "@dataservices/shared/dataservice.service";
import { MockDataserviceService } from "@dataservices/shared/mock-dataservice.service";
import { MockVdbService } from "@dataservices/shared/mock-vdb.service";
import { NotifierService } from "@dataservices/shared/notifier.service";
import { VdbService } from "@dataservices/shared/vdb.service";
import { SharedModule } from "@shared/shared.module";
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { PatternFlyNgModule } from "patternfly-ng";
import { AddDataserviceComponent } from "./add-dataservice.component";

describe("AddDataserviceComponent", () => {
  let component: AddDataserviceComponent;
  let fixture: ComponentFixture<AddDataserviceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ CoreModule, PatternFlyNgModule, FormsModule, ReactiveFormsModule, RouterTestingModule, SharedModule, NgxDatatableModule ],
      declarations: [ AddDataserviceComponent, AddDataserviceWizardComponent,
                      ConnectionTableSelectorComponent, JdbcTableSelectorComponent, SelectedTableComponent ],
      providers: [
        NotifierService,
        { provide: DataserviceService, useClass: MockDataserviceService },
        { provide: ConnectionService, useClass: MockConnectionService },
        { provide: VdbService, useClass: MockVdbService }
      ]
    })
    .compileComponents().then(() => {
      // nothing to do
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddDataserviceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should be created", () => {
    console.log("========== [AddDataserviceComponent] should be created");
    expect(component).toBeTruthy();
  });
});
