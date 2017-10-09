import {AbstractControl, ValidatorFn} from "@angular/forms";

// TODO this is a sample validator.
export function ValidateName(control: AbstractControl): any {
  if (!control.value.startsWith("a")) {
    return { validName: control.value };
  }
  return null;
}
