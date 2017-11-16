import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterTestingModule } from "@angular/router/testing";
import { ConnectionService } from "@connections/shared/connection.service";
import { MockConnectionService } from "@connections/shared/mock-connection.service";
import { CoreModule } from "@core/core.module";
import { ConnectionTableSelectorComponent } from "@dataservices/connection-table-selector/connection-table-selector.component";
import { JdbcTableSelectorComponent } from "@dataservices/jdbc-table-selector/jdbc-table-selector.component";
import { DataserviceService } from "@dataservices/shared/dataservice.service";
import { MockDataserviceService } from "@dataservices/shared/mock-dataservice.service";
import { MockVdbService } from "@dataservices/shared/mock-vdb.service";
import { VdbService } from "@dataservices/shared/vdb.service";
import { PropertyFormPropertyComponent } from "@shared/property-form/property-form-property/property-form-property.component";
import { PropertyFormComponent } from "@shared/property-form/property-form.component";
import { PatternFlyNgModule } from "patternfly-ng";
import { AddDataserviceWizardComponent } from "./add-dataservice-wizard.component";

describe("AddDataserviceWizardComponent", () => {
  let component: AddDataserviceWizardComponent;
  let fixture: ComponentFixture<AddDataserviceWizardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ CoreModule, FormsModule, PatternFlyNgModule, ReactiveFormsModule, RouterTestingModule ],
      declarations: [ AddDataserviceWizardComponent, ConnectionTableSelectorComponent, JdbcTableSelectorComponent,
                      PropertyFormComponent, PropertyFormPropertyComponent ],
      providers: [
        { provide: DataserviceService, useClass: MockDataserviceService },
        { provide: ConnectionService, useClass: MockConnectionService },
        { provide: VdbService, useClass: MockVdbService },
      ]
    })
    .compileComponents().then(() => {
      // nothing to do
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddDataserviceWizardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should be created", () => {
    expect(component).toBeTruthy();
  });
});
