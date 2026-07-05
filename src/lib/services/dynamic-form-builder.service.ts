import { Injectable } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { DynamicFieldConfig } from '../models/dynamic-field-config';
import { mapValidators } from '../utils/validators.utils';

@Injectable({
  providedIn: 'root'
})
export class DynamicFormBuilderService {
  buildForm(fields: DynamicFieldConfig[]): FormGroup {
    const controls = fields.reduce<Record<string, FormControl>>((acc, field) => {
      acc[field.name] = this.createControl(field);

      return acc;
    }, {});

    return new FormGroup(controls);
  }

  ensureControls(form: FormGroup, fields: DynamicFieldConfig[]): FormGroup {
    fields.forEach((field) => {
      const existingControl = form.get(field.name);

      if (existingControl) {
        return;
      }

      form.addControl(field.name, this.createControl(field));
    });

    return form;
  }

  patchInitialValues(form: FormGroup, fields: DynamicFieldConfig[]): void {
    const values = fields.reduce<Record<string, unknown>>((acc, field) => {
      acc[field.name] = field.initialValue ?? null;
      return acc;
    }, {});

    form.patchValue(values);
  }

  private createControl(field: DynamicFieldConfig): FormControl {
    return new FormControl(
      { value: field.initialValue ?? this.resolveInitialValue(field), disabled: field.disabled ?? false },
      {
        validators: [
          ...mapValidators(field.validators),
          ...(Array.isArray(field.controlValidators)
            ? field.controlValidators
            : field.controlValidators
              ? [field.controlValidators]
              : [])
        ],
        ...field.controlOptions
      }
    );
  }

  private resolveInitialValue(field: DynamicFieldConfig): unknown {
    if (field.type === 'checkbox') {
      if (field.options?.length) {
        return [];
      }

      return false;
    }

    return null;
  }
}
