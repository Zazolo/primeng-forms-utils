import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  SimpleChanges,
} from "@angular/core";
import { FormGroup, ReactiveFormsModule } from "@angular/forms";
import {
  DynamicErrorTranslations,
  DynamicFieldConfig,
} from "../models/dynamic-field-config";
import { DynamicFormBuilderService } from "../services/dynamic-form-builder.service";
import { defaultDynamicErrorTranslations } from "../utils/error-message.utils";
import { DynamicFieldComponent } from "./dynamic-field.component";

@Component({
  selector: "pfu-dynamic-form",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DynamicFieldComponent],
  template: `
    <div class="pfu-form" [formGroup]="resolvedForm">
      <div class="pfu-grid">
        <pfu-dynamic-field
          *ngFor="let field of fields; trackBy: trackByFieldName"
          [form]="resolvedForm"
          [field]="field"
          [errorTranslations]="errorTranslations"
        />
      </div>
    </div>
  `,
  styles: [
    `
      .pfu-form {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        width: 100%;
      }

      .pfu-grid {
        display: grid;
        grid-template-columns: repeat(12, minmax(0, 1fr));
        gap: 0.5rem;
        width: 100%;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DynamicFormComponent implements OnChanges {
  @Input() form?: FormGroup;
  @Input({ required: true }) fields: DynamicFieldConfig[] = [];
  @Input() errorTranslations: DynamicErrorTranslations =
    defaultDynamicErrorTranslations;

  resolvedForm: FormGroup = new FormGroup({});

  constructor(private readonly formBuilder: DynamicFormBuilderService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["fields"] || changes["form"]) {
      this.resolvedForm = this.form
        ? this.formBuilder.ensureControls(this.form, this.fields)
        : this.formBuilder.buildForm(this.fields);
    }
  }

  trackByFieldName(_: number, field: DynamicFieldConfig): string {
    return field.name;
  }
}
