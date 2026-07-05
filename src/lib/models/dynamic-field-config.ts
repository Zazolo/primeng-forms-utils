import { AbstractControlOptions, ValidationErrors, ValidatorFn } from '@angular/forms';

export type DynamicFieldType =
  | 'text'
  | 'number'
  | 'money'
  | 'percent'
  | 'textarea'
  | 'select'
  | 'enum'
  | 'image'
  | 'date'
  | 'radio'
  | 'checkbox';

export type DynamicOptionLayout = 'vertical' | 'horizontal';

export type DynamicValidatorType =
  | 'required'
  | 'email'
  | 'min'
  | 'max'
  | 'minLength'
  | 'maxLength'
  | 'pattern';

export type DynamicLabelPosition = 'top' | 'side';
export type DynamicFieldColSpan = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

export interface DynamicFieldOption {
  label: string;
  value: unknown;
}

export interface DynamicEnumOptionConfig {
  enumValue: string | number;
  label: string;
  icon?: string;
}

export interface DynamicEnumConfig {
  values: Record<string, string | number>;
  showIcons?: boolean;
  options: DynamicEnumOptionConfig[];
}

export type DynamicImageVariant = 'square' | 'avatar';

export interface DynamicImageConfig {
  variant: DynamicImageVariant;
  accept?: string;
  emptyLabel?: string;
  changeLabel?: string;
}

export interface DynamicMoneyConfig {
  currency?: string;
  locale?: string;
  mode?: 'currency' | 'decimal';
  currencyDisplay?: 'symbol' | 'code' | 'name';
  minFractionDigits?: number;
  maxFractionDigits?: number;
  prefix?: string;
  suffix?: string;
}

export interface DynamicPercentConfig {
  minFractionDigits?: number;
  maxFractionDigits?: number;
  prefix?: string;
  suffix?: string;
}

export interface DynamicDateConfig {
  dateFormat?: string;
  placeholder?: string;
  showIcon?: boolean;
  utcMode?: 'startOfDay';
}

export interface DynamicFieldAppearanceConfig {
  borderColor?: string;
  hoverBorderColor?: string;
  focusBorderColor?: string;
  invalidBorderColor?: string;
  backgroundColor?: string;
  textColor?: string;
  placeholderColor?: string;
  focusRingColor?: string;
  borderRadius?: string;
}

export interface DynamicValidatorConfig {
  type: DynamicValidatorType;
  value?: number | string | RegExp;
  message?: string;
}

export interface DynamicErrorMessageContext {
  field: DynamicFieldConfig;
  errorKey: string;
  errorValue: unknown;
  errors: ValidationErrors;
}

export type DynamicErrorTranslationValue =
  | string
  | ((context: DynamicErrorMessageContext) => string);

export type DynamicErrorTranslations = Record<string, DynamicErrorTranslationValue>;

export interface DynamicFieldConfig {
  name: string;
  type: DynamicFieldType;
  label: string;
  colSpan?: DynamicFieldColSpan;
  labelPosition?: DynamicLabelPosition;
  placeholder?: string;
  hint?: string;
  quickHint?: string;
  initialValue?: unknown;
  disabled?: boolean;
  readonly?: boolean;
  hidden?: boolean;
  inputId?: string;
  options?: DynamicFieldOption[];
  optionLayout?: DynamicOptionLayout;
  enumConfig?: DynamicEnumConfig;
  imageConfig?: DynamicImageConfig;
  moneyConfig?: DynamicMoneyConfig;
  percentConfig?: DynamicPercentConfig;
  dateConfig?: DynamicDateConfig;
  appearance?: DynamicFieldAppearanceConfig;
  validators?: DynamicValidatorConfig[];
  controlValidators?: ValidatorFn | ValidatorFn[] | null;
  controlOptions?: AbstractControlOptions | null;
  cssClass?: string;
}
