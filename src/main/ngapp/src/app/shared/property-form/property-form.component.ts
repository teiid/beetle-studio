import { Component, Input, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";

import { PropertyDefinition } from "@shared/property-form/property-definition.model";

@Component({
  selector: "app-property-form",
  templateUrl: "./property-form.component.html",
  providers: [ ]
})
export class PropertyFormComponent implements OnInit {

  @Input() private formProperties: Array<PropertyDefinition<any>> = [];
  private form: FormGroup;
  private payLoad = "";

  constructor( ) {
    // Nothing to do
  }

  public updateForm(): void {
    this.form = this.toFormGroup(this.formProperties);
  }

  public ngOnInit(): void {
    this.form = this.toFormGroup(this.formProperties);
  }

  public onSubmit(): void {
    this.payLoad = JSON.stringify(this.form.value);
  }

  public setFormProperties( props: Array<PropertyDefinition<any>> ): void {
    this.formProperties = props;
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
