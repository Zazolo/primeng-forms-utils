import { ValidationErrors } from '@angular/forms';
import {
  DynamicErrorTranslations,
  DynamicFieldConfig
} from '../models/dynamic-field-config';

export const defaultDynamicErrorTranslations: DynamicErrorTranslations = {
  required: 'Campo obrigatorio.',
  email: 'Informe um e-mail valido.',
  min: ({ errorValue }) => `Valor minimo permitido: ${readNumericErrorValue(errorValue, 'min')}.`,
  max: ({ errorValue }) => `Valor maximo permitido: ${readNumericErrorValue(errorValue, 'max')}.`,
  minlength: ({ errorValue }) =>
    `Quantidade minima de caracteres: ${readNumericErrorValue(errorValue, 'requiredLength')}.`,
  maxlength: ({ errorValue }) =>
    `Quantidade maxima de caracteres: ${readNumericErrorValue(errorValue, 'requiredLength')}.`,
  pattern: 'Formato invalido.',
  utcDateNotBeforeToday: 'A data nao pode ser inferior a hoje.',
  utcDateNotAfterToday: 'A data nao pode ser superior a hoje.',
  utcDateMin: 'A data informada e inferior ao minimo permitido.',
  utcDateMax: 'A data informada e superior ao maximo permitido.'
};

export function resolveErrorMessage(
  field: DynamicFieldConfig,
  errors: ValidationErrors | null | undefined,
  translations: DynamicErrorTranslations = defaultDynamicErrorTranslations
): string | null {
  if (!errors) {
    return null;
  }

  const [firstKey] = Object.keys(errors);
  if (!firstKey) {
    return null;
  }

  const customMessage = field.validators?.find((validator) => {
    const normalizedType = validator.type === 'minLength' ? 'minlength' :
      validator.type === 'maxLength' ? 'maxlength' :
      validator.type;

    return normalizedType === firstKey;
  })?.message;

  if (customMessage) {
    return customMessage;
  }

  const translation = translations[firstKey];
  if (typeof translation === 'function') {
    return translation({
      field,
      errorKey: firstKey,
      errorValue: errors[firstKey],
      errors
    });
  }

  return translation ?? 'Campo invalido.';
}

function readNumericErrorValue(errorValue: unknown, key: string): number | string {
  if (typeof errorValue === 'object' && errorValue !== null && key in errorValue) {
    const value = (errorValue as Record<string, unknown>)[key];
    if (typeof value === 'number' || typeof value === 'string') {
      return value;
    }
  }

  return '';
}
