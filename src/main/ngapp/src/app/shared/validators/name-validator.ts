import {AbstractControl} from "@angular/forms";

// TODO this is a sample validator.
export function validateName(control: AbstractControl): any {
  if (!control.value.startsWith("a")) {
    return { validName: control.value };
  }
  return null;
}
