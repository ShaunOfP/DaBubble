import { __decorate, __metadata } from "tslib";
import { Directive, Input, ComponentFactoryResolver, ViewContainerRef, ComponentFactory, ComponentRef, ElementRef, EventEmitter, Output, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil, distinctUntilChanged } from 'rxjs/operators';
import { EmojiPickerComponent } from '../components/emoji-picker.component';
import { DIRECTIONS } from '../misc/picker-directions';
import { EmojiEvent } from '../misc/emoji-event';
let EmojiPickerApiDirective = class EmojiPickerApiDirective {
    constructor(_cfr, _vcr, _el) {
        this._cfr = _cfr;
        this._vcr = _vcr;
        this._el = _el;
        this._directionCode = DIRECTIONS.bottom;
        this._searchBar = false;
        this.emojiPickerIfEmitter = new EventEmitter();
        this.selectEmitter = new EventEmitter();
        this._emojiPickerOpenState = new Subject();
        this._destroyed = new Subject();
        this._emojiSubs = [];
        this.initPicker();
        this._emojiPickerOpenState
            .pipe(takeUntil(this._destroyed), distinctUntilChanged())
            .subscribe(value => {
            var _a, _b, _c, _d, _e, _f;
            if (value) {
                (_c = (_b = (_a = this._emojiPickerRef) === null || _a === void 0 ? void 0 : _a.instance) === null || _b === void 0 ? void 0 : _b.show) === null || _c === void 0 ? void 0 : _c.call(_b);
            }
            else {
                (_f = (_e = (_d = this._emojiPickerRef) === null || _d === void 0 ? void 0 : _d.instance) === null || _e === void 0 ? void 0 : _e.hide) === null || _f === void 0 ? void 0 : _f.call(_e);
            }
        });
    }
    set emojiPickerDirection(direction) {
        if (DIRECTIONS[direction] === undefined) {
            console.error(`Emoji-Picker: direction '${direction}' passed as input does not exist in DIRECTIONS table, defaulting to 'bottom'`);
            this._directionCode = DIRECTIONS.bottom;
        }
        else {
            this._directionCode = DIRECTIONS[direction];
        }
    }
    set emojiPickerIf(condition) {
        this._emojiPickerOpenState.next(condition);
    }
    initPicker() {
        this._emojiPickerFactory = this._emojiPickerFactory || this._cfr.resolveComponentFactory(EmojiPickerComponent);
        this._emojiPickerRef = this._emojiPickerRef || this._vcr.createComponent(this._emojiPickerFactory);
        this._emojiPickerRef.instance.setPosition(this._el, this._directionCode);
        this._emojiSubs.push(this._emojiPickerRef.instance.pickerCloseEmitter.subscribe(event => this.emojiPickerIfEmitter.emit(false)), this._emojiPickerRef.instance.selectionEmitter.subscribe(event => this.selectEmitter.emit(EmojiEvent.fromArray(event))));
    }
    closePicker() {
        if (!this._emojiPickerRef || !this._emojiPickerRef.destroy) {
            return;
        }
        this._emojiSubs.forEach((subscription) => subscription.unsubscribe());
        this._emojiPickerRef.destroy();
        this._emojiSubs = [];
        delete this._emojiPickerRef;
    }
    ngOnDestroy() {
        this._destroyed.next(true);
    }
};
EmojiPickerApiDirective.ctorParameters = () => [
    { type: ComponentFactoryResolver },
    { type: ViewContainerRef },
    { type: ElementRef }
];
__decorate([
    Input('emojiPickerDirection'),
    __metadata("design:type", String),
    __metadata("design:paramtypes", [String])
], EmojiPickerApiDirective.prototype, "emojiPickerDirection", null);
__decorate([
    Input('emojiPickerIf'),
    __metadata("design:type", Boolean),
    __metadata("design:paramtypes", [Boolean])
], EmojiPickerApiDirective.prototype, "emojiPickerIf", null);
__decorate([
    Output('emojiPickerIfChange'),
    __metadata("design:type", Object)
], EmojiPickerApiDirective.prototype, "emojiPickerIfEmitter", void 0);
__decorate([
    Output('emojiPickerSelect'),
    __metadata("design:type", Object)
], EmojiPickerApiDirective.prototype, "selectEmitter", void 0);
EmojiPickerApiDirective = __decorate([
    Directive({
        selector: '[emojiPickerIf]',
        host: {
            '(click)': '$event.emojiPickerExempt = true' // marking off event listening on anchor
        }
    }),
    __metadata("design:paramtypes", [ComponentFactoryResolver,
        ViewContainerRef,
        ElementRef])
], EmojiPickerApiDirective);
export { EmojiPickerApiDirective };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW1vamktcGlja2VyLWFwaS5kaXJlY3RpdmUuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9uZ3gtZW1vamktcGlja2VyLyIsInNvdXJjZXMiOlsibGliL2RpcmVjdGl2ZXMvZW1vamktcGlja2VyLWFwaS5kaXJlY3RpdmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFDTCxTQUFTLEVBQ1QsS0FBSyxFQUNMLHdCQUF3QixFQUN4QixnQkFBZ0IsRUFDaEIsZ0JBQWdCLEVBQ2hCLFlBQVksRUFDWixVQUFVLEVBQ1YsWUFBWSxFQUNaLE1BQU0sRUFDTixNQUFNLEVBQ1AsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFFLE9BQU8sRUFBa0IsTUFBTSxNQUFNLENBQUM7QUFDL0MsT0FBTyxFQUFFLFNBQVMsRUFBRSxvQkFBb0IsRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBR2hFLE9BQU8sRUFBRSxvQkFBb0IsRUFBRSxNQUFNLHNDQUFzQyxDQUFDO0FBQzVFLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSwyQkFBMkIsQ0FBQztBQUN2RCxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0scUJBQXFCLENBQUM7QUFRakQsSUFBYSx1QkFBdUIsR0FBcEMsTUFBYSx1QkFBdUI7SUE0QmxDLFlBQ1UsSUFBOEIsRUFDOUIsSUFBc0IsRUFDdEIsR0FBZTtRQUZmLFNBQUksR0FBSixJQUFJLENBQTBCO1FBQzlCLFNBQUksR0FBSixJQUFJLENBQWtCO1FBQ3RCLFFBQUcsR0FBSCxHQUFHLENBQVk7UUE5QmpCLG1CQUFjLEdBQWUsVUFBVSxDQUFDLE1BQU0sQ0FBQztRQUMvQyxlQUFVLEdBQVksS0FBSyxDQUFDO1FBZUwseUJBQW9CLEdBQUcsSUFBSSxZQUFZLEVBQVcsQ0FBQztRQUVyRCxrQkFBYSxHQUFHLElBQUksWUFBWSxFQUFFLENBQUM7UUFFeEQsMEJBQXFCLEdBQUcsSUFBSSxPQUFPLEVBQVcsQ0FBQztRQUMvQyxlQUFVLEdBQUcsSUFBSSxPQUFPLEVB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QUM7OzttRUFPN0I7QUFHdUI7SUFBdkIsS0FBSyxDQUFDLGVBQWUsQ0FBQzs7OzREQUV0QjtBQUM4QjtJQUE5QixNQUFNLENBQUMscUJBQXFCLENBQUM7O3FFQUFvRDtBQUVyRDtJQUE1QixNQUFNLENBQUMsbUJBQW1CLENBQUM7OzhEQUFvQztBQW5CckQsdUJBQXVCO0lBTm5DLFNBQVMsQ0FBQztRQUNULFFBQVEsRUFBRSxpQkFBaUI7UUFDM0IsSUFBSSxFQUFFO1lBQ0osU0FBUyxFQUFFLGlDQUFpQyxDQUFDLHdDQUF3QztTQUN0RjtLQUNELENBQUM7cUNBOEJlLHdCQUF3QjtRQUN4QixnQkFBZ0I7UUFDakIsVUFBVTtHQS9CZCx1QkFBdUIsQ0EyRW5DO1NBM0VZLHVCQUF1QiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gIERpcmVjdGl2ZSxcbiAgSW5wdXQsXG4gIENvbXBvbmVudEZhY3RvcnlSZXNvbHZlcixcbiAgVmlld0NvbnRhaW5lclJlZixcbiAgQ29tcG9uZW50RmFjdG9yeSxcbiAgQ29tcG9uZW50UmVmLFxuICBFbGVtZW50UmVmLFxuICBFdmVudEVtaXR0ZXIsXG4gIE91dHB1dCxcbiAgT25Jbml0XG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgU3ViamVjdCAsICBTdWJzY3JpcHRpb24gfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IHRha2VVbnRpbCwgZGlzdGluY3RVbnRpbENoYW5nZWR9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcblxuXG5pbXBvcnQgeyBFbW9qaVBpY2tlckNvbXBvbmVudCB9IGZyb20gJy4uL2NvbXBvbmVudHMvZW1vamktcGlja2VyLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBESVJFQ1RJT05TIH0gZnJvbSAnLi4vbWlzYy9waWNrZXItZGlyZWN0aW9ucyc7XG5pbXBvcnQgeyBFbW9qaUV2ZW50IH0gZnJvbSAnLi4vbWlzYy9lbW9qaS1ldmVudCc7XG5cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ1tlbW9qaVBpY2tlcklmXScsXG4gIGhvc3Q6IHtcbiAgICAnKGNsaWNrKSc6ICckZXZlbnQuZW1vamlQaWNrZXJFeGVtcHQgPSB0cnVlJyAvLyBtYXJraW5nIG9mZiBldmVudCBsaXN0ZW5pbmcgb24gYW5jaG9yXG4gIH1cbiB9KVxuZXhwb3J0IGNsYXNzIEVtb2ppUGlja2VyQXBpRGlyZWN0aXZlIHtcbiAgcHJpdmF0ZSBfZGlyZWN0aW9uQ29kZTogRElSRUNUSU9OUyA9IERJUkVDVElPTlMuYm90dG9tO1xuICBwcml2YXRlIF9zZWFyY2hCYXI6IEJvb2xlYW4gPSBmYWxzZTtcblxuICBASW5wdXQoJ2Vtb2ppUGlja2VyRGlyZWN0aW9uJykgc2V0IGVtb2ppUGlja2VyRGlyZWN0aW9uKGRpcmVjdGlvbjogc3RyaW5nKSB7XG4gICAgaWYgKERJUkVDVElPTlNbZGlyZWN0aW9uXSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBjb25zb2xlLmVycm9yKGBFbW9qaS1QaWNrZXI6IGRpcmVjdGlvbiAnJHtkaXJlY3Rpb259JyBwYXNzZWQgYXMgaW5wdXQgZG9lcyBub3QgZXhpc3QgaW4gRElSRUNUSU9OUyB0YWJsZSwgZGVmYXVsdGluZyB0byAnYm90dG9tJ2ApO1xuICAgICAgdGhpcy5fZGlyZWN0aW9uQ29kZSA9IERJUkVDVElPTlMuYm90dG9tO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9kaXJlY3Rpb25Db2RlID0gRElSRUNUSU9OU1tkaXJlY3Rpb25dO1xuICAgIH1cbiAgfVxuXG5cbiAgQElucHV0KCdlbW9qaVBpY2tlcklmJykgc2V0IGVtb2ppUGlja2VySWYoY29uZGl0aW9uOiBib29sZWFuKSB7XG4gICAgdGhpcy5fZW1vamlQaWNrZXJPcGVuU3RhdGUubmV4dChjb25kaXRpb24pO1xuICB9XG4gIEBPdXRwdXQoJ2Vtb2ppUGlja2VySWZDaGFuZ2UnKSBlbW9qaVBpY2tlcklmRW1pdHRlciA9IG5ldyBFdmVudEVtaXR0ZXI8Ym9vbGVhbj4oKTtcbiAgXG4gIEBPdXRwdXQoJ2Vtb2ppUGlja2VyU2VsZWN0Jykgc2VsZWN0RW1pdHRlciA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblxuICBwcml2YXRlIF9lbW9qaVBpY2tlck9wZW5TdGF0ZSA9IG5ldyBTdWJqZWN0PGJvb2xlYW4+KCk7XG4gIHByaXZhdGUgX2Rlc3Ryb3llZCA9IG5ldyBTdWJqZWN0PGJvb2xlYW4+KCk7XG5cbiAgcHJpdmF0ZSBfZW1vamlQaWNrZXJGYWN0b3J5OiBDb21wb25lbnRGYWN0b3J5PEVtb2ppUGlja2VyQ29tcG9uZW50PjtcbiAgcHJpdmF0ZSBfZW1vamlQaWNrZXJSZWY6IENvbXBvbmVudFJlZjxFbW9qaVBpY2tlckNvbXBvbmVudD47XG4gIHByaXZhdGUgX2Vtb2ppU3ViczogU3Vic2NyaXB0aW9uW10gPSBbXTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIF9jZnI6IENvbXBvbmVudEZhY3RvcnlSZXNvbHZlcixcbiAgICBwcml2YXRlIF92Y3I6IFZpZXdDb250YWluZXJSZWYsXG4gICAgcHJpdmF0ZSBfZWw6IEVsZW1lbnRSZWZcbiAgKSB7XG4gICAgdGhpcy5pbml0UGlja2VyKCk7XG5cbiAgICB0aGlzLl9lbW9qaVBpY2tlck9wZW5TdGF0ZVxuICAgICAgLnBpcGUodGFrZVVudGlsKHRoaXMuX2Rlc3Ryb3llZCksXG4gICAgICAgIGRpc3RpbmN0VW50aWxDaGFuZ2VkKClcbiAgICAgIClcbiAgICAgIC5zdWJzY3JpYmUodmFsdWUgPT4ge1xuICAgICAgIFxuICAgICAgICBpZiAodmFsdWUpIHtcbiAgICAgICAgICB0aGlzLl9lbW9qaVBpY2tlclJlZj8uaW5zdGFuY2U/LnNob3c/LigpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuX2Vtb2ppUGlja2VyUmVmPy5pbnN0YW5jZT8uaGlkZT8uKCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICB9XG5cbiAgaW5pdFBpY2tlcigpIHtcbiAgICB0aGlzLl9lbW9qaVBpY2tlckZhY3RvcnkgPSB0aGlzLl9lbW9qaVBpY2tlckZhY3RvcnkgfHwgdGhpcy5fY2ZyLnJlc29sdmVDb21wb25lbnRGYWN0b3J5KEVtb2ppUGlja2VyQ29tcG9uZW50KTtcbiAgICB0aGlzLl9lbW9qaVBpY2tlclJlZiA9IHRoaXMuX2Vtb2ppUGlja2VyUmVmIHx8IHRoaXMuX3Zjci5jcmVhdGVDb21wb25lbnQodGhpcy5fZW1vamlQaWNrZXJGYWN0b3J5KTtcblxuICAgIHRoaXMuX2Vtb2ppUGlja2VyUmVmLmluc3RhbmNlLnNldFBvc2l0aW9uKHRoaXMuX2VsLCB0aGlzLl9kaXJlY3Rpb25Db2RlKTtcbiAgICB0aGlzLl9lbW9qaVN1YnMucHVzaChcbiAgICAgIHRoaXMuX2Vtb2ppUGlja2VyUmVmLmluc3RhbmNlLnBpY2tlckNsb3NlRW1pdHRlci5zdWJzY3JpYmUoZXZlbnQgPT4gdGhpcy5lbW9qaVBpY2tlcklmRW1pdHRlci5lbWl0KGZhbHNlKSksXG4gICAgICB0aGlzLl9lbW9qaVBpY2tlclJlZi5pbnN0YW5jZS5zZWxlY3Rpb25FbWl0dGVyLnN1YnNjcmliZShldmVudCA9PiB0aGlzLnNlbGVjdEVtaXR0ZXIuZW1pdChFbW9qaUV2ZW50LmZyb21BcnJheShldmVudCkpKVxuICAgICk7XG4gIH1cblxuICBjbG9zZVBpY2tlcigpIHtcbiAgICBpZiAoIXRoaXMuX2Vtb2ppUGlja2VyUmVmIHx8ICF0aGlzLl9lbW9qaVBpY2tlclJlZi5kZXN0cm95KSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5fZW1vamlTdWJzLmZvckVhY2goKHN1YnNjcmlwdGlvbjogU3Vic2NyaXB0aW9uKSA9PiBzdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKSk7XG4gICAgdGhpcy5fZW1vamlQaWNrZXJSZWYuZGVzdHJveSgpO1xuICAgIFxuICAgIHRoaXMuX2Vtb2ppU3VicyA9IFtdO1xuICAgIGRlbGV0ZSB0aGlzLl9lbW9qaVBpY2tlclJlZjtcbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIHRoaXMuX2Rlc3Ryb3llZC5uZXh0KHRydWUpO1xuICB9XG59XG4iXX0=