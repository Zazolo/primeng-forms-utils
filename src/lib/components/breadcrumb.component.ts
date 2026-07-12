import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterLink } from '@angular/router';
import { Subject, filter, takeUntil } from 'rxjs';

export interface BreadcrumbItem {
  label: string;
  icon?: string;
  url?: string;
}

@Component({
  selector: 'pfu-breadcrumb',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <header class="pfu-page-header">
      <div class="pfu-title-row">
        <h1 class="pfu-page-title">{{ pageTitle() }}</h1>
        <div class="pfu-actions"><ng-content select="[breadcrumb-actions]" /></div>
      </div>

      <nav class="pfu-breadcrumb" aria-label="Breadcrumb">
        <ol>
          @for (item of items(); track item.url ?? item.label; let last = $last) {
            <li>
              @if (!last && item.url) {
                <a [routerLink]="item.url">
                  @if (item.icon) { <span [class]="item.icon" aria-hidden="true"></span> }
                  <span>{{ item.label }}</span>
                </a>
              } @else {
                <span class="pfu-current" [attr.aria-current]="last ? 'page' : null">
                  @if (item.icon) { <span [class]="item.icon" aria-hidden="true"></span> }
                  <span>{{ item.label }}</span>
                </span>
              }
              @if (!last) { <span class="pi pi-chevron-right pfu-separator" aria-hidden="true"></span> }
            </li>
          }
        </ol>
      </nav>
    </header>
  `,
  styles: `
    :host {
      display: block;
      position: sticky;
      top: 0;
      z-index: var(--pfu-breadcrumb-z-index, 20);
      width: 100%;
      margin: 0;
    }
    .pfu-page-header { border: 1px solid #cbd5e1; border-radius: 6px; background: rgba(255,255,255,.9); padding: 1.25rem; box-shadow: 0 18px 38px rgba(15,23,42,.08); }
    .pfu-title-row { display: flex; align-items: center; justify-content: space-between; gap: 1rem; }
    .pfu-page-title { margin: 0; color: #0f172a; font-size: clamp(1.5rem, 3vw, 2rem); font-weight: 650; letter-spacing: -.035em; line-height: 1.2; }
    .pfu-actions { display: flex; align-items: center; justify-content: flex-end; gap: .5rem; }
    .pfu-breadcrumb { margin-top: .8rem; }
    ol { display: flex; flex-wrap: wrap; align-items: center; gap: .45rem; margin: 0; padding: 0; list-style: none; }
    li, a, .pfu-current { display: inline-flex; align-items: center; gap: .45rem; }
    a { color: #64748b; text-decoration: none; transition: color .15s ease; }
    a:hover { color: #334155; }
    .pfu-current { color: #334155; font-weight: 600; }
    .pfu-separator { color: #94a3b8; font-size: .65rem; }
    li { font-size: .82rem; }
    @media (max-width: 640px) { .pfu-title-row { align-items: flex-start; flex-direction: column; } .pfu-actions { width: 100%; justify-content: flex-start; } }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BreadcrumbComponent implements OnInit, OnDestroy {
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly destroy$ = new Subject<void>();

  readonly items = signal<BreadcrumbItem[]>([]);
  readonly pageTitle = signal('');

  ngOnInit(): void {
    this.updateItems();
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      takeUntil(this.destroy$),
    ).subscribe(() => this.updateItems());
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private updateItems(): void {
    const items: BreadcrumbItem[] = [];
    let route: ActivatedRoute | null = this.activatedRoute.root;
    let url = '';

    while (route) {
      const segment = route.snapshot.url.map((part) => part.path).join('/');
      if (segment) url += `/${segment}`;

      const label = route.snapshot.data['routeTitle'];
      if (typeof label === 'string' && label.trim()) {
        const icon = route.snapshot.data['routeIcon'];
        items.push({
          label,
          icon: typeof icon === 'string' && icon.trim() ? icon : undefined,
          url: route.firstChild ? url || '/' : undefined,
        });
      }
      route = route.firstChild;
    }

    this.items.set(items);
    this.pageTitle.set(items.at(-1)?.label ?? '');
  }
}
