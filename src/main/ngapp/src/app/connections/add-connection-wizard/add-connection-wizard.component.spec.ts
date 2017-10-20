import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { FormGroup, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterTestingModule } from "@angular/router/testing";
import { CoreModule } from "@core/core.module";
import { PropertyFormPropertyComponent } from "@shared/property-form/property-form-property/property-form-property.component";
import { PropertyFormComponent } from "@shared/property-form/property-form.component";
import { SharedModule } from "@shared/shared.module";
import { PatternFlyNgModule, WizardConfig, WizardStepComponent } from "patternfly-ng";
import { AddConnectionWizardComponent } from "./add-connection-wizard.component";

describe("AddConnectionWizardComponent", () => {
  let component: AddConnectionWizardComponent;
  let fixture: ComponentFixture<AddConnectionWizardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ CoreModule, FormsModule, PatternFlyNgModule, ReactiveFormsModule, RouterTestingModule, SharedModule ],
      declarations: [ AddConnectionWizardComponent, FormGroup, PropertyFormComponent, PropertyFormPropertyComponent,
                      WizardConfig, WizardStepComponent ]
    })
    .compileComponents().then(() => {
      // nothing to do
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddConnectionWizardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should be created", () => {
    expect(component).toBeTruthy();
  });
});
