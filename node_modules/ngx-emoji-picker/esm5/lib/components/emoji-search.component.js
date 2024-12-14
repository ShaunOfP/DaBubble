import { __decorate, __metadata } from "tslib";
import { Component, EventEmitter, Output, ViewChild, ElementRef, } from "@angular/core";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
var EmojiSearchComponent = /** @class */ (function () {
    function EmojiSearchComponent() {
        var _this = this;
        this.searchEmitter = new EventEmitter();
        this._searchValue = new Subject();
        this._destroyed = new Subject();
        this._searchValue.pipe(takeUntil(this._destroyed)).subscribe(function (value) {
            _this.searchEmitter.emit(value);
        });
    }
    EmojiSearchComponent.prototype.handleInputChange = function (event) {
        this._searchValue.next(event);
    };
    EmojiSearchComponent.prototype.ngOnDestroy = function () {
        this._destroyed.next(true);
    };
    __decorate([
        Output("search"),
        __metadata("design:type", EventEmitter)
    ], EmojiSearchComponent.prototype, "searchEmitter", void 0);
    __decorate([
        ViewChild("input", { static: true }),
        __metadata("design:type", ElementRef)
    ], EmojiSearchComponent.prototype, "input", void 0);
    EmojiSearchComponent = __decorate([
        Component({
            selector: "emoji-search",
            template: "\n    <input\n      type=\"text\"\n      autocomplete=\"off\"\n      #input\n      (input)=\"handleInputChange($event.target.value)\"\n      aria-label=\"Search\"\n      placeholder=\"Search\"\n    />\n  ",
            styles: ["input{width:100%;padding:5px 10px;border:1px solid #f0f0f0;outline:0;font-size:14px;font-weight:inherit;box-sizing:border-box}input:focus{border-color:#d7d7d7}"]
        }),
        __metadata("design:paramtypes", [])
    ], EmojiSearchComponent);
    return EmojiSearchComponent;
}());
export { EmojiSearchComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW1vamktc2VhcmNoLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL25neC1lbW9qaS1waWNrZXIvIiwic291cmNlcyI6WyJsaWIvY29tcG9uZW50cy9lbW9qaS1zZWFyY2guY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQ0wsU0FBUyxFQUNULFlBQVksRUFDWixNQUFNLEVBQ04sU0FBUyxFQUNULFVBQVUsR0FFWCxNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUUsT0FBTyxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBQy9CLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQWdCM0M7SUFPRTtRQUFBLGlCQUlDO1FBVmlCLGtCQUFhLEdBQXlCLElBQUksWUFBWSxFQUFFLENBQUM7UUFHbkUsaUJBQVksR0FBb0IsSUFBSSxPQUFPLEVBQUUsQ0FBQztRQUM5QyxlQUFVLEdBQUcsSUFBSSxPQUFPLEVBQVcsQ0FBQztRQUcxQyxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLFVBQUMsS0FBSztZQUNqRSxLQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUNqQyxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFRCxnREFBaUIsR0FBakIsVUFBa0IsS0FBSztRQUNyQixJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUNoQyxDQUFDO0lBRUQsMENBQVcsR0FBWDtRQUNFLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQzdCLENBQUM7SUFsQmlCO1FBQWpCLE1BQU0sQ0FBQyxRQUFRLENBQUM7a0NBQWdCLFlBQVk7K0RBQThCO0lBQ3JDO1FBQXJDLFNBQVMsQ0FBQyxPQUFPLEVBQUUsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLENBQUM7a0NBQVEsVUFBVTt1REFBQztJQUY3QyxvQkFBb0I7UUFkaEMsU0FBUyxDQUFDO1lBQ1QsUUFBUSxFQUFFLGNBQWM7WUFFeEIsUUFBUSxFQUFFLDhNQVNUOztTQUNGLENBQUM7O09BQ1csb0JBQW9CLENBb0JoQztJQUFELDJCQUFDO0NBQUEsQUFwQkQsSUFvQkM7U0FwQlksb0JBQW9CIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgQ29tcG9uZW50LFxuICBFdmVudEVtaXR0ZXIsXG4gIE91dHB1dCxcbiAgVmlld0NoaWxkLFxuICBFbGVtZW50UmVmLFxuICBPbkRlc3Ryb3ksXG59IGZyb20gXCJAYW5ndWxhci9jb3JlXCI7XG5pbXBvcnQgeyBTdWJqZWN0IH0gZnJvbSBcInJ4anNcIjtcbmltcG9ydCB7IHRha2VVbnRpbCB9IGZyb20gXCJyeGpzL29wZXJhdG9yc1wiO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6IFwiZW1vamktc2VhcmNoXCIsXG4gIHN0eWxlVXJsczogW1wiLi4vc3R5bGVzL2Vtb2ppLXNlYXJjaC5zY3NzXCJdLFxuICB0ZW1wbGF0ZTogYFxuICAgIDxpbnB1dFxuICAgICAgdHlwZT1cInRleHRcIlxuICAgICAgYXV0b2NvbXBsZXRlPVwib2ZmXCJcbiAgICAgICNpbnB1dFxuICAgICAgKGlucHV0KT1cImhhbmRsZUlucHV0Q2hhbmdlKCRldmVudC50YXJnZXQudmFsdWUpXCJcbiAgICAgIGFyaWEtbGFiZWw9XCJTZWFyY2hcIlxuICAgICAgcGxhY2Vob2xkZXI9XCJTZWFyY2hcIlxuICAgIC8+XG4gIGAsXG59KVxuZXhwb3J0IGNsYXNzIEVtb2ppU2VhcmNoQ29tcG9uZW50IGltcGxlbWVudHMgT25EZXN0cm95IHtcbiAgQE91dHB1dChcInNlYXJjaFwiKSBzZWFyY2hFbWl0dGVyOiBFdmVudEVtaXR0ZXI8c3RyaW5nPiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgQFZpZXdDaGlsZChcImlucHV0XCIsIHsgc3RhdGljOiB0cnVlIH0pIGlucHV0OiBFbGVtZW50UmVmO1xuXG4gIHByaXZhdGUgX3NlYXJjaFZhbHVlOiBTdWJqZWN0PHN0cmluZz4gPSBuZXcgU3ViamVjdCgpO1xuICBwcml2YXRlIF9kZXN0cm95ZWQgPSBuZXcgU3ViamVjdDxib29sZWFuPigpO1xuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuX3NlYXJjaFZhbHVlLnBpcGUodGFrZVVudGlsKHRoaXMuX2Rlc3Ryb3llZCkpLnN1YnNjcmliZSgodmFsdWUpID0+IHtcbiAgICAgIHRoaXMuc2VhcmNoRW1pdHRlci5lbWl0KHZhbHVlKTtcbiAgICB9KTtcbiAgfVxuXG4gIGhhbmRsZUlucHV0Q2hhbmdlKGV2ZW50KSB7XG4gICAgdGhpcy5fc2VhcmNoVmFsdWUubmV4dChldmVudCk7XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICB0aGlzLl9kZXN0cm95ZWQubmV4dCh0cnVlKTtcbiAgfVxufVxuIl19