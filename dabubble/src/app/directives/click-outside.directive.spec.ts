import { ClickOutsideDirective } from '../directives/click-outside.directive';
import { ElementRef } from '@angular/core'; // Import ElementRef

describe('ClickOutsideDirective', () => {
  it('should create an instance', () => {
    const elementRef = new ElementRef(document.createElement('div')); // Create a mock ElementRef
    const directive = new ClickOutsideDirective(elementRef); 
    expect(directive).toBeTruthy();
  });
});