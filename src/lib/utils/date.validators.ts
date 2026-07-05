import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { toUtcDayStamp, utcTodayStamp } from './date-value.utils';

export function utcDateNotBeforeTodayValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const valueStamp = toUtcDayStamp(control.value);
    if (valueStamp === null) {
      return null;
    }

    const todayStamp = utcTodayStamp();
    return valueStamp < todayStamp
      ? { utcDateNotBeforeToday: { minDate: new Date(todayStamp).toISOString(), actual: control.value } }
      : null;
  };
}

export function utcDateNotAfterTodayValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const valueStamp = toUtcDayStamp(control.value);
    if (valueStamp === null) {
      return null;
    }

    const todayStamp = utcTodayStamp();
    return valueStamp > todayStamp
      ? { utcDateNotAfterToday: { maxDate: new Date(todayStamp).toISOString(), actual: control.value } }
      : null;
  };
}

export function utcDateMinValidator(minDate: string | Date): ValidatorFn {
  const minStamp = toUtcDayStamp(minDate);

  return (control: AbstractControl): ValidationErrors | null => {
    const valueStamp = toUtcDayStamp(control.value);
    if (valueStamp === null || minStamp === null) {
      return null;
    }

    return valueStamp < minStamp
      ? { utcDateMin: { minDate: new Date(minStamp).toISOString(), actual: control.value } }
      : null;
  };
}

export function utcDateMaxValidator(maxDate: string | Date): ValidatorFn {
  const maxStamp = toUtcDayStamp(maxDate);

  return (control: AbstractControl): ValidationErrors | null => {
    const valueStamp = toUtcDayStamp(control.value);
    if (valueStamp === null || maxStamp === null) {
      return null;
    }

    return valueStamp > maxStamp
      ? { utcDateMax: { maxDate: new Date(maxStamp).toISOString(), actual: control.value } }
      : null;
  };
}
