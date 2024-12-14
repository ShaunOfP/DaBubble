import { __decorate, __metadata } from "tslib";
import { Pipe } from '@angular/core';
import twemoji from 'twemoji';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
var EmojiFallback = /** @class */ (function () {
    function EmojiFallback(domSanitizer) {
        this.domSanitizer = domSanitizer;
    }
    EmojiFallback.prototype.transform = function (emoji) {
        return !emoji || this.supportsEmoji() ? emoji : this.domSanitizer.bypassSecurityTrustHtml(twemoji.parse(emoji.trim()));
    };
    // Solution: https://stackoverflow.com/questions/45576748/how-can-i-detect-rendering-support-for-emoji-in-javascript
    EmojiFallback.prototype.supportsEmoji = function () {
        var ctx = document.createElement("canvas").getContext("2d");
        ctx.fillText("🙃", -2, 4);
        return ctx.getImageData(0, 0, 1, 1).data[3] > 0;
    };
    EmojiFallback.ctorParameters = function () { return [
        { type: DomSanitizer }
    ]; };
    EmojiFallback = __decorate([
        Pipe({
            name: 'emojiFallback'
        }),
        __metadata("design:paramtypes", [DomSanitizer])
    ], EmojiFallback);
    return EmojiFallback;
}());
export { EmojiFallback };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW1vamktZmFsbGJhY2sucGlwZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL25neC1lbW9qaS1waWNrZXIvIiwic291cmNlcyI6WyJsaWIvcGlwZXMvZW1vamktZmFsbGJhY2sucGlwZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsT0FBTyxFQUFFLElBQUksRUFBaUIsTUFBTSxlQUFlLENBQUM7QUFDcEQsT0FBTyxPQUFPLE1BQU0sU0FBUyxDQUFDO0FBQzlCLE9BQU8sRUFBRSxZQUFZLEVBQUUsUUFBUSxFQUFFLE1BQU0sMkJBQTJCLENBQUM7QUFLbkU7SUFDRSx1QkFBb0IsWUFBMEI7UUFBMUIsaUJBQVksR0FBWixZQUFZLENBQWM7SUFFOUMsQ0FBQztJQUVELGlDQUFTLEdBQVQsVUFBVSxLQUFhO1FBQ3RCLE9BQU8sQ0FBQyxLQUFLLElBQUksSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsdUJBQXVCLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBQ3hILENBQUM7SUFFRCxvSEFBb0g7SUFDcEgscUNBQWEsR0FBYjtRQUNFLElBQUksR0FBRyxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQzVELEdBQUcsQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQzFCLE9BQU8sR0FBRyxDQUFDLFlBQVksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ2xELENBQUM7O2dCQWJpQyxZQUFZOztJQURuQyxhQUFhO1FBSHpCLElBQUksQ0FBQztZQUNKLElBQUksRUFBRSxlQUFlO1NBQ3RCLENBQUM7eUNBRWtDLFlBQVk7T0FEbkMsYUFBYSxDQWV6QjtJQUFELG9CQUFDO0NBQUEsQUFmRCxJQWVDO1NBZlksYUFBYSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFBpcGUsIFBpcGVUcmFuc2Zvcm0gfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB0d2Vtb2ppIGZyb20gJ3R3ZW1vamknO1xuaW1wb3J0IHsgRG9tU2FuaXRpemVyLCBTYWZlSHRtbCB9IGZyb20gJ0Bhbmd1bGFyL3BsYXRmb3JtLWJyb3dzZXInO1xuXG5AUGlwZSh7XG4gIG5hbWU6ICdlbW9qaUZhbGxiYWNrJ1xufSlcbmV4cG9ydCBjbGFzcyBFbW9qaUZhbGxiYWNrIGltcGxlbWVudHMgUGlwZVRyYW5zZm9ybSB7XG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgZG9tU2FuaXRpemVyOiBEb21TYW5pdGl6ZXIpIHtcblxuICB9XG4gIFxuICB0cmFuc2Zvcm0oZW1vamk6IHN0cmluZyk6IHN0cmluZ3xTYWZlSHRtbCB7XG4gICByZXR1cm4gIWVtb2ppIHx8IHRoaXMuc3VwcG9ydHNFbW9qaSgpID8gZW1vamkgOiB0aGlzLmRvbVNhbml0aXplci5ieXBhc3NTZWN1cml0eVRydXN0SHRtbCh0d2Vtb2ppLnBhcnNlKGVtb2ppLnRyaW0oKSkpO1xuICB9XG5cbiAgLy8gU29sdXRpb246IGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzQ1NTc2NzQ4L2hvdy1jYW4taS1kZXRlY3QtcmVuZGVyaW5nLXN1cHBvcnQtZm9yLWVtb2ppLWluLWphdmFzY3JpcHRcbiAgc3VwcG9ydHNFbW9qaSgpIHtcbiAgICB2YXIgY3R4ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImNhbnZhc1wiKS5nZXRDb250ZXh0KFwiMmRcIik7XG4gICAgY3R4LmZpbGxUZXh0KFwi8J+Zg1wiLCAtMiwgNCk7XG4gICAgcmV0dXJuIGN0eC5nZXRJbWFnZURhdGEoMCwgMCwgMSwgMSkuZGF0YVszXSA+IDA7XG4gIH1cbn1cbiJdfQ==