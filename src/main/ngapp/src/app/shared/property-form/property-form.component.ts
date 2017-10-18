import { Component, Input, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";

import {ObjectUtils} from "@core/utils/object-utils";
import { PropertyDefinition } from "@shared/property-form/property-definition.model";

@Component({
  selector: "app-property-form",
  templateUrl: "./property-form.component.html",
  providers: [ ]
})
export class PropertyFormComponent implements OnInit {

  @Input() public formProperties: Array<PropertyDefinition<any>> = [];
  public form: FormGroup;

  constructor( ) {
    // Nothing to do
  }

  public updateForm(): void {
    this.form = this.toFormGroup(this.formProperties);
  }

  public ngOnInit(): void {
    this.form = this.toFormGroup(this.formProperties);
  }

  public setFormProperties( props: Array<PropertyDefinition<any>> ): void {
    this.formProperties = props;
  }

  /*
   * Get the properties from the form that have values that aren't default values
   */
  public get propertyValuesNonDefault(): Map<string, string> {
    const propertyMap: Map<string, string> = new Map<string, string>();
    for (const property of this.formProperties) {
      const theValue = this.form.controls[property.getId()].value;
      if (!ObjectUtils.isNullOrUndefined(theValue)) {
        if (typeof theValue === "string" && theValue.length > 0) {
          if (theValue !== property.theDefaultValue) {
            propertyMap.set(property.getId(), theValue);
          }
        } else if (typeof theValue === "boolean") {
          if (theValue.toString() !== property.theDefaultValue) {
            propertyMap.set(property.getId(), theValue.toString());
          }
        }
      }
    }
    return propertyMap;
  }

  /*
   * Get the property value
   */
  public getPropertyValue(name: string): string {
    const theValue = this.form.controls[name].value;
    if (typeof theValue === "string") {
      return theValue;
    } else {
      return theValue.toString();
    }
  }

  /*
  NOTE:  The appropriate Validators for properties are applied in this function.  Angular has a number of built-in
  validators.  For a complete listing of the built-in validators, go here : https://angular.io/api/forms/Validators
   */
  private toFormGroup(properties: Array<PropertyDefinition<any>> ): FormGroup {
    const group: any = {};

    properties.forEach((property) => {

      // Determine the validators for each property, based on the property characteristics
      const propValidators = [];
      // Validator if required
      if (property.isRequired()) {
        propValidators.push(Validators.required);
      }

      // Numeric max validators
      if (property.getTypeClassName() === "java.lang.Long") {
        propValidators.push(Validators.max(9223372036854775807));
      } else if (property.getTypeClassName() === "java.lang.Integer") {
        propValidators.push(Validators.max(2147483647));
      }

      group[property.getId()] = new FormControl(property.getValue() || "", propValidators );
    });
    return new FormGroup(group);
  }

}
