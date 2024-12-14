import { __decorate } from "tslib";
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmojiButtonComponent } from './components/emoji-button.component';
import { EmojiCategoriesComponent } from './components/emoji-categories.component';
import { EmojiCategoryComponent } from './components/emoji-category.component';
import { EmojiContentComponent } from './components/emoji-content.component';
import { EmojiFooterComponent } from './components/emoji-footer.component';
import { EmojiHeaderComponent } from './components/emoji-header.component';
import { EmojiListComponent } from './components/emoji-list.component';
import { EmojiSearchComponent } from './components/emoji-search.component';
import { EmojiPickerApiDirective } from './directives/emoji-picker-api.directive';
import { EmojiPickerCaretDirective } from './directives/emoji-picker-caret.directive';
import { EmojiEmptyCategoryPipe } from './pipes/emoji-empty-category.pipe';
import { EmojiPickerComponent } from './components/emoji-picker.component';
import { EmojiFallback } from './pipes/emoji-fallback.pipe';
var NgxEmojiPickerModule = /** @class */ (function () {
    function NgxEmojiPickerModule() {
    }
    NgxEmojiPickerModule_1 = NgxEmojiPickerModule;
    NgxEmojiPickerModule.forRoot = function () {
        return {
            ngModule: NgxEmojiPickerModule_1,
            providers: []
        };
    };
    var NgxEmojiPickerModule_1;
    NgxEmojiPickerModule = NgxEmojiPickerModule_1 = __decorate([
        NgModule({
            declarations: [
                EmojiPickerApiDirective,
                EmojiPickerCaretDirective,
                EmojiButtonComponent,
                EmojiContentComponent,
                EmojiPickerComponent,
                EmojiListComponent,
                EmojiHeaderComponent,
                EmojiSearchComponent,
                EmojiCategoriesComponent,
                EmojiCategoryComponent,
                EmojiFooterComponent,
                EmojiEmptyCategoryPipe,
                EmojiFallback
            ],
            imports: [
                CommonModule
            ],
            exports: [
                EmojiPickerApiDirective,
                EmojiPickerCaretDirective,
                EmojiButtonComponent,
                EmojiContentComponent,
                EmojiPickerComponent,
                EmojiListComponent,
                EmojiHeaderComponent,
                EmojiSearchComponent,
                EmojiCategoriesComponent,
                EmojiCategoryComponent,
                EmojiFooterComponent
            ],
            providers: [],
            entryComponents: [EmojiPickerComponent]
        })
    ], NgxEmojiPickerModule);
    return NgxEmojiPickerModule;
}());
export { NgxEmojiPickerModule };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LWVtb2ppLXBpY2tlci5tb2R1bGUuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9uZ3gtZW1vamktcGlja2VyLyIsInNvdXJjZXMiOlsibGliL25neC1lbW9qaS1waWNrZXIubW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQUUsUUFBUSxFQUF1QixNQUFNLGVBQWUsQ0FBQztBQUM5RCxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFFL0MsT0FBTyxFQUFFLG9CQUFvQixFQUFFLE1BQU0scUNBQXFDLENBQUM7QUFDM0UsT0FBTyxFQUFFLHdCQUF3QixFQUFFLE1BQU0seUNBQXlDLENBQUM7QUFDbkYsT0FBTyxFQUFFLHNCQUFzQixFQUFFLE1BQU0sdUNBQXVDLENBQUM7QUFDL0UsT0FBTyxFQUFFLHFCQUFxQixFQUFFLE1BQU0sc0NBQXNDLENBQUM7QUFDN0UsT0FBTyxFQUFFLG9CQUFvQixFQUFFLE1BQU0scUNBQXFDLENBQUM7QUFDM0UsT0FBTyxFQUFFLG9CQUFvQixFQUFFLE1BQU0scUNBQXFDLENBQUM7QUFDM0UsT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0sbUNBQW1DLENBQUM7QUFDdkUsT0FBTyxFQUFFLG9CQUFvQixFQUFFLE1BQU0scUNBQXFDLENBQUM7QUFFM0UsT0FBTyxFQUFFLHVCQUF1QixFQUFFLE1BQU0seUNBQXlDLENBQUM7QUFDbEYsT0FBTyxFQUFFLHlCQUF5QixFQUFFLE1BQU0sMkNBQTJDLENBQUM7QUFDdEYsT0FBTyxFQUFFLHNCQUFzQixFQUFFLE1BQU0sbUNBQW1DLENBQUM7QUFDM0UsT0FBTyxFQUFFLG9CQUFvQixFQUFFLE1BQU0scUNBQXFDLENBQUM7QUFDM0UsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLDZCQUE2QixDQUFDO0FBc0M1RDtJQUFBO0lBT0MsQ0FBQzs2QkFQVyxvQkFBb0I7SUFDeEIsNEJBQU8sR0FBZDtRQUNFLE9BQU87WUFDTCxRQUFRLEVBQUUsc0JBQW9CO1lBQzlCLFNBQVMsRUFBRSxFQUFFO1NBQ2QsQ0FBQztJQUNKLENBQUM7O0lBTlUsb0JBQW9CO1FBbkNoQyxRQUFRLENBQUM7WUFDUixZQUFZLEVBQUU7Z0JBQ1osdUJBQXVCO2dCQUN2Qix5QkFBeUI7Z0JBQ3pCLG9CQUFvQjtnQkFDcEIscUJBQXFCO2dCQUNyQixvQkFBb0I7Z0JBQ3BCLGtCQUFrQjtnQkFDbEIsb0JBQW9CO2dCQUNwQixvQkFBb0I7Z0JBQ3BCLHdCQUF3QjtnQkFDeEIsc0JBQXNCO2dCQUN0QixvQkFBb0I7Z0JBQ3BCLHNCQUFzQjtnQkFDdEIsYUFBYTthQUNkO1lBQ0QsT0FBTyxFQUFFO2dCQUNQLFlBQVk7YUFDYjtZQUNELE9BQU8sRUFBRTtnQkFDUCx1QkFBdUI7Z0JBQ3ZCLHlCQUF5QjtnQkFDekIsb0JBQW9CO2dCQUNwQixxQkFBcUI7Z0JBQ3JCLG9CQUFvQjtnQkFDcEIsa0JBQWtCO2dCQUNsQixvQkFBb0I7Z0JBQ3BCLG9CQUFvQjtnQkFDcEIsd0JBQXdCO2dCQUN4QixzQkFBc0I7Z0JBQ3RCLG9CQUFvQjthQUNyQjtZQUNELFNBQVMsRUFBRSxFQUFFO1lBQ2IsZUFBZSxFQUFFLENBQUMsb0JBQW9CLENBQUM7U0FDeEMsQ0FBQztPQUNXLG9CQUFvQixDQU8vQjtJQUFELDJCQUFDO0NBQUEsQUFQRixJQU9FO1NBUFcsb0JBQW9CIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTmdNb2R1bGUsIE1vZHVsZVdpdGhQcm92aWRlcnMgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IENvbW1vbk1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5cbmltcG9ydCB7IEVtb2ppQnV0dG9uQ29tcG9uZW50IH0gZnJvbSAnLi9jb21wb25lbnRzL2Vtb2ppLWJ1dHRvbi5jb21wb25lbnQnO1xuaW1wb3J0IHsgRW1vamlDYXRlZ29yaWVzQ29tcG9uZW50IH0gZnJvbSAnLi9jb21wb25lbnRzL2Vtb2ppLWNhdGVnb3JpZXMuY29tcG9uZW50JztcbmltcG9ydCB7IEVtb2ppQ2F0ZWdvcnlDb21wb25lbnQgfSBmcm9tICcuL2NvbXBvbmVudHMvZW1vamktY2F0ZWdvcnkuY29tcG9uZW50JztcbmltcG9ydCB7IEVtb2ppQ29udGVudENvbXBvbmVudCB9IGZyb20gJy4vY29tcG9uZW50cy9lbW9qaS1jb250ZW50LmNvbXBvbmVudCc7XG5pbXBvcnQgeyBFbW9qaUZvb3RlckNvbXBvbmVudCB9IGZyb20gJy4vY29tcG9uZW50cy9lbW9qaS1mb290ZXIuY29tcG9uZW50JztcbmltcG9ydCB7IEVtb2ppSGVhZGVyQ29tcG9uZW50IH0gZnJvbSAnLi9jb21wb25lbnRzL2Vtb2ppLWhlYWRlci5jb21wb25lbnQnO1xuaW1wb3J0IHsgRW1vamlMaXN0Q29tcG9uZW50IH0gZnJvbSAnLi9jb21wb25lbnRzL2Vtb2ppLWxpc3QuY29tcG9uZW50JztcbmltcG9ydCB7IEVtb2ppU2VhcmNoQ29tcG9uZW50IH0gZnJvbSAnLi9jb21wb25lbnRzL2Vtb2ppLXNlYXJjaC5jb21wb25lbnQnO1xuXG5pbXBvcnQgeyBFbW9qaVBpY2tlckFwaURpcmVjdGl2ZSB9IGZyb20gJy4vZGlyZWN0aXZlcy9lbW9qaS1waWNrZXItYXBpLmRpcmVjdGl2ZSc7XG5pbXBvcnQgeyBFbW9qaVBpY2tlckNhcmV0RGlyZWN0aXZlIH0gZnJvbSAnLi9kaXJlY3RpdmVzL2Vtb2ppLXBpY2tlci1jYXJldC5kaXJlY3RpdmUnO1xuaW1wb3J0IHsgRW1vamlFbXB0eUNhdGVnb3J5UGlwZSB9IGZyb20gJy4vcGlwZXMvZW1vamktZW1wdHktY2F0ZWdvcnkucGlwZSc7XG5pbXBvcnQgeyBFbW9qaVBpY2tlckNvbXBvbmVudCB9IGZyb20gJy4vY29tcG9uZW50cy9lbW9qaS1waWNrZXIuY29tcG9uZW50JztcbmltcG9ydCB7IEVtb2ppRmFsbGJhY2sgfSBmcm9tICcuL3BpcGVzL2Vtb2ppLWZhbGxiYWNrLnBpcGUnO1xuXG5cbkBOZ01vZHVsZSh7XG4gIGRlY2xhcmF0aW9uczogW1xuICAgIEVtb2ppUGlja2VyQXBpRGlyZWN0aXZlLFxuICAgIEVtb2ppUGlja2VyQ2FyZXREaXJlY3RpdmUsXG4gICAgRW1vamlCdXR0b25Db21wb25lbnQsXG4gICAgRW1vamlDb250ZW50Q29tcG9uZW50LFxuICAgIEVtb2ppUGlja2VyQ29tcG9uZW50LFxuICAgIEVtb2ppTGlzdENvbXBvbmVudCxcbiAgICBFbW9qaUhlYWRlckNvbXBvbmVudCxcbiAgICBFbW9qaVNlYXJjaENvbXBvbmVudCxcbiAgICBFbW9qaUNhdGVnb3JpZXNDb21wb25lbnQsXG4gICAgRW1vamlDYXRlZ29yeUNvbXBvbmVudCxcbiAgICBFbW9qaUZvb3RlckNvbXBvbmVudCxcbiAgICBFbW9qaUVtcHR5Q2F0ZWdvcnlQaXBlLFxuICAgIEVtb2ppRmFsbGJhY2tcbiAgXSxcbiAgaW1wb3J0czogW1xuICAgIENvbW1vbk1vZHVsZVxuICBdLFxuICBleHBvcnRzOiBbXG4gICAgRW1vamlQaWNrZXJBcGlEaXJlY3RpdmUsXG4gICAgRW1vamlQaWNrZXJDYXJldERpcmVjdGl2ZSxcbiAgICBFbW9qaUJ1dHRvbkNvbXBvbmVudCxcbiAgICBFbW9qaUNvbnRlbnRDb21wb25lbnQsXG4gICAgRW1vamlQaWNrZXJDb21wb25lbnQsXG4gICAgRW1vamlMaXN0Q29tcG9uZW50LFxuICAgIEVtb2ppSGVhZGVyQ29tcG9uZW50LFxuICAgIEVtb2ppU2VhcmNoQ29tcG9uZW50LFxuICAgIEVtb2ppQ2F0ZWdvcmllc0NvbXBvbmVudCxcbiAgICBFbW9qaUNhdGVnb3J5Q29tcG9uZW50LFxuICAgIEVtb2ppRm9vdGVyQ29tcG9uZW50XG4gIF0sXG4gIHByb3ZpZGVyczogW10sXG4gIGVudHJ5Q29tcG9uZW50czogW0Vtb2ppUGlja2VyQ29tcG9uZW50XVxufSlcbmV4cG9ydCBjbGFzcyBOZ3hFbW9qaVBpY2tlck1vZHVsZSB7XG4gIHN0YXRpYyBmb3JSb290KCk6IE1vZHVsZVdpdGhQcm92aWRlcnM8Tmd4RW1vamlQaWNrZXJNb2R1bGU+IHtcbiAgICByZXR1cm4ge1xuICAgICAgbmdNb2R1bGU6IE5neEVtb2ppUGlja2VyTW9kdWxlLFxuICAgICAgcHJvdmlkZXJzOiBbXVxuICAgIH07XG4gIH1cbiB9XG4iXX0=