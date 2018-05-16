import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterTestingModule } from "@angular/router/testing";
import { ConnectionService } from "@connections/shared/connection.service";
import { MockConnectionService } from "@connections/shared/mock-connection.service";
import { AppSettingsService } from "@core/app-settings.service";
import { CoreModule } from "@core/core.module";
import { MockAppSettingsService } from "@core/mock-app-settings.service";
import { ConnectionNodeSelectorComponent } from "@dataservices/connection-node-selector/connection-node-selector.component";
import { ConnectionSchemaTreeComponent } from "@dataservices/connection-schema-tree/connection-schema-tree.component";
import { SelectedNodeComponent } from "@dataservices/selected-node/selected-node.component";
import { SelectedNodesListComponent } from "@dataservices/selected-nodes-list/selected-nodes-list.component";
import { DataserviceService } from "@dataservices/shared/dataservice.service";
import { MockDataserviceService } from "@dataservices/shared/mock-dataservice.service";
import { MockVdbService } from "@dataservices/shared/mock-vdb.service";
import { NotifierService } from "@dataservices/shared/notifier.service";
import { VdbService } from "@dataservices/shared/vdb.service";
import { WizardService } from "@dataservices/shared/wizard.service";
import { PropertyFormPropertyComponent } from "@shared/property-form/property-form-property/property-form-property.component";
import { PropertyFormComponent } from "@shared/property-form/property-form.component";
import { TreeModule } from "angular-tree-component";
import { PatternFlyNgModule } from "patternfly-ng";
import { AddDataserviceWizardComponent } from "./add-dataservice-wizard.component";

describe("AddDataserviceWizardComponent", () => {
  let component: AddDataserviceWizardComponent;
  let fixture: ComponentFixture<AddDataserviceWizardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ CoreModule, FormsModule, PatternFlyNgModule, ReactiveFormsModule, RouterTestingModule, TreeModule ],
      declarations: [ AddDataserviceWizardComponent, ConnectionNodeSelectorComponent, ConnectionSchemaTreeComponent,
                      PropertyFormComponent, PropertyFormPropertyComponent,
                      SelectedNodesListComponent, SelectedNodeComponent ],
      providers: [
        NotifierService, WizardService,
        { provide: AppSettingsService, useClass: MockAppSettingsService },
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
    console.log("========== [AddDataserviceWizardComponent] should be created");
    expect(component).toBeTruthy();
  });
});
