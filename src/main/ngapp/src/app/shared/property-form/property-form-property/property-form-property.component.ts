/**
 * @license
 * Copyright 2017 JBoss Inc
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Component, Input } from "@angular/core";
import { AbstractControl, FormGroup } from "@angular/forms";

import { PropertyDefinition } from "@shared/property-form/property-definition.model";
import { PropertyControlType } from "@shared/property-form/property-control-type.enum";

@Component({
  selector: "app-form-property",
  templateUrl: "./property-form-property.component.html"
})

export class PropertyFormPropertyComponent {

  public controlType = PropertyControlType; // need local ref of enum for html to use

  @Input() public property: PropertyDefinition<any>;
  @Input() public form: FormGroup;

  public setPropertyDefinition(prop: PropertyDefinition<any>): void {
    this.property = prop;
  }

  public setFormGroup(fg: FormGroup): void {
    this.form = fg;
  }

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
