import { Directive, ElementRef, EventEmitter, HostListener, Output } from '@angular/core';

@Directive({
  selector: '[appClickOutside]'
})
export class ClickOutsideDirective {
  @Output() appClickOutside = new EventEmitter<void>();

  constructor(private elementRef: ElementRef) {}

  @HostListener('document:click', ['$event.target'])
  onClick(targetElement: any) {
    const isClickedInside = this.elementRef.nativeElement.contains(targetElement);
    if (!isClickedInside) {
      this.appClickOutside.emit();
    }
  }
}