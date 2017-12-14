import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { ActivityService } from "@activities/shared/activity.service";
import { MockActivityService } from "@activities/shared/mock-activity.service";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterTestingModule } from "@angular/router/testing";
import { ConnectionService } from "@connections/shared/connection.service";
import { MockConnectionService } from "@connections/shared/mock-connection.service";
import { CoreModule } from "@core/core.module";
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
        { provide: ActivityService, useClass: MockActivityService },
        { provide: ConnectionService, useClass: MockConnectionService }
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
