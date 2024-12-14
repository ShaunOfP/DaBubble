import { __decorate, __metadata } from "tslib";
import { Directive, Input, ComponentFactoryResolver, ViewContainerRef, ComponentFactory, ComponentRef, ElementRef, EventEmitter, Output, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil, distinctUntilChanged } from 'rxjs/operators';
import { EmojiPickerComponent } from '../components/emoji-picker.component';
import { DIRECTIONS } from '../misc/picker-directions';
import { EmojiEvent } from '../misc/emoji-event';
var EmojiPickerApiDirective = /** @class */ (function () {
    function EmojiPickerApiDirective(_cfr, _vcr, _el) {
        var _this = this;
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
            .subscribe(function (value) {
            var _a, _b, _c, _d, _e, _f;
            if (value) {
                (_c = (_b = (_a = _this._emojiPickerRef) === null || _a === void 0 ? void 0 : _a.instance) === null || _b === void 0 ? void 0 : _b.show) === null || _c === void 0 ? void 0 : _c.call(_b);
            }
            else {
                (_f = (_e = (_d = _this._emojiPickerRef) === null || _d === void 0 ? void 0 : _d.instance) === null || _e === void 0 ? void 0 : _e.hide) === null || _f === void 0 ? void 0 : _f.call(_e);
            }
        });
    }
    Object.defineProperty(EmojiPickerApiDirective.prototype, "emojiPickerDirection", {
        set: function (direction) {
            if (DIRECTIONS[direction] === undefined) {
                console.error("Emoji-Picker: direction '" + direction + "' passed as input does not exist in DIRECTIONS table, defaulting to 'bottom'");
                this._directionCode = DIRECTIONS.bottom;
            }
            else {
                this._directionCode = DIRECTIONS[direction];
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EmojiPickerApiDirective.prototype, "emojiPickerIf", {
        set: function (condition) {
            this._emojiPickerOpenState.next(condition);
        },
        enumerable: true,
        configurable: true
    });
    EmojiPickerApiDirective.prototype.initPicker = function () {
        var _this = this;
        this._emojiPickerFactory = this._emojiPickerFactory || this._cfr.resolveComponentFactory(EmojiPickerComponent);
        this._emojiPickerRef = this._emojiPickerRef || this._vcr.createComponent(this._emojiPickerFactory);
        this._emojiPickerRef.instance.setPosition(this._el, this._directionCode);
        this._emojiSubs.push(this._emojiPickerRef.instance.pickerCloseEmitter.subscribe(function (event) { return _this.emojiPickerIfEmitter.emit(false); }), this._emojiPickerRef.instance.selectionEmitter.subscribe(function (event) { return _this.selectEmitter.emit(EmojiEvent.fromArray(event)); }));
    };
    EmojiPickerApiDirective.prototype.closePicker = function () {
        if (!this._emojiPickerRef || !this._emojiPickerRef.destroy) {
            return;
        }
        this._emojiSubs.forEach(function (subscription) { return subscription.unsubscribe(); });
        this._emojiPickerRef.destroy();
        this._emojiSubs = [];
        delete this._emojiPickerRef;
    };
    EmojiPickerApiDirective.prototype.ngOnDestroy = function () {
        this._destroyed.next(true);
    };
    EmojiPickerApiDirective.ctorParameters = function () { return [
        { type: ComponentFactoryResolver },
        { type: ViewContainerRef },
        { type: ElementRef }
    ]; };
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
    return EmojiPickerApiDirective;
}());
export { EmojiPickerApiDirective };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW1vamktcGlja2VyLWFwaS5kaXJlY3RpdmUuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9uZ3gtZW1vamktcGlja2VyLyIsInNvdXJjZXMiOlsibGliL2RpcmVjdGl2ZXMvZW1vamktcGlja2VyLWFwaS5kaXJlY3RpdmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFDTCxTQUFTLEVBQ1QsS0FBSyxFQUNMLHdCQUF3QixFQUN4QixnQkFBZ0IsRUFDaEIsZ0JBQWdCLEVBQ2hCLFlBQVksRUFDWixVQUFVLEVBQ1YsWUFBWSxFQUNaLE1BQU0sRUFDTixNQUFNLEVBQ1AsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFFLE9BQU8sRUFBa0IsTUFBTSxNQUFNLENBQUM7QUFDL0MsT0FBTyxFQUFFLFNBQVMsRUFBRSxvQkFBb0IsRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBR2hFLE9BQU8sRUFBRSxvQkFBb0IsRUFBRSxNQUFNLHNDQUFzQyxDQUFDO0FBQzVFLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSwyQkFBMkIsQ0FBQztBQUN2RCxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0scUJBQXFCLENBQUM7QUFRakQ7SUE0QkUsaUNBQ1UsSUFBOEIsRUFDOUIsSUFBc0IsRUFDdEIsR0FBZTtRQUh6QixpQkFtQkM7UUFsQlMsU0FBSSxHQUFKLElBQUksQ0FBMEI7UUFDOUIsU0FBSSxHQUFKLElBQUksQ0FBa0I7UUFDdEIsUUFBRyxHQUFILEdBQUcsQ0FBWTtRQTlCakIsbUJBQWMsR0FBZSxVQUFVLENBQUMsTUFBTSxDQUFDO1FBQy9DLGVBQVUsR0FBWSxLQUFLLENBQUM7UUFlTCx5QkFBb0IsR0FBRyxJQUFJLFlBQVksRUFBVyxDQUFDO1FBRXJELGtCQUFhLEdBQUcsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQUV4RCwwQkFBcUIsR0FBRyxJQUFJLE9BQU8sRUFBVyxDQUFDO1FBQy9DLGVBQVUsR0FBRyxJQUFJLE9BQU8sRUFBVyxDQUFDO1FBSXBDLGVB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d0JBQXdCO2dCQUN4QixnQkFBZ0I7Z0JBQ2pCLFVBQVU7O0lBM0JNO1FBQTlCLEtBQUssQ0FBQyxzQkFBc0IsQ0FBQzs7O3VFQU83QjtJQUd1QjtRQUF2QixLQUFLLENBQUMsZUFBZSxDQUFDOzs7Z0VBRXRCO0lBQzhCO1FBQTlCLE1BQU0sQ0FBQyxxQkFBcUIsQ0FBQzs7eUVBQW9EO0lBRXJEO1FBQTVCLE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQzs7a0VBQW9DO0lBbkJyRCx1QkFBdUI7UUFObkMsU0FBUyxDQUFDO1lBQ1QsUUFBUSxFQUFFLGlCQUFpQjtZQUMzQixJQUFJLEVBQUU7Z0JBQ0osU0FBUyxFQUFFLGlDQUFpQyxDQUFDLHdDQUF3QzthQUN0RjtTQUNELENBQUM7eUNBOEJlLHdCQUF3QjtZQUN4QixnQkFBZ0I7WUFDakIsVUFBVTtPQS9CZCx1QkFBdUIsQ0EyRW5DO0lBQUQsOEJBQUM7Q0FBQSxBQTNFRCxJQTJFQztTQTNFWSx1QkFBdUIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBEaXJlY3RpdmUsXG4gIElucHV0LFxuICBDb21wb25lbnRGYWN0b3J5UmVzb2x2ZXIsXG4gIFZpZXdDb250YWluZXJSZWYsXG4gIENvbXBvbmVudEZhY3RvcnksXG4gIENvbXBvbmVudFJlZixcbiAgRWxlbWVudFJlZixcbiAgRXZlbnRFbWl0dGVyLFxuICBPdXRwdXQsXG4gIE9uSW5pdFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IFN1YmplY3QgLCAgU3Vic2NyaXB0aW9uIH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyB0YWtlVW50aWwsIGRpc3RpbmN0VW50aWxDaGFuZ2VkfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5cblxuaW1wb3J0IHsgRW1vamlQaWNrZXJDb21wb25lbnQgfSBmcm9tICcuLi9jb21wb25lbnRzL2Vtb2ppLXBpY2tlci5jb21wb25lbnQnO1xuaW1wb3J0IHsgRElSRUNUSU9OUyB9IGZyb20gJy4uL21pc2MvcGlja2VyLWRpcmVjdGlvbnMnO1xuaW1wb3J0IHsgRW1vamlFdmVudCB9IGZyb20gJy4uL21pc2MvZW1vamktZXZlbnQnO1xuXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdbZW1vamlQaWNrZXJJZl0nLFxuICBob3N0OiB7XG4gICAgJyhjbGljayknOiAnJGV2ZW50LmVtb2ppUGlja2VyRXhlbXB0ID0gdHJ1ZScgLy8gbWFya2luZyBvZmYgZXZlbnQgbGlzdGVuaW5nIG9uIGFuY2hvclxuICB9XG4gfSlcbmV4cG9ydCBjbGFzcyBFbW9qaVBpY2tlckFwaURpcmVjdGl2ZSB7XG4gIHByaXZhdGUgX2RpcmVjdGlvbkNvZGU6IERJUkVDVElPTlMgPSBESVJFQ1RJT05TLmJvdHRvbTtcbiAgcHJpdmF0ZSBfc2VhcmNoQmFyOiBCb29sZWFuID0gZmFsc2U7XG5cbiAgQElucHV0KCdlbW9qaVBpY2tlckRpcmVjdGlvbicpIHNldCBlbW9qaVBpY2tlckRpcmVjdGlvbihkaXJlY3Rpb246IHN0cmluZykge1xuICAgIGlmIChESVJFQ1RJT05TW2RpcmVjdGlvbl0gPT09IHVuZGVmaW5lZCkge1xuICAgICAgY29uc29sZS5lcnJvcihgRW1vamktUGlja2VyOiBkaXJlY3Rpb24gJyR7ZGlyZWN0aW9ufScgcGFzc2VkIGFzIGlucHV0IGRvZXMgbm90IGV4aXN0IGluIERJUkVDVElPTlMgdGFibGUsIGRlZmF1bHRpbmcgdG8gJ2JvdHRvbSdgKTtcbiAgICAgIHRoaXMuX2RpcmVjdGlvbkNvZGUgPSBESVJFQ1RJT05TLmJvdHRvbTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fZGlyZWN0aW9uQ29kZSA9IERJUkVDVElPTlNbZGlyZWN0aW9uXTtcbiAgICB9XG4gIH1cblxuXG4gIEBJbnB1dCgnZW1vamlQaWNrZXJJZicpIHNldCBlbW9qaVBpY2tlcklmKGNvbmRpdGlvbjogYm9vbGVhbikge1xuICAgIHRoaXMuX2Vtb2ppUGlja2VyT3BlblN0YXRlLm5leHQoY29uZGl0aW9uKTtcbiAgfVxuICBAT3V0cHV0KCdlbW9qaVBpY2tlcklmQ2hhbmdlJykgZW1vamlQaWNrZXJJZkVtaXR0ZXIgPSBuZXcgRXZlbnRFbWl0dGVyPGJvb2xlYW4+KCk7XG4gIFxuICBAT3V0cHV0KCdlbW9qaVBpY2tlclNlbGVjdCcpIHNlbGVjdEVtaXR0ZXIgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cbiAgcHJpdmF0ZSBfZW1vamlQaWNrZXJPcGVuU3RhdGUgPSBuZXcgU3ViamVjdDxib29sZWFuPigpO1xuICBwcml2YXRlIF9kZXN0cm95ZWQgPSBuZXcgU3ViamVjdDxib29sZWFuPigpO1xuXG4gIHByaXZhdGUgX2Vtb2ppUGlja2VyRmFjdG9yeTogQ29tcG9uZW50RmFjdG9yeTxFbW9qaVBpY2tlckNvbXBvbmVudD47XG4gIHByaXZhdGUgX2Vtb2ppUGlja2VyUmVmOiBDb21wb25lbnRSZWY8RW1vamlQaWNrZXJDb21wb25lbnQ+O1xuICBwcml2YXRlIF9lbW9qaVN1YnM6IFN1YnNjcmlwdGlvbltdID0gW107XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBfY2ZyOiBDb21wb25lbnRGYWN0b3J5UmVzb2x2ZXIsXG4gICAgcHJpdmF0ZSBfdmNyOiBWaWV3Q29udGFpbmVyUmVmLFxuICAgIHByaXZhdGUgX2VsOiBFbGVtZW50UmVmXG4gICkge1xuICAgIHRoaXMuaW5pdFBpY2tlcigpO1xuXG4gICAgdGhpcy5fZW1vamlQaWNrZXJPcGVuU3RhdGVcbiAgICAgIC5waXBlKHRha2VVbnRpbCh0aGlzLl9kZXN0cm95ZWQpLFxuICAgICAgICBkaXN0aW5jdFVudGlsQ2hhbmdlZCgpXG4gICAgICApXG4gICAgICAuc3Vic2NyaWJlKHZhbHVlID0+IHtcbiAgICAgICBcbiAgICAgICAgaWYgKHZhbHVlKSB7XG4gICAgICAgICAgdGhpcy5fZW1vamlQaWNrZXJSZWY/Lmluc3RhbmNlPy5zaG93Py4oKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLl9lbW9qaVBpY2tlclJlZj8uaW5zdGFuY2U/LmhpZGU/LigpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgfVxuXG4gIGluaXRQaWNrZXIoKSB7XG4gICAgdGhpcy5fZW1vamlQaWNrZXJGYWN0b3J5ID0gdGhpcy5fZW1vamlQaWNrZXJGYWN0b3J5IHx8IHRoaXMuX2Nmci5yZXNvbHZlQ29tcG9uZW50RmFjdG9yeShFbW9qaVBpY2tlckNvbXBvbmVudCk7XG4gICAgdGhpcy5fZW1vamlQaWNrZXJSZWYgPSB0aGlzLl9lbW9qaVBpY2tlclJlZiB8fCB0aGlzLl92Y3IuY3JlYXRlQ29tcG9uZW50KHRoaXMuX2Vtb2ppUGlja2VyRmFjdG9yeSk7XG5cbiAgICB0aGlzLl9lbW9qaVBpY2tlclJlZi5pbnN0YW5jZS5zZXRQb3NpdGlvbih0aGlzLl9lbCwgdGhpcy5fZGlyZWN0aW9uQ29kZSk7XG4gICAgdGhpcy5fZW1vamlTdWJzLnB1c2goXG4gICAgICB0aGlzLl9lbW9qaVBpY2tlclJlZi5pbnN0YW5jZS5waWNrZXJDbG9zZUVtaXR0ZXIuc3Vic2NyaWJlKGV2ZW50ID0+IHRoaXMuZW1vamlQaWNrZXJJZkVtaXR0ZXIuZW1pdChmYWxzZSkpLFxuICAgICAgdGhpcy5fZW1vamlQaWNrZXJSZWYuaW5zdGFuY2Uuc2VsZWN0aW9uRW1pdHRlci5zdWJzY3JpYmUoZXZlbnQgPT4gdGhpcy5zZWxlY3RFbWl0dGVyLmVtaXQoRW1vamlFdmVudC5mcm9tQXJyYXkoZXZlbnQpKSlcbiAgICApO1xuICB9XG5cbiAgY2xvc2VQaWNrZXIoKSB7XG4gICAgaWYgKCF0aGlzLl9lbW9qaVBpY2tlclJlZiB8fCAhdGhpcy5fZW1vamlQaWNrZXJSZWYuZGVzdHJveSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMuX2Vtb2ppU3Vicy5mb3JFYWNoKChzdWJzY3JpcHRpb246IFN1YnNjcmlwdGlvbikgPT4gc3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCkpO1xuICAgIHRoaXMuX2Vtb2ppUGlja2VyUmVmLmRlc3Ryb3koKTtcbiAgICBcbiAgICB0aGlzLl9lbW9qaVN1YnMgPSBbXTtcbiAgICBkZWxldGUgdGhpcy5fZW1vamlQaWNrZXJSZWY7XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICB0aGlzLl9kZXN0cm95ZWQubmV4dCh0cnVlKTtcbiAgfVxufVxuIl19