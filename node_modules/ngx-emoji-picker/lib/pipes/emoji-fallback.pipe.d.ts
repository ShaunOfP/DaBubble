import { PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
export declare class EmojiFallback implements PipeTransform {
    private domSanitizer;
    constructor(domSanitizer: DomSanitizer);
    transform(emoji: string): string | SafeHtml;
    supportsEmoji(): boolean;
}
