import { CommonModule, JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { TagModule } from 'primeng/tag';
import { DynamicFormComponent } from 'primeng-forms-utils';
import {
  showcaseErrorTranslations,
  showcaseFields,
  showcaseInitialValue
} from './showcase-form.config';

@Component({
  selector: 'demo-root',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    JsonPipe,
    ButtonModule,
    CardModule,
    DividerModule,
    TagModule,
    DynamicFormComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  readonly fields = showcaseFields;
  readonly errorTranslations = showcaseErrorTranslations;
  readonly submittedPayload = signal<Record<string, unknown> | null>(null);

  readonly featureItems = [
    'Renderer unico para text, money, percent, enum, date, radio, checkbox e image.',
    'Grid de 12 colunas com mistura de labels acima e ao lado.',
    'Payload inspecionavel em tempo real para validar formatos e estados.'
  ];

  readonly form = new FormGroup({});
  readonly livePayload = computed(() => this.form.getRawValue());

  applyPreset(): void {
    this.form.reset(showcaseInitialValue);
    this.submittedPayload.set(null);
  }

  clearForm(): void {
    this.form.reset();
    this.submittedPayload.set(null);
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submittedPayload.set(this.form.getRawValue() as Record<string, unknown>);
  }
}
