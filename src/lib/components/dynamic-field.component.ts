import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChanges,
} from "@angular/core";
import {
  AbstractControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from "@angular/forms";
import { Subscription } from "rxjs";
import { CheckboxModule } from "primeng/checkbox";
import { DatePickerModule } from "primeng/datepicker";
import { InputNumberModule } from "primeng/inputnumber";
import { InputTextModule } from "primeng/inputtext";
import { RadioButtonModule } from "primeng/radiobutton";
import { SelectModule } from "primeng/select";
import { TextareaModule } from "primeng/textarea";
import { TooltipModule } from "primeng/tooltip";
import {
  DynamicErrorTranslations,
  DynamicFieldAppearanceConfig,
  DynamicFieldColSpan,
  DynamicFieldConfig,
  DynamicFieldOption,
} from "../models/dynamic-field-config";
import {
  defaultDynamicErrorTranslations,
  resolveErrorMessage,
} from "../utils/error-message.utils";
import {
  parseUtcDateValue,
  toUtcStartOfDayIso,
} from "../utils/date-value.utils";

@Component({
  selector: "pfu-dynamic-field",
  standalone: true,
  host: {
    class: "pfu-dynamic-field-host",
    style: "display: contents;",
  },
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CheckboxModule,
    DatePickerModule,
    InputNumberModule,
    InputTextModule,
    RadioButtonModule,
    SelectModule,
    TextareaModule,
    TooltipModule,
  ],
  template: `
    <div
      [ngClass]="fieldClassList"
      [ngStyle]="appearanceStyleVars"
      [style.--pfu-field-column-span]="columnSpan"
      [formGroup]="form"
      *ngIf="!field.hidden"
    >
      <div class="pfu-label-wrapper" *ngIf="showPrimaryLabel">
        <label class="pfu-label" [attr.for]="field.inputId ?? field.name">
          <span class="pfu-required-mark" *ngIf="isRequired" aria-hidden="true"
            >*</span
          >
          <span>{{ field.label }}</span>
        </label>
        <button
          *ngIf="field.quickHint"
          class="pfu-info-button"
          type="button"
          [pTooltip]="field.quickHint"
          tooltipPosition="top"
          aria-label="Ajuda do campo"
        >
          <span class="pi pi-info-circle" aria-hidden="true"></span>
        </button>
      </div>

      <div class="pfu-control">
        <ng-container [ngSwitch]="field.type">
          <input
            *ngSwitchCase="'text'"
            pInputText
            [id]="field.inputId ?? field.name"
            [formControlName]="field.name"
            [placeholder]="field.placeholder ?? ''"
            [type]="field.inputType ?? 'text'"
            [readOnly]="field.readonly ?? false"
          />

          <p-input-number
            *ngSwitchCase="'number'"
            [inputId]="field.inputId ?? field.name"
            [formControlName]="field.name"
            [placeholder]="field.placeholder ?? ''"
            [readonly]="field.readonly ?? false"
            [useGrouping]="false"
          />

          <p-input-number
            *ngSwitchCase="'money'"
            [inputId]="field.inputId ?? field.name"
            [formControlName]="field.name"
            [placeholder]="field.placeholder ?? ''"
            [readonly]="field.readonly ?? false"
            [mode]="resolvedMoneyMode"
            [currency]="field.moneyConfig?.currency ?? 'BRL'"
            [locale]="field.moneyConfig?.locale ?? 'pt-BR'"
            [currencyDisplay]="field.moneyConfig?.currencyDisplay ?? 'symbol'"
            [minFractionDigits]="field.moneyConfig?.minFractionDigits ?? 2"
            [maxFractionDigits]="field.moneyConfig?.maxFractionDigits ?? 2"
            [prefix]="field.moneyConfig?.prefix"
            [suffix]="field.moneyConfig?.suffix"
          />

          <p-input-number
            *ngSwitchCase="'percent'"
            [inputId]="field.inputId ?? field.name"
            [formControlName]="field.name"
            [placeholder]="field.placeholder ?? ''"
            [readonly]="field.readonly ?? false"
            [mode]="'decimal'"
            [minFractionDigits]="field.percentConfig?.minFractionDigits ?? 2"
            [maxFractionDigits]="field.percentConfig?.maxFractionDigits ?? 2"
            [prefix]="field.percentConfig?.prefix"
            [suffix]="field.percentConfig?.suffix ?? '%'"
          />

          <textarea
            *ngSwitchCase="'textarea'"
            pTextarea
            [id]="field.inputId ?? field.name"
            [formControlName]="field.name"
            [placeholder]="field.placeholder ?? ''"
            [readOnly]="field.readonly ?? false"
            rows="4"
          ></textarea>

          <p-select
            *ngSwitchCase="'select'"
            [inputId]="field.inputId ?? field.name"
            [formControlName]="field.name"
            [options]="field.options ?? []"
            [placeholder]="field.placeholder ?? 'Selecione'"
            optionLabel="label"
            optionValue="value"
          />

          <p-select
            *ngSwitchCase="'enum'"
            [inputId]="field.inputId ?? field.name"
            [formControlName]="field.name"
            [options]="enumOptions"
            [placeholder]="field.placeholder ?? 'Selecione'"
            optionLabel="label"
            optionValue="value"
          >
            <ng-template #selectedItem let-selectedOption>
              <div class="pfu-option" *ngIf="selectedOption">
                <span
                  *ngIf="showEnumIcons && selectedOption.icon"
                  [class]="selectedOption.icon"
                  aria-hidden="true"
                ></span>
                <span>{{ selectedOption.label }}</span>
              </div>
              <span class="pfu-placeholder" *ngIf="!selectedOption">
                {{ field.placeholder ?? "Selecione" }}
              </span>
            </ng-template>

            <ng-template #item let-option>
              <div class="pfu-option">
                <span
                  *ngIf="showEnumIcons && option.icon"
                  [class]="option.icon"
                  aria-hidden="true"
                ></span>
                <span>{{ option.label }}</span>
              </div>
            </ng-template>
          </p-select>

          <p-datepicker
            *ngSwitchCase="'date'"
            [inputId]="field.inputId ?? field.name"
            [ngModel]="dateInputValue"
            [ngModelOptions]="{ standalone: true }"
            (ngModelChange)="onDateSelected($event)"
            [placeholder]="
              field.dateConfig?.placeholder ?? field.placeholder ?? ''
            "
            [dateFormat]="field.dateConfig?.dateFormat ?? 'dd/mm/yy'"
            [showIcon]="field.dateConfig?.showIcon ?? true"
          />

          <div [ngClass]="optionGroupClassList" *ngSwitchCase="'radio'">
            <div
              class="pfu-choice-item"
              *ngFor="
                let option of field.options ?? [];
                let optionIndex = index
              "
            >
              <p-radio-button
                [inputId]="resolveOptionInputId(optionIndex)"
                [formControlName]="field.name"
                [value]="option.value"
              />
              <label [attr.for]="resolveOptionInputId(optionIndex)">{{
                option.label
              }}</label>
            </div>
          </div>

          <div class="pfu-image-field" *ngSwitchCase="'image'">
            <div
              [ngClass]="[
                'pfu-image-preview',
                imageVariantClass,
                previewSource
                  ? 'pfu-image-preview-filled'
                  : 'pfu-image-preview-empty',
              ]"
            >
              <img
                *ngIf="previewSource"
                [src]="previewSource"
                [alt]="field.label"
                class="pfu-image-preview-media"
              />
              <span class="pfu-image-preview-text" *ngIf="!previewSource">
                {{
                  field.imageConfig?.emptyLabel ?? "Nenhuma imagem selecionada"
                }}
              </span>
            </div>

            <label
              class="pfu-image-upload-button"
              [attr.for]="field.inputId ?? field.name"
            >
              {{ field.imageConfig?.changeLabel ?? "Selecionar imagem" }}
            </label>

            <input
              class="pfu-image-input"
              type="file"
              [id]="field.inputId ?? field.name"
              [accept]="field.imageConfig?.accept ?? 'image/*'"
              [disabled]="field.disabled ?? false"
              (change)="onImageSelected($event)"
            />
          </div>

          <div
            [ngClass]="isCheckboxGroup ? optionGroupClassList : 'pfu-checkbox'"
            *ngSwitchCase="'checkbox'"
          >
            <ng-container *ngIf="isCheckboxGroup">
              <div
                class="pfu-choice-item"
                *ngFor="
                  let option of field.options ?? [];
                  let optionIndex = index
                "
              >
                <p-checkbox
                  [inputId]="resolveOptionInputId(optionIndex)"
                  [value]="option.value"
                  [binary]="false"
                  [ngModel]="checkboxGroupValue"
                  [ngModelOptions]="{ standalone: true }"
                  (ngModelChange)="onCheckboxGroupModelChange($event)"
                />
                <label [attr.for]="resolveOptionInputId(optionIndex)">{{
                  option.label
                }}</label>
              </div>
            </ng-container>

            <ng-container *ngIf="!isCheckboxGroup">
              <p-checkbox
                [inputId]="field.inputId ?? field.name"
                [formControlName]="field.name"
                [binary]="true"
              />
              <label [attr.for]="field.inputId ?? field.name">
                <span
                  class="pfu-required-mark"
                  *ngIf="isRequired"
                  aria-hidden="true"
                  >*</span
                >
                <span>{{ field.placeholder ?? field.label }}</span>
              </label>
              <button
                *ngIf="field.quickHint"
                class="pfu-info-button"
                type="button"
                [pTooltip]="field.quickHint"
                tooltipPosition="top"
                aria-label="Ajuda do campo"
              >
                <span class="pi pi-info-circle" aria-hidden="true"></span>
              </button>
            </ng-container>
          </div>
        </ng-container>

        <small class="pfu-hint" *ngIf="field.hint">{{ field.hint }}</small>
        <small class="pfu-error" *ngIf="errorMessage">{{ errorMessage }}</small>
      </div>
    </div>
  `,
  styles: [
    `
      .pfu-label-wrapper {
        display: inline-flex;
        align-items: center;
        gap: 0.35rem;
      }

      .pfu-field {
        display: flex;
        align-items: flex-start;
        gap: 0.5rem;
        min-width: 0;
        grid-column: span var(--pfu-field-column-span, 6);
      }

      .pfu-field-top {
        flex-direction: column;
      }

      .pfu-field-side {
        flex-direction: row;
      }

      @media (max-width: 767px) {
        .pfu-field {
          grid-column: span 12;
        }

        .pfu-field-side {
          flex-direction: column;
        }
      }

      .pfu-field-side .pfu-label-wrapper {
        width: 12rem;
        min-height: 2.5rem;
        padding-top: 0.5rem;
      }

      .pfu-control {
        display: flex;
        flex: 1 1 auto;
        flex-direction: column;
        gap: 0.5rem;
        width: 100%;
      }

      .pfu-label {
        display: inline-flex;
        align-items: center;
        gap: 0.25rem;
        font-weight: 600;
      }

      .pfu-required-mark {
        color: #b91c1c;
        font-weight: 700;
      }

      .pfu-info-button {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 1.25rem;
        height: 1.25rem;
        padding: 0;
        border: 0;
        background: transparent;
        color: #475569;
        cursor: pointer;
      }

      .pfu-info-button:hover {
        color: #0f172a;
      }

      .pfu-checkbox {
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }

      .pfu-choice-group {
        display: flex;
        gap: 0.75rem;
      }

      .pfu-choice-group-vertical {
        flex-direction: column;
      }

      .pfu-choice-group-horizontal {
        flex-direction: row;
        flex-wrap: wrap;
      }

      .pfu-choice-item {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
      }

      .pfu-image-field {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
      }

      .pfu-image-preview {
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
        background: #f8fafc;
        border: 1px dashed #cbd5e1;
      }

      .pfu-image-preview-square {
        width: 9rem;
        height: 9rem;
        border-radius: 0.75rem;
      }

      .pfu-image-preview-avatar {
        width: 6rem;
        height: 6rem;
        border-radius: 9999px;
      }

      .pfu-image-preview-filled {
        border-style: solid;
      }

      .pfu-image-preview-media {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .pfu-image-preview-text {
        padding: 0.75rem;
        text-align: center;
        font-size: 0.875rem;
        color: #64748b;
      }

      .pfu-image-upload-button {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-height: 2.5rem;
        width: fit-content;
        padding: 0.5rem 0.875rem;
        border-radius: 0.5rem;
        background: #0f172a;
        color: #ffffff;
        cursor: pointer;
      }

      .pfu-image-input {
        display: none;
      }

      .pfu-option {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
      }

      .pfu-placeholder {
        color: #64748b;
      }

      .pfu-field-side .pfu-checkbox {
        min-height: 2.5rem;
      }

      .pfu-hint {
        color: #64748b;
      }

      .pfu-error {
        color: #b91c1c;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DynamicFieldComponent implements OnDestroy {
  @Input({ required: true }) form!: FormGroup;
  @Input({ required: true }) field!: DynamicFieldConfig;
  @Input() errorTranslations: DynamicErrorTranslations =
    defaultDynamicErrorTranslations;

  private readonly objectUrlByFieldName = new Map<string, string>();
  private controlSubscription?: Subscription;
  private cachedFieldClassList: string[] = [];
  private cachedOptionGroupClassList: string[] = [];
  private cachedEnumOptions: Array<DynamicFieldOption & { icon?: string }> = [];
  private cachedAppearanceStyleVars: Record<string, string> = {};
  private cachedPreviewSource: string | null = null;
  private cachedDateInputValue: Date | null = null;

  constructor(private readonly changeDetectorRef: ChangeDetectorRef) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["field"]) {
      this.cachedFieldClassList = [
        "pfu-field",
        this.isSideLabel ? "pfu-field-side" : "pfu-field-top",
        ...(this.field.cssClass ? [this.field.cssClass] : []),
      ];

      this.cachedOptionGroupClassList = [
        "pfu-choice-group",
        this.field.optionLayout === "horizontal"
          ? "pfu-choice-group-horizontal"
          : "pfu-choice-group-vertical",
      ];

      this.cachedEnumOptions = this.buildEnumOptions();
      this.cachedAppearanceStyleVars = this.buildAppearanceStyleVars(
        this.field.appearance,
      );
    }

    if (changes["form"] || changes["field"]) {
      this.bindControl();
      this.refreshControlDerivedState();
    }
  }

  get fieldClassList(): string[] {
    return this.cachedFieldClassList;
  }

  get isSideLabel(): boolean {
    return this.field.labelPosition === "side";
  }

  get columnSpan(): DynamicFieldColSpan {
    return this.field.colSpan ?? 6;
  }

  get isRequired(): boolean {
    return (
      this.field.validators?.some(
        (validator) => validator.type === "required",
      ) ?? false
    );
  }

  get showPrimaryLabel(): boolean {
    return this.field.type !== "checkbox" || this.isCheckboxGroup;
  }

  get isCheckboxGroup(): boolean {
    return (
      this.field.type === "checkbox" && Boolean(this.field.options?.length)
    );
  }

  get optionGroupClassList(): string[] {
    return this.cachedOptionGroupClassList;
  }

  get errorMessage(): string | null {
    const control = this.form.get(this.field.name);

    if (!control || !control.invalid || !(control.dirty || control.touched)) {
      return null;
    }

    return resolveErrorMessage(
      this.field,
      control.errors,
      this.errorTranslations,
    );
  }

  get enumOptions(): Array<DynamicFieldOption & { icon?: string }> {
    return this.cachedEnumOptions;
  }

  get appearanceStyleVars(): Record<string, string> {
    return this.cachedAppearanceStyleVars;
  }

  get showEnumIcons(): boolean {
    return (
      this.field.type === "enum" && Boolean(this.field.enumConfig?.showIcons)
    );
  }

  get previewSource(): string | null {
    return this.cachedPreviewSource;
  }

  get imageVariantClass(): string {
    return this.field.imageConfig?.variant === "avatar"
      ? "pfu-image-preview-avatar"
      : "pfu-image-preview-square";
  }

  get dateInputValue(): Date | null {
    return this.cachedDateInputValue;
  }

  get resolvedMoneyMode(): "currency" | "decimal" {
    return this.field.moneyConfig?.mode ?? "currency";
  }

  get checkboxGroupValue(): unknown[] {
    const controlValue = this.form.get(this.field.name)?.value;
    return Array.isArray(controlValue) ? controlValue : [];
  }

  onCheckboxGroupModelChange(value: unknown): void {
    const control = this.form.get(this.field.name);
    if (!control) {
      return;
    }

    control.setValue(Array.isArray(value) ? value : []);
    control.markAsDirty();
    control.markAsTouched();
    control.updateValueAndValidity();
  }

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;
    const control = this.form.get(this.field.name);

    if (!control) {
      return;
    }

    this.revokeObjectUrl(this.field.name);
    control.setValue(file);
    control.markAsDirty();
    control.markAsTouched();
    control.updateValueAndValidity();
    this.refreshControlDerivedState();
  }

  onDateSelected(value: Date | null): void {
    const control = this.form.get(this.field.name);
    if (!control) {
      return;
    }

    control.setValue(value ? toUtcStartOfDayIso(value) : null);
    control.markAsDirty();
    control.markAsTouched();
    control.updateValueAndValidity();
    this.refreshControlDerivedState();
  }

  ngOnDestroy(): void {
    this.controlSubscription?.unsubscribe();
    Array.from(this.objectUrlByFieldName.keys()).forEach((fieldName) => {
      this.revokeObjectUrl(fieldName);
    });
  }

  private bindControl(): void {
    this.controlSubscription?.unsubscribe();

    const control = this.resolveControl();
    if (!control) {
      return;
    }

    this.controlSubscription = control.valueChanges.subscribe(() => {
      this.refreshControlDerivedState();
    });
  }

  private refreshControlDerivedState(): void {
    const controlValue = this.resolveControl()?.value;

    if (this.field.type === "image") {
      this.cachedPreviewSource = this.resolvePreviewSource(controlValue);
    } else {
      this.cachedPreviewSource = null;
    }

    if (this.field.type === "date") {
      this.cachedDateInputValue = parseUtcDateValue(controlValue);
    } else {
      this.cachedDateInputValue = null;
    }

    this.changeDetectorRef.markForCheck();
  }

  private buildEnumOptions(): Array<DynamicFieldOption & { icon?: string }> {
    if (this.field.type !== "enum" || !this.field.enumConfig) {
      return [];
    }

    const enumEntries = new Set(
      this.resolveEnumValues(this.field.enumConfig.values),
    );

    return this.field.enumConfig.options
      .filter((option) => enumEntries.has(option.enumValue))
      .map((option) => ({
        label: option.label,
        value: option.enumValue,
        icon: option.icon,
      }));
  }

  private buildAppearanceStyleVars(
    appearance?: DynamicFieldAppearanceConfig,
  ): Record<string, string> {
    if (!appearance) {
      return {};
    }

    const styleVars: Record<string, string> = {};

    this.assignAppearanceVar(styleVars, appearance.borderColor, [
      "--p-inputtext-border-color",
      "--p-textarea-border-color",
      "--p-select-border-color",
    ]);
    this.assignAppearanceVar(styleVars, appearance.hoverBorderColor, [
      "--p-inputtext-hover-border-color",
      "--p-textarea-hover-border-color",
      "--p-select-hover-border-color",
    ]);
    this.assignAppearanceVar(styleVars, appearance.focusBorderColor, [
      "--p-inputtext-focus-border-color",
      "--p-textarea-focus-border-color",
      "--p-select-focus-border-color",
    ]);
    this.assignAppearanceVar(styleVars, appearance.invalidBorderColor, [
      "--p-inputtext-invalid-border-color",
      "--p-textarea-invalid-border-color",
      "--p-select-invalid-border-color",
    ]);
    this.assignAppearanceVar(styleVars, appearance.backgroundColor, [
      "--p-inputtext-background",
      "--p-textarea-background",
      "--p-select-background",
    ]);
    this.assignAppearanceVar(styleVars, appearance.textColor, [
      "--p-inputtext-color",
      "--p-textarea-color",
      "--p-select-color",
    ]);
    this.assignAppearanceVar(styleVars, appearance.placeholderColor, [
      "--p-inputtext-placeholder-color",
      "--p-textarea-placeholder-color",
      "--p-select-placeholder-color",
    ]);
    this.assignAppearanceVar(styleVars, appearance.focusRingColor, [
      "--p-inputtext-focus-ring-color",
      "--p-textarea-focus-ring-color",
      "--p-select-focus-ring-color",
      "--p-checkbox-focus-ring-color",
      "--p-radiobutton-focus-ring-color",
    ]);
    this.assignAppearanceVar(styleVars, appearance.borderRadius, [
      "--p-inputtext-border-radius",
      "--p-textarea-border-radius",
      "--p-select-border-radius",
    ]);

    return styleVars;
  }

  private assignAppearanceVar(
    styleVars: Record<string, string>,
    value: string | undefined,
    variableNames: string[],
  ): void {
    if (!value) {
      return;
    }

    variableNames.forEach((variableName) => {
      styleVars[variableName] = value;
    });
  }

  private resolvePreviewSource(controlValue: unknown): string | null {
    if (typeof controlValue === "string" && controlValue) {
      return controlValue;
    }

    if (this.isPreviewObject(controlValue)) {
      return controlValue.previewUrl;
    }

    if (controlValue instanceof File) {
      return this.ensureObjectUrl(this.field.name, controlValue);
    }

    return null;
  }

  private resolveControl(): AbstractControl | null {
    return this.form?.get(this.field.name) ?? null;
  }

  private resolveEnumValues(
    enumValues: Record<string, string | number>,
  ): Array<string | number> {
    const values = Object.values(enumValues);

    return values.filter((value) => {
      if (typeof value === "number") {
        return true;
      }

      return !(value in enumValues);
    });
  }

  resolveOptionInputId(index: number): string {
    return `${this.field.inputId ?? this.field.name}-${index}`;
  }

  private isPreviewObject(value: unknown): value is { previewUrl: string } {
    return (
      typeof value === "object" &&
      value !== null &&
      "previewUrl" in value &&
      typeof (value as { previewUrl?: unknown }).previewUrl === "string"
    );
  }

  private ensureObjectUrl(fieldName: string, file: File): string | null {
    const existingUrl = this.objectUrlByFieldName.get(fieldName);
    if (existingUrl) {
      return existingUrl;
    }

    if (
      typeof URL === "undefined" ||
      typeof URL.createObjectURL !== "function"
    ) {
      return null;
    }

    const objectUrl = URL.createObjectURL(file);
    this.objectUrlByFieldName.set(fieldName, objectUrl);
    return objectUrl;
  }

  private revokeObjectUrl(fieldName: string): void {
    const objectUrl = this.objectUrlByFieldName.get(fieldName);
    if (
      !objectUrl ||
      typeof URL === "undefined" ||
      typeof URL.revokeObjectURL !== "function"
    ) {
      return;
    }

    URL.revokeObjectURL(objectUrl);
    this.objectUrlByFieldName.delete(fieldName);
  }
}
