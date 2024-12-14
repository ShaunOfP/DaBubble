import { __decorate, __metadata } from "tslib";
import { Pipe } from '@angular/core';
import twemoji from 'twemoji';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
let EmojiFallback = class EmojiFallback {
    constructor(domSanitizer) {
        this.domSanitizer = domSanitizer;
    }
    transform(emoji) {
        return !emoji || this.supportsEmoji() ? emoji : this.domSanitizer.bypassSecurityTrustHtml(twemoji.parse(emoji.trim()));
    }
    // Solution: https://stackoverflow.com/questions/45576748/how-can-i-detect-rendering-support-for-emoji-in-javascript
    supportsEmoji() {
        var ctx = document.createElement("canvas").getContext("2d");
        ctx.fillText("🙃", -2, 4);
        return ctx.getImageData(0, 0, 1, 1).data[3] > 0;
    }
};
EmojiFallback.ctorParameters = () => [
    { type: DomSanitizer }
];
EmojiFallback = __decorate([
    Pipe({
        name: 'emojiFallback'
    }),
    __metadata("design:paramtypes", [DomSanitizer])
], EmojiFallback);
export { EmojiFallback };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW1vamktZmFsbGJhY2sucGlwZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL25neC1lbW9qaS1waWNrZXIvIiwic291cmNlcyI6WyJsaWIvcGlwZXMvZW1vamktZmFsbGJhY2sucGlwZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsT0FBTyxFQUFFLElBQUksRUFBaUIsTUFBTSxlQUFlLENBQUM7QUFDcEQsT0FBTyxPQUFPLE1BQU0sU0FBUyxDQUFDO0FBQzlCLE9BQU8sRUFBRSxZQUFZLEVBQUUsUUFBUSxFQUFFLE1BQU0sMkJBQTJCLENBQUM7QUFLbkUsSUFBYSxhQUFhLEdBQTFCLE1BQWEsYUFBYTtJQUN4QixZQUFvQixZQUEwQjtRQUExQixpQkFBWSxHQUFaLFlBQVksQ0FBYztJQUU5QyxDQUFDO0lBRUQsU0FBUyxDQUFDLEtBQWE7UUFDdEIsT0FBTyxDQUFDLEtBQUssSUFBSSxJQUFJLENBQUMsYUFBYSxFQUFFLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyx1QkFBdUIsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFDeEgsQ0FBQztJQUVELG9IQUFvSDtJQUNwSCxhQUFhO1FBQ1gsSUFBSSxHQUFHLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDNUQsR0FBRyxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDMUIsT0FBTyxHQUFHLENBQUMsWUFBWSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDbEQsQ0FBQztDQUNGLENBQUE7O1lBZG1DLFlBQVk7O0FBRG5DLGFBQWE7SUFIekIsSUFBSSxDQUFDO1FBQ0osSUFBSSxFQUFFLGVBQWU7S0FDdEIsQ0FBQztxQ0FFa0MsWUFBWTtHQURuQyxhQUFhLENBZXpCO1NBZlksYUFBYSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFBpcGUsIFBpcGVUcmFuc2Zvcm0gfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB0d2Vtb2ppIGZyb20gJ3R3ZW1vamknO1xuaW1wb3J0IHsgRG9tU2FuaXRpemVyLCBTYWZlSHRtbCB9IGZyb20gJ0Bhbmd1bGFyL3BsYXRmb3JtLWJyb3dzZXInO1xuXG5AUGlwZSh7XG4gIG5hbWU6ICdlbW9qaUZhbGxiYWNrJ1xufSlcbmV4cG9ydCBjbGFzcyBFbW9qaUZhbGxiYWNrIGltcGxlbWVudHMgUGlwZVRyYW5zZm9ybSB7XG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgZG9tU2FuaXRpemVyOiBEb21TYW5pdGl6ZXIpIHtcblxuICB9XG4gIFxuICB0cmFuc2Zvcm0oZW1vamk6IHN0cmluZyk6IHN0cmluZ3xTYWZlSHRtbCB7XG4gICByZXR1cm4gIWVtb2ppIHx8IHRoaXMuc3VwcG9ydHNFbW9qaSgpID8gZW1vamkgOiB0aGlzLmRvbVNhbml0aXplci5ieXBhc3NTZWN1cml0eVRydXN0SHRtbCh0d2Vtb2ppLnBhcnNlKGVtb2ppLnRyaW0oKSkpO1xuICB9XG5cbiAgLy8gU29sdXRpb246IGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzQ1NTc2NzQ4L2hvdy1jYW4taS1kZXRlY3QtcmVuZGVyaW5nLXN1cHBvcnQtZm9yLWVtb2ppLWluLWphdmFzY3JpcHRcbiAgc3VwcG9ydHNFbW9qaSgpIHtcbiAgICB2YXIgY3R4ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImNhbnZhc1wiKS5nZXRDb250ZXh0KFwiMmRcIik7XG4gICAgY3R4LmZpbGxUZXh0KFwi8J+Zg1wiLCAtMiwgNCk7XG4gICAgcmV0dXJuIGN0eC5nZXRJbWFnZURhdGEoMCwgMCwgMSwgMSkuZGF0YVszXSA+IDA7XG4gIH1cbn1cbiJdfQ==