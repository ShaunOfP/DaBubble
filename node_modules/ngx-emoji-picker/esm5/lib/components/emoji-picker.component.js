import { __decorate, __metadata } from "tslib";
import { Component, EventEmitter, Output, ElementRef, Renderer2, } from "@angular/core";
import { DIRECTIONS } from "../misc/picker-directions";
import { Subject } from "rxjs";
import { takeUntil, debounceTime } from "rxjs/operators";
var EmojiPickerComponent = /** @class */ (function () {
    function EmojiPickerComponent(_renderer, _el) {
        var _this = this;
        this._renderer = _renderer;
        this._el = _el;
        this.selectionEmitter = new EventEmitter();
        this.pickerCloseEmitter = new EventEmitter();
        this._windowResize = new Subject();
        this._destroyed = new Subject();
        this._windowResize
            .pipe(takeUntil(this._destroyed), debounceTime(100))
            .subscribe(function (event) {
            _this.setPosition(_this._currentTarget, _this._currentDirection);
        });
    }
    EmojiPickerComponent.prototype.hide = function () {
        this._renderer.setStyle(this._el.nativeElement, "display", "none");
    };
    EmojiPickerComponent.prototype.show = function () {
        this._renderer.setStyle(this._el.nativeElement, "display", "block");
        this.setPosition(this._currentTarget, this._currentDirection);
    };
    EmojiPickerComponent.prototype.setPosition = function (target, directionCode) {
        if (directionCode === void 0) { directionCode = DIRECTIONS.bottom; }
        if (!target) {
            return console.error("Emoji-Picker: positioning failed due to missing target element or direction code");
        }
        this._renderer.setStyle(this._el.nativeElement, "transform", "");
        /** Store anchor and direction */
        this._currentTarget = target;
        this._currentDirection = directionCode;
        var targetBorders = target.nativeElement.getBoundingClientRect(), thisBorders = this._el.nativeElement.getBoundingClientRect();
        var heightCorrection = 0, widthCorrection = 0;
        /** Setting up centering of picker for all cases */
        switch (this._currentDirection) {
            case DIRECTIONS.top:
            case DIRECTIONS.bottom:
                widthCorrection =
                    targetBorders.left -
                        thisBorders.left +
                        (targetBorders.width - thisBorders.width) / 2;
                break;
            case DIRECTIONS.left:
            case DIRECTIONS.right:
                heightCorrection =
                    targetBorders.top -
                        thisBorders.top +
                        (targetBorders.height - thisBorders.height) / 2;
                break;
        }
        /** Setting up relative positioning for all cases */
        switch (this._currentDirection) {
            case DIRECTIONS.top:
                heightCorrection = targetBorders.top - thisBorders.bottom;
                break;
            case DIRECTIONS.left:
                widthCorrection = targetBorders.left - thisBorders.right;
                break;
            case DIRECTIONS.right:
                widthCorrection = targetBorders.right - thisBorders.left;
                break;
            case DIRECTIONS.bottom:
                heightCorrection = targetBorders.bottom - thisBorders.top;
                break;
        }
        /** Correcting positioning due to overflow problems */
        if (thisBorders.bottom + heightCorrection > window.innerHeight) {
            heightCorrection +=
                window.innerHeight - (thisBorders.bottom + heightCorrection);
        }
        if (thisBorders.top + heightCorrection < 0) {
            heightCorrection -= thisBorders.top + heightCorrection;
        }
        if (thisBorders.right + widthCorrection > window.innerWidth) {
            widthCorrection +=
                window.innerWidth - (thisBorders.right + widthCorrection);
        }
        if (thisBorders.left + widthCorrection < 0) {
            widthCorrection -= thisBorders.left + widthCorrection;
        }
        /** set the position adjustments to the emoji picker element */
        this._renderer.setStyle(this._el.nativeElement, "transform", "translate(" + widthCorrection + "px," + heightCorrection + "px)");
    };
    EmojiPickerComponent.prototype.onBackground = function (event) {
        /** internal mousedowns are ignored */
        if (event === this._lastHostMousedownEvent || event.emojiPickerExempt) {
            return;
        }
        this.pickerCloseEmitter.emit(event);
    };
    EmojiPickerComponent.prototype.ngOnDestroy = function () {
        this._destroyed.next(true);
    };
    EmojiPickerComponent.ctorParameters = function () { return [
        { type: Renderer2 },
        { type: ElementRef }
    ]; };
    __decorate([
        Output("emoji-select"),
        __metadata("design:type", Object)
    ], EmojiPickerComponent.prototype, "selectionEmitter", void 0);
    __decorate([
        Output("picker-close"),
        __metadata("design:type", Object)
    ], EmojiPickerComponent.prototype, "pickerCloseEmitter", void 0);
    EmojiPickerComponent = __decorate([
        Component({
            selector: "emoji-picker",
            template: "\n    <emoji-content\n      (emoji-selection)=\"selectionEmitter.emit($event)\"\n    ></emoji-content>\n  ",
            host: {
                "(document:click)": "onBackground($event)",
                "(click)": "_lastHostMousedownEvent = $event",
                "(window:resize)": "_windowResize.next($event)",
            },
            styles: [":host { position: absolute; z-index: 9999; display: none; }"]
        }),
        __metadata("design:paramtypes", [Renderer2, ElementRef])
    ], EmojiPickerComponent);
    return EmojiPickerComponent;
}());
export { EmojiPickerComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW1vamktcGlja2VyLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL25neC1lbW9qaS1waWNrZXIvIiwic291cmNlcyI6WyJsaWIvY29tcG9uZW50cy9lbW9qaS1waWNrZXIuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQ0wsU0FBUyxFQUNULFlBQVksRUFDWixNQUFNLEVBQ04sVUFBVSxFQUNWLFNBQVMsR0FDVixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sMkJBQTJCLENBQUM7QUFDdkQsT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUMvQixPQUFPLEVBQUUsU0FBUyxFQUFFLFlBQVksRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBZ0J6RDtJQVdFLDhCQUFvQixTQUFvQixFQUFVLEdBQTRCO1FBQTlFLGlCQU1DO1FBTm1CLGNBQVMsR0FBVCxTQUFTLENBQVc7UUFBVSxRQUFHLEdBQUgsR0FBRyxDQUF5QjtRQVZ0RCxxQkFBZ0IsR0FBRyxJQUFJLFlBQVksRUFBRSxDQUFDO1FBQ3RDLHVCQUFrQixHQUFHLElBQUksWUFBWSxFQUFFLENBQUM7UUFNekQsa0JBQWEsR0FBRyxJQUFJLE9BQU8sRUFBTyxDQUFDO1FBQ25DLGVBQVUsR0FBRyxJQUFJLE9BQU8sRUFBVyxDQUFDO1FBR3pDLElBQUksQ0FBQyxhQUFhO2FBQ2YsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLEVBQUUsWUFBWSxDQUFDLEdBQUcsQ0FBQyxDQUFDO2FBQ25ELFNBQVMsQ0FBQyxVQUFDLEtBQUs7WUFDZixLQUFJLENBQUMsV0FBVyxDQUFDLEtBQUksQ0FBQyxjQUFjLEVBQUUsS0FBSSxDQUFDLGlCQUFpQixDQUFDLENBQUM7UUFDaEUsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDO0lBRUQsbUNBQUksR0FBSjtRQUNFLElBQUksQ0FBQyxTQUFTLENBQUMsUUFB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WUFFeEIsUUFBUSxFQUFFLDRHQUlUO1lBQ0QsSUFBSSxFQUFFO2dCQUNKLGtCQUFrQixFQUFFLHNCQUFzQjtnQkFDMUMsU0FBUyxFQUFFLGtDQUFrQztnQkFDN0MsaUJBQWlCLEVBQUUsNEJBQTRCO2FBQ2hEO3FCQVZRLDZEQUE2RDtTQVd2RSxDQUFDO3lDQVkrQixTQUFTLEVBQWUsVUFBVTtPQVh0RCxvQkFBb0IsQ0EySGhDO0lBQUQsMkJBQUM7Q0FBQSxBQTNIRCxJQTJIQztTQTNIWSxvQkFBb0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBDb21wb25lbnQsXG4gIEV2ZW50RW1pdHRlcixcbiAgT3V0cHV0LFxuICBFbGVtZW50UmVmLFxuICBSZW5kZXJlcjIsXG59IGZyb20gXCJAYW5ndWxhci9jb3JlXCI7XG5pbXBvcnQgeyBESVJFQ1RJT05TIH0gZnJvbSBcIi4uL21pc2MvcGlja2VyLWRpcmVjdGlvbnNcIjtcbmltcG9ydCB7IFN1YmplY3QgfSBmcm9tIFwicnhqc1wiO1xuaW1wb3J0IHsgdGFrZVVudGlsLCBkZWJvdW5jZVRpbWUgfSBmcm9tIFwicnhqcy9vcGVyYXRvcnNcIjtcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiBcImVtb2ppLXBpY2tlclwiLFxuICBzdHlsZXM6IFtcIjpob3N0IHsgcG9zaXRpb246IGFic29sdXRlOyB6LWluZGV4OiA5OTk5OyBkaXNwbGF5OiBub25lOyB9XCJdLFxuICB0ZW1wbGF0ZTogYFxuICAgIDxlbW9qaS1jb250ZW50XG4gICAgICAoZW1vamktc2VsZWN0aW9uKT1cInNlbGVjdGlvbkVtaXR0ZXIuZW1pdCgkZXZlbnQpXCJcbiAgICA+PC9lbW9qaS1jb250ZW50PlxuICBgLFxuICBob3N0OiB7XG4gICAgXCIoZG9jdW1lbnQ6Y2xpY2spXCI6IFwib25CYWNrZ3JvdW5kKCRldmVudClcIixcbiAgICBcIihjbGljaylcIjogXCJfbGFzdEhvc3RNb3VzZWRvd25FdmVudCA9ICRldmVudFwiLFxuICAgIFwiKHdpbmRvdzpyZXNpemUpXCI6IFwiX3dpbmRvd1Jlc2l6ZS5uZXh0KCRldmVudClcIixcbiAgfSxcbn0pXG5leHBvcnQgY2xhc3MgRW1vamlQaWNrZXJDb21wb25lbnQge1xuICBAT3V0cHV0KFwiZW1vamktc2VsZWN0XCIpIHNlbGVjdGlvbkVtaXR0ZXIgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gIEBPdXRwdXQoXCJwaWNrZXItY2xvc2VcIikgcGlja2VyQ2xvc2VFbWl0dGVyID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXG4gIHB1YmxpYyBfbGFzdEhvc3RNb3VzZWRvd25FdmVudDtcbiAgcHVibGljIF9jdXJyZW50VGFyZ2V0OiBFbGVtZW50UmVmO1xuICBwdWJsaWMgX2N1cnJlbnREaXJlY3Rpb246IERJUkVDVElPTlM7XG5cbiAgcHVibGljIF93aW5kb3dSZXNpemUgPSBuZXcgU3ViamVjdDxhbnk+KCk7XG4gIHB1YmxpYyBfZGVzdHJveWVkID0gbmV3IFN1YmplY3Q8Ym9vbGVhbj4oKTtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIF9yZW5kZXJlcjogUmVuZGVyZXIyLCBwcml2YXRlIF9lbDogRWxlbWVudFJlZjxIVE1MRWxlbWVudD4pIHtcbiAgICB0aGlzLl93aW5kb3dSZXNpemVcbiAgICAgIC5waXBlKHRha2VVbnRpbCh0aGlzLl9kZXN0cm95ZWQpLCBkZWJvdW5jZVRpbWUoMTAwKSlcbiAgICAgIC5zdWJzY3JpYmUoKGV2ZW50KSA9PiB7XG4gICAgICAgIHRoaXMuc2V0UG9zaXRpb24odGhpcy5fY3VycmVudFRhcmdldCwgdGhpcy5fY3VycmVudERpcmVjdGlvbik7XG4gICAgICB9KTtcbiAgfVxuXG4gIGhpZGUoKSB7XG4gICAgdGhpcy5fcmVuZGVyZXIuc2V0U3R5bGUodGhpcy5fZWwubmF0aXZlRWxlbWVudCwgXCJkaXNwbGF5XCIsIFwibm9uZVwiKTtcbiAgfVxuXG4gIHNob3coKSB7XG4gICAgdGhpcy5fcmVuZGVyZXIuc2V0U3R5bGUodGhpcy5fZWwubmF0aXZlRWxlbWVudCwgXCJkaXNwbGF5XCIsIFwiYmxvY2tcIik7XG4gICAgdGhpcy5zZXRQb3NpdGlvbih0aGlzLl9jdXJyZW50VGFyZ2V0LCB0aGlzLl9jdXJyZW50RGlyZWN0aW9uKTtcbiAgfVxuXG4gIHNldFBvc2l0aW9uKFxuICAgIHRhcmdldDogRWxlbWVudFJlZixcbiAgICBkaXJlY3Rpb25Db2RlOiBESVJFQ1RJT05TID0gRElSRUNUSU9OUy5ib3R0b21cbiAgKSB7XG4gICAgaWYgKCF0YXJnZXQpIHtcbiAgICAgIHJldHVybiBjb25zb2xlLmVycm9yKFxuICAgICAgICBcIkVtb2ppLVBpY2tlcjogcG9zaXRpb25pbmcgZmFpbGVkIGR1ZSB0byBtaXNzaW5nIHRhcmdldCBlbGVtZW50IG9yIGRpcmVjdGlvbiBjb2RlXCJcbiAgICAgICk7XG4gICAgfVxuXG4gICAgdGhpcy5fcmVuZGVyZXIuc2V0U3R5bGUodGhpcy5fZWwubmF0aXZlRWxlbWVudCwgXCJ0cmFuc2Zvcm1cIiwgXCJcIik7XG5cbiAgICAvKiogU3RvcmUgYW5jaG9yIGFuZCBkaXJlY3Rpb24gKi9cbiAgICB0aGlzLl9jdXJyZW50VGFyZ2V0ID0gdGFyZ2V0O1xuICAgIHRoaXMuX2N1cnJlbnREaXJlY3Rpb24gPSBkaXJlY3Rpb25Db2RlO1xuXG4gICAgY29uc3QgdGFyZ2V0Qm9yZGVycyA9IHRhcmdldC5uYXRpdmVFbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLFxuICAgICAgdGhpc0JvcmRlcnMgPSB0aGlzLl9lbC5uYXRpdmVFbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuXG4gICAgbGV0IGhlaWdodENvcnJlY3Rpb24gPSAwLFxuICAgICAgd2lkdGhDb3JyZWN0aW9uID0gMDtcblxuICAgIC8qKiBTZXR0aW5nIHVwIGNlbnRlcmluZyBvZiBwaWNrZXIgZm9yIGFsbCBjYXNlcyAqL1xuICAgIHN3aXRjaCAodGhpcy5fY3VycmVudERpcmVjdGlvbikge1xuICAgICAgY2FzZSBESVJFQ1RJT05TLnRvcDpcbiAgICAgIGNhc2UgRElSRUNUSU9OUy5ib3R0b206XG4gICAgICAgIHdpZHRoQ29ycmVjdGlvbiA9XG4gICAgICAgICAgdGFyZ2V0Qm9yZGVycy5sZWZ0IC1cbiAgICAgICAgICB0aGlzQm9yZGVycy5sZWZ0ICtcbiAgICAgICAgICAodGFyZ2V0Qm9yZGVycy53aWR0aCAtIHRoaXNCb3JkZXJzLndpZHRoKSAvIDI7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBESVJFQ1RJT05TLmxlZnQ6XG4gICAgICBjYXNlIERJUkVDVElPTlMucmlnaHQ6XG4gICAgICAgIGhlaWdodENvcnJlY3Rpb24gPVxuICAgICAgICAgIHRhcmdldEJvcmRlcnMudG9wIC1cbiAgICAgICAgICB0aGlzQm9yZGVycy50b3AgK1xuICAgICAgICAgICh0YXJnZXRCb3JkZXJzLmhlaWdodCAtIHRoaXNCb3JkZXJzLmhlaWdodCkgLyAyO1xuICAgICAgICBicmVhaztcbiAgICB9XG5cbiAgICAvKiogU2V0dGluZyB1cCByZWxhdGl2ZSBwb3NpdGlvbmluZyBmb3IgYWxsIGNhc2VzICovXG4gICAgc3dpdGNoICh0aGlzLl9jdXJyZW50RGlyZWN0aW9uKSB7XG4gICAgICBjYXNlIERJUkVDVElPTlMudG9wOlxuICAgICAgICBoZWlnaHRDb3JyZWN0aW9uID0gdGFyZ2V0Qm9yZGVycy50b3AgLSB0aGlzQm9yZGVycy5ib3R0b207XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBESVJFQ1RJT05TLmxlZnQ6XG4gICAgICAgIHdpZHRoQ29ycmVjdGlvbiA9IHRhcmdldEJvcmRlcnMubGVmdCAtIHRoaXNCb3JkZXJzLnJpZ2h0O1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgRElSRUNUSU9OUy5yaWdodDpcbiAgICAgICAgd2lkdGhDb3JyZWN0aW9uID0gdGFyZ2V0Qm9yZGVycy5yaWdodCAtIHRoaXNCb3JkZXJzLmxlZnQ7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBESVJFQ1RJT05TLmJvdHRvbTpcbiAgICAgICAgaGVpZ2h0Q29ycmVjdGlvbiA9IHRhcmdldEJvcmRlcnMuYm90dG9tIC0gdGhpc0JvcmRlcnMudG9wO1xuICAgICAgICBicmVhaztcbiAgICB9XG5cbiAgICAvKiogQ29ycmVjdGluZyBwb3NpdGlvbmluZyBkdWUgdG8gb3ZlcmZsb3cgcHJvYmxlbXMgKi9cbiAgICBpZiAodGhpc0JvcmRlcnMuYm90dG9tICsgaGVpZ2h0Q29ycmVjdGlvbiA+IHdpbmRvdy5pbm5lckhlaWdodCkge1xuICAgICAgaGVpZ2h0Q29ycmVjdGlvbiArPVxuICAgICAgICB3aW5kb3cuaW5uZXJIZWlnaHQgLSAodGhpc0JvcmRlcnMuYm90dG9tICsgaGVpZ2h0Q29ycmVjdGlvbik7XG4gICAgfVxuXG4gICAgaWYgKHRoaXNCb3JkZXJzLnRvcCArIGhlaWdodENvcnJlY3Rpb24gPCAwKSB7XG4gICAgICBoZWlnaHRDb3JyZWN0aW9uIC09IHRoaXNCb3JkZXJzLnRvcCArIGhlaWdodENvcnJlY3Rpb247XG4gICAgfVxuXG4gICAgaWYgKHRoaXNCb3JkZXJzLnJpZ2h0ICsgd2lkdGhDb3JyZWN0aW9uID4gd2luZG93LmlubmVyV2lkdGgpIHtcbiAgICAgIHdpZHRoQ29ycmVjdGlvbiArPVxuICAgICAgICB3aW5kb3cuaW5uZXJXaWR0aCAtICh0aGlzQm9yZGVycy5yaWdodCArIHdpZHRoQ29ycmVjdGlvbik7XG4gICAgfVxuXG4gICAgaWYgKHRoaXNCb3JkZXJzLmxlZnQgKyB3aWR0aENvcnJlY3Rpb24gPCAwKSB7XG4gICAgICB3aWR0aENvcnJlY3Rpb24gLT0gdGhpc0JvcmRlcnMubGVmdCArIHdpZHRoQ29ycmVjdGlvbjtcbiAgICB9XG5cbiAgICAvKiogc2V0IHRoZSBwb3NpdGlvbiBhZGp1c3RtZW50cyB0byB0aGUgZW1vamkgcGlja2VyIGVsZW1lbnQgKi9cbiAgICB0aGlzLl9yZW5kZXJlci5zZXRTdHlsZShcbiAgICAgIHRoaXMuX2VsLm5hdGl2ZUVsZW1lbnQsXG4gICAgICBcInRyYW5zZm9ybVwiLFxuICAgICAgYHRyYW5zbGF0ZSgke3dpZHRoQ29ycmVjdGlvbn1weCwke2hlaWdodENvcnJlY3Rpb259cHgpYFxuICAgICk7XG4gIH1cblxuICBvbkJhY2tncm91bmQoZXZlbnQpIHtcbiAgICAvKiogaW50ZXJuYWwgbW91c2Vkb3ducyBhcmUgaWdub3JlZCAqL1xuICAgIGlmIChldmVudCA9PT0gdGhpcy5fbGFzdEhvc3RNb3VzZWRvd25FdmVudCB8fCBldmVudC5lbW9qaVBpY2tlckV4ZW1wdCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMucGlja2VyQ2xvc2VFbWl0dGVyLmVtaXQoZXZlbnQpO1xuICB9XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgdGhpcy5fZGVzdHJveWVkLm5leHQodHJ1ZSk7XG4gIH1cbn1cbiJdfQ==