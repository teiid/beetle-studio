import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { ActivityService } from "@activities/shared/activity.service";
import { MockActivityService } from "@activities/shared/mock-activity.service";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterTestingModule } from "@angular/router/testing";
import { ConnectionService } from "@connections/shared/connection.service";
import { MockConnectionService } from "@connections/shared/mock-connection.service";
import { AppSettingsService } from "@core/app-settings.service";
import { CoreModule } from "@core/core.module";
import { MockAppSettingsService } from "@core/mock-app-settings.service";
import { MockVdbService } from "@dataservices/shared/mock-vdb.service";
import { NotifierService } from "@dataservices/shared/notifier.service";
import { VdbService } from "@dataservices/shared/vdb.service";
import { PropertyFormPropertyComponent } from "@shared/property-form/property-form-property/property-form-property.component";
import { PropertyFormComponent } from "@shared/property-form/property-form.component";
import { PatternFlyNgModule } from "patternfly-ng";
import { AddActivityWizardComponent } from "./add-activity-wizard.component";

describe("AddActivityWizardComponent", () => {
  let component: AddActivityWizardComponent;
  let fixture: ComponentFixture<AddActivityWizardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ CoreModule, FormsModule, PatternFlyNgModule, ReactiveFormsModule, RouterTestingModule ],
      declarations: [ AddActivityWizardComponent, PropertyFormComponent, PropertyFormPropertyComponent ],
      providers: [
        NotifierService,
        { provide: AppSettingsService, useClass: MockAppSettingsService },
        { provide: ActivityService, useClass: MockActivityService },
        { provide: ConnectionService, useClass: MockConnectionService },
        { provide: VdbService, useClass: MockVdbService }
      ]
    })
      .compileComponents().then(() => {
      // nothing to do
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddActivityWizardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should be created", () => {
    console.log("========== [AddActivityWizardComponent] should be created");
    expect(component).toBeTruthy();
  });
});
