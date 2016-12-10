import {FormGroup} from "@angular/forms";

/**
 * Password match validator
 * @param passwordKey
 * @param confirmPasswordKey
 * @returns {(group:FormGroup)=>{[p: string]: any}}
 */

export function matchingPasswords(passwordKey: string, confirmPasswordKey: string) {
  return (group: FormGroup): {[key: string]: any} => {
    let password = group.controls[passwordKey];
    let confirmPassword = group.controls[confirmPasswordKey];

    if (password.value !== confirmPassword.value) {
      return {
        mismatchedPasswords: true
      };
    }
  }
}

