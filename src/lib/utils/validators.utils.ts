import { ValidatorFn, Validators } from '@angular/forms';
import { DynamicValidatorConfig } from '../models/dynamic-field-config';

export function mapValidators(validators: DynamicValidatorConfig[] = []): ValidatorFn[] {
  return validators.map((validator) => {
    switch (validator.type) {
      case 'required':
        return Validators.required;
      case 'email':
        return Validators.email;
      case 'min':
        return Validators.min(Number(validator.value ?? 0));
      case 'max':
        return Validators.max(Number(validator.value ?? 0));
      case 'minLength':
        return Validators.minLength(Number(validator.value ?? 0));
      case 'maxLength':
        return Validators.maxLength(Number(validator.value ?? 0));
      case 'pattern':
        return Validators.pattern(String(validator.value ?? ''));
      default:
        return Validators.nullValidator;
    }
  });
}
