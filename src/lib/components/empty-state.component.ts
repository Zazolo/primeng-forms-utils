import { ChangeDetectionStrategy, Component, Input } from "@angular/core";

@Component({
  selector: "pfu-empty-state",
  standalone: true,
  template: `
    <div class="pfu-empty-state" role="status">
      <div class="pfu-empty-state-icon" aria-hidden="true">
        <span class="pi pi-inbox"></span>
      </div>
      <p>{{ message }}</p>
    </div>
  `,
  styles: [
    `
      .pfu-empty-state {
        display: flex;
        width: 100%;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 1.5rem;
        border: 1px dashed #cbd5e1;
        border-radius: 6px;
        background: #f8fafc;
        color: #64748b;
        text-align: center;
      }

      .pfu-empty-state-icon {
        display: flex;
        height: 128px;
        align-items: center;
        justify-content: center;
        color: #0f172a;
      }

      .pfu-empty-state-icon .pi {
        font-size: 4rem;
      }

      .pfu-empty-state p {
        margin: 0;
        font-size: 0.95rem;
        font-weight: 600;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmptyStateComponent {
  @Input({ required: true }) message!: string;
}
