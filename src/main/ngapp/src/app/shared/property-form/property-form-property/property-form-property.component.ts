import { Component, Input } from "@angular/core";
import {AbstractControl, FormGroup} from "@angular/forms";

import { PropertyDefinition } from "@shared/property-form/property-definition.model";

@Component({
  selector: "app-form-property",
  templateUrl: "./property-form-property.component.html"
})

export class PropertyFormPropertyComponent {
  @Input() private property: PropertyDefinition<any>;
  @Input() private form: FormGroup;

  /*
   * Return the property valid state
   */
  get isValid(): boolean {
    return this.form.controls[this.property.getId()].valid;
  }

  /*
   * Return the property error message, if the property is invalid
   * The first error found is returned
   */
  get validationErrorMessage(): string {
    const control: AbstractControl = this.form.controls[this.property.getId()];
    if (control.invalid) {
      // The first error found is returned
      if (control.errors.required) {
        return this.property.getId() + " is a required property";
      } else if (control.errors.validName) {
        return this.property.getId() + " is an invalid name";
      } else if (control.errors.max) {
        return this.property.getId() + " exceeds the max allowable value";
      }
    }
    return "";
  }
}
