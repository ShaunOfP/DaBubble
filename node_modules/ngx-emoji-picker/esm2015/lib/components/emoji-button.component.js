import { __decorate, __metadata } from "tslib";
import { Component, Input, EventEmitter, Output } from '@angular/core';
let EmojiButtonComponent = class EmojiButtonComponent {
    constructor() {
        this.selectionEmitter = new EventEmitter();
    }
    ngOnChanges() { }
};
__decorate([
    Input('emoji'),
    __metadata("design:type", Object)
], EmojiButtonComponent.prototype, "emoji", void 0);
__decorate([
    Input('dataToEmit'),
    __metadata("design:type", Object)
], EmojiButtonComponent.prototype, "dataToEmit", void 0);
__decorate([
    Input('options'),
    __metadata("design:type", Object)
], EmojiButtonComponent.prototype, "options", void 0);
__decorate([
    Input('fitzpatrick'),
    __metadata("design:type", Object)
], EmojiButtonComponent.prototype, "fitzpatrick", void 0);
__decorate([
    Output('selection'),
    __metadata("design:type", EventEmitter)
], EmojiButtonComponent.prototype, "selectionEmitter", void 0);
EmojiButtonComponent = __decorate([
    Component({
        selector: 'emoji-button',
        template: `
    <button
      class="emoji-button" 
      (click)="selectionEmitter.emit(dataToEmit || emoji)" [innerHTML]="emoji[0] | emojiFallback">
    </button>
  `,
        styles: [":host{display:inline-block}.emoji-button{padding:0;border:none;outline:0;background:0 0;width:34px;height:34px;border-radius:3px;font-size:24px;line-height:1.1;cursor:pointer;transition:.2s}.emoji-button:focus,.emoji-button:hover{background:#f1f1f1;border-color:#f1f1f1}.emoji-button ::ng-deep img{width:20px}"]
    }),
    __metadata("design:paramtypes", [])
], EmojiButtonComponent);
export { EmojiButtonComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW1vamktYnV0dG9uLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL25neC1lbW9qaS1waWNrZXIvIiwic291cmNlcyI6WyJsaWIvY29tcG9uZW50cy9lbW9qaS1idXR0b24uY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLEtBQUssRUFBRSxZQUFZLEVBQUUsTUFBTSxFQUFFLE1BQU0sZUFBZSxDQUFBO0FBWXRFLElBQWEsb0JBQW9CLEdBQWpDLE1BQWEsb0JBQW9CO0lBUS9CO1FBRnFCLHFCQUFnQixHQUFzQixJQUFJLFlBQVksRUFBRSxDQUFBO0lBRTlELENBQUM7SUFFaEIsV0FBVyxLQUFJLENBQUM7Q0FDakIsQ0FBQTtBQVZpQjtJQUFmLEtBQUssQ0FBQyxPQUFPLENBQUM7O21EQUFNO0FBQ0E7SUFBcEIsS0FBSyxDQUFDLFlBQVksQ0FBQzs7d0RBQVc7QUFDYjtJQUFqQixLQUFLLENBQUMsU0FBUyxDQUFDOztxREFBUTtBQUNIO0lBQXJCLEtBQUssQ0FBQyxhQUFhLENBQUM7O3lEQUFZO0FBRVo7SUFBcEIsTUFBTSxDQUFDLFdBQVcsQ0FBQzs4QkFBbUIsWUFBWTs4REFBMEI7QUFObEUsb0JBQW9CO0lBVmhDLFNBQVMsQ0FBQztRQUNULFFBQVEsRUFBRSxjQUFjO1FBRXhCLFFBQVEsRUFBRTs7Ozs7R0FLVDs7S0FDRixDQUFDOztHQUNXLG9CQUFvQixDQVdoQztTQVhZLG9CQUFvQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgSW5wdXQsIEV2ZW50RW1pdHRlciwgT3V0cHV0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSdcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnZW1vamktYnV0dG9uJyxcbiAgc3R5bGVVcmxzOiBbJy4uL3N0eWxlcy9lbW9qaS1idXR0b24uc2NzcyddLFxuICB0ZW1wbGF0ZTogYFxuICAgIDxidXR0b25cbiAgICAgIGNsYXNzPVwiZW1vamktYnV0dG9uXCIgXG4gICAgICAoY2xpY2spPVwic2VsZWN0aW9uRW1pdHRlci5lbWl0KGRhdGFUb0VtaXQgfHwgZW1vamkpXCIgW2lubmVySFRNTF09XCJlbW9qaVswXSB8IGVtb2ppRmFsbGJhY2tcIj5cbiAgICA8L2J1dHRvbj5cbiAgYFxufSlcbmV4cG9ydCBjbGFzcyBFbW9qaUJ1dHRvbkNvbXBvbmVudCB7XG4gIEBJbnB1dCgnZW1vamknKSBlbW9qaVxuICBASW5wdXQoJ2RhdGFUb0VtaXQnKSBkYXRhVG9FbWl0XG4gIEBJbnB1dCgnb3B0aW9ucycpIG9wdGlvbnNcbiAgQElucHV0KCdmaXR6cGF0cmljaycpIGZpdHpwYXRyaWNrXG5cbiAgQE91dHB1dCgnc2VsZWN0aW9uJykgc2VsZWN0aW9uRW1pdHRlcjogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyKClcblxuICBjb25zdHJ1Y3RvcigpIHt9XG5cbiAgbmdPbkNoYW5nZXMoKSB7fVxufVxuIl19