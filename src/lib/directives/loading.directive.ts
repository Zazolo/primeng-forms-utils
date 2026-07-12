import { DOCUMENT } from '@angular/common';
import {
  Directive,
  ElementRef,
  Inject,
  Input,
  OnChanges,
  OnDestroy,
  Renderer2,
  SimpleChanges
} from '@angular/core';

@Directive({
  selector: '[pfuLoading]',
  standalone: true
})
export class LoadingDirective implements OnChanges, OnDestroy {
  @Input({ alias: 'pfuLoading' }) isLoading = false;

  private readonly documentRef: Document;
  private overlayElement?: HTMLElement;
  private spinnerElement?: HTMLElement;
  private previousPosition?: string | null;
  private positionManagedByDirective = false;

  constructor(
    private readonly elementRef: ElementRef<HTMLElement>,
    private readonly renderer: Renderer2,
    @Inject(DOCUMENT) documentRef: Document
  ) {
    this.documentRef = documentRef;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes['isLoading']) {
      return;
    }

    if (this.isLoading) {
      this.attachOverlay();
      return;
    }

    this.detachOverlay();
  }

  ngOnDestroy(): void {
    this.detachOverlay();
  }

  private attachOverlay(): void {
    if (this.overlayElement) {
      return;
    }

    const hostElement = this.elementRef.nativeElement;
    const computedPosition = this.documentRef.defaultView?.getComputedStyle(hostElement).position;

    if (!computedPosition || computedPosition === 'static') {
      this.previousPosition = hostElement.style.position || null;
      this.renderer.setStyle(hostElement, 'position', 'relative');
      this.positionManagedByDirective = true;
    }

    this.renderer.setAttribute(hostElement, 'aria-busy', 'true');

    const overlayElement = this.renderer.createElement('div');
    const spinnerElement = this.renderer.createElement('span');

    this.renderer.addClass(overlayElement, 'pfu-loading-overlay');
    this.renderer.addClass(spinnerElement, 'pfu-loading-spinner');
    this.renderer.setAttribute(overlayElement, 'aria-hidden', 'true');

    this.renderer.appendChild(overlayElement, spinnerElement);
    this.renderer.appendChild(hostElement, overlayElement);

    this.ensureOverlayStyles();

    this.overlayElement = overlayElement;
    this.spinnerElement = spinnerElement;
  }

  private detachOverlay(): void {
    const hostElement = this.elementRef.nativeElement;

    if (this.overlayElement) {
      this.renderer.removeChild(hostElement, this.overlayElement);
      this.overlayElement = undefined;
      this.spinnerElement = undefined;
    }

    this.renderer.removeAttribute(hostElement, 'aria-busy');

    if (this.positionManagedByDirective) {
      if (this.previousPosition) {
        this.renderer.setStyle(hostElement, 'position', this.previousPosition);
      } else {
        this.renderer.removeStyle(hostElement, 'position');
      }

      this.positionManagedByDirective = false;
      this.previousPosition = undefined;
    }
  }

  private ensureOverlayStyles(): void {
    if (!this.overlayElement || !this.spinnerElement) {
      return;
    }

    this.renderer.setStyle(this.overlayElement, 'position', 'absolute');
    this.renderer.setStyle(this.overlayElement, 'inset', '0');
    this.renderer.setStyle(this.overlayElement, 'display', 'flex');
    this.renderer.setStyle(this.overlayElement, 'align-items', 'center');
    this.renderer.setStyle(this.overlayElement, 'justify-content', 'center');
    this.renderer.setStyle(this.overlayElement, 'background', 'rgba(255, 255, 255, 0.75)');
    this.renderer.setStyle(this.overlayElement, 'backdrop-filter', 'blur(1px)');
    this.renderer.setStyle(this.overlayElement, 'z-index', '20');
    this.renderer.setStyle(this.overlayElement, 'pointer-events', 'all');

    this.renderer.setStyle(this.spinnerElement, 'width', '2.5rem');
    this.renderer.setStyle(this.spinnerElement, 'height', '2.5rem');
    this.renderer.setStyle(this.spinnerElement, 'border-radius', '9999px');
    this.renderer.setStyle(this.spinnerElement, 'border', '0.3rem solid rgba(15, 23, 42, 0.15)');
    this.renderer.setStyle(this.spinnerElement, 'border-top-color', '#0f172a');
    this.renderer.setStyle(this.spinnerElement, 'animation', 'pfu-loading-spin 0.8s linear infinite');

    if (!this.documentRef.getElementById('pfu-loading-directive-styles')) {
      const styleElement = this.renderer.createElement('style');
      this.renderer.setAttribute(styleElement, 'id', 'pfu-loading-directive-styles');
      this.renderer.appendChild(
        styleElement,
        this.renderer.createText(`
          @keyframes pfu-loading-spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `)
      );
      if (this.documentRef.head) {
        this.renderer.appendChild(this.documentRef.head, styleElement);
      }
    }
  }
}


