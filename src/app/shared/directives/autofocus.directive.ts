import { Directive, ElementRef, afterNextRender, inject, input } from '@angular/core';

/**
 * Place le focus sur l'élément hôte au premier rendu.
 *
 * @example
 * <input appAutofocus />
 * <input [appAutofocus]="shouldFocus()" />
 */
@Directive({
  selector: '[appAutofocus]',
})
export class AutofocusDirective {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  readonly appAutofocus = input(true, { transform: (v: boolean | '') => v !== false });

  constructor() {
    afterNextRender(() => {
      if (this.appAutofocus()) {
        this.host.nativeElement.focus();
      }
    });
  }
}
