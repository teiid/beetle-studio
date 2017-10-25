import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import {FormBuilder, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import { FormGroup } from "@angular/forms";
import { PropertyDefinition } from "@shared/property-form/property-definition.model";
import { PropertyFormPropertyComponent } from "./property-form-property.component";

describe("PropertyFormPropertyComponent", () => {
  let component: PropertyFormPropertyComponent;
  let fixture: ComponentFixture<PropertyFormPropertyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, ReactiveFormsModule ],
      declarations: [ PropertyFormPropertyComponent ],
      providers: [ FormBuilder ]
    })
    .compileComponents().then(() => {
      // nothing to do
    });
  }));

  // TODO: Figure out how to setup this test
  beforeEach(() => {
    fixture = TestBed.createComponent(PropertyFormPropertyComponent);
    component = fixture.componentInstance;
    component.setPropertyDefinition(new PropertyDefinition());
    const fb = new FormBuilder();
    const fg: FormGroup = fb.group({
      name: ["name", Validators.required]
    });
    component.setFormGroup(fg);
    fixture.detectChanges();
  });

  // it("should be created", () => {
  //   expect(component).toBeTruthy();
  // });
});
