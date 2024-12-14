var NgxEmojiPickerModule_1;
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
let NgxEmojiPickerModule = NgxEmojiPickerModule_1 = class NgxEmojiPickerModule {
    static forRoot() {
        return {
            ngModule: NgxEmojiPickerModule_1,
            providers: []
        };
    }
};
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
export { NgxEmojiPickerModule };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LWVtb2ppLXBpY2tlci5tb2R1bGUuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9uZ3gtZW1vamktcGlja2VyLyIsInNvdXJjZXMiOlsibGliL25neC1lbW9qaS1waWNrZXIubW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsT0FBTyxFQUFFLFFBQVEsRUFBdUIsTUFBTSxlQUFlLENBQUM7QUFDOUQsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBRS9DLE9BQU8sRUFBRSxvQkFBb0IsRUFBRSxNQUFNLHFDQUFxQyxDQUFDO0FBQzNFLE9BQU8sRUFBRSx3QkFBd0IsRUFBRSxNQUFNLHlDQUF5QyxDQUFDO0FBQ25GLE9BQU8sRUFBRSxzQkFBc0IsRUFBRSxNQUFNLHVDQUF1QyxDQUFDO0FBQy9FLE9BQU8sRUFBRSxxQkFBcUIsRUFBRSxNQUFNLHNDQUFzQyxDQUFDO0FBQzdFLE9BQU8sRUFBRSxvQkFBb0IsRUFBRSxNQUFNLHFDQUFxQyxDQUFDO0FBQzNFLE9BQU8sRUFBRSxvQkFBb0IsRUFBRSxNQUFNLHFDQUFxQyxDQUFDO0FBQzNFLE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxNQUFNLG1DQUFtQyxDQUFDO0FBQ3ZFLE9BQU8sRUFBRSxvQkFBb0IsRUFBRSxNQUFNLHFDQUFxQyxDQUFDO0FBRTNFLE9BQU8sRUFBRSx1QkFBdUIsRUFBRSxNQUFNLHlDQUF5QyxDQUFDO0FBQ2xGLE9BQU8sRUFBRSx5QkFBeUIsRUFBRSxNQUFNLDJDQUEyQyxDQUFDO0FBQ3RGLE9BQU8sRUFBRSxzQkFBc0IsRUFBRSxNQUFNLG1DQUFtQyxDQUFDO0FBQzNFLE9BQU8sRUFBRSxvQkFBb0IsRUFBRSxNQUFNLHFDQUFxQyxDQUFDO0FBQzNFLE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSw2QkFBNkIsQ0FBQztBQXNDNUQsSUFBYSxvQkFBb0IsNEJBQWpDLE1BQWEsb0JBQW9CO0lBQy9CLE1BQU0sQ0FBQyxPQUFPO1FBQ1osT0FBTztZQUNMLFFBQVEsRUFBRSxzQkFBb0I7WUFDOUIsU0FBUyxFQUFFLEVBQUU7U0FDZCxDQUFDO0lBQ0osQ0FBQztDQUNELENBQUE7QUFQVyxvQkFBb0I7SUFuQ2hDLFFBQVEsQ0FBQztRQUNSLFlBQVksRUFBRTtZQUNaLHVCQUF1QjtZQUN2Qix5QkFBeUI7WUFDekIsb0JBQW9CO1lBQ3BCLHFCQUFxQjtZQUNyQixvQkFBb0I7WUFDcEIsa0JBQWtCO1lBQ2xCLG9CQUFvQjtZQUNwQixvQkFBb0I7WUFDcEIsd0JBQXdCO1lBQ3hCLHNCQUFzQjtZQUN0QixvQkFBb0I7WUFDcEIsc0JBQXNCO1lBQ3RCLGFBQWE7U0FDZDtRQUNELE9BQU8sRUFBRTtZQUNQLFlBQVk7U0FDYjtRQUNELE9BQU8sRUFBRTtZQUNQLHVCQUF1QjtZQUN2Qix5QkFBeUI7WUFDekIsb0JBQW9CO1lBQ3BCLHFCQUFxQjtZQUNyQixvQkFBb0I7WUFDcEIsa0JBQWtCO1lBQ2xCLG9CQUFvQjtZQUNwQixvQkFBb0I7WUFDcEIsd0JBQXdCO1lBQ3hCLHNCQUFzQjtZQUN0QixvQkFBb0I7U0FDckI7UUFDRCxTQUFTLEVBQUUsRUFBRTtRQUNiLGVBQWUsRUFBRSxDQUFDLG9CQUFvQixDQUFDO0tBQ3hDLENBQUM7R0FDVyxvQkFBb0IsQ0FPL0I7U0FQVyxvQkFBb0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBOZ01vZHVsZSwgTW9kdWxlV2l0aFByb3ZpZGVycyB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQ29tbW9uTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcblxuaW1wb3J0IHsgRW1vamlCdXR0b25Db21wb25lbnQgfSBmcm9tICcuL2NvbXBvbmVudHMvZW1vamktYnV0dG9uLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBFbW9qaUNhdGVnb3JpZXNDb21wb25lbnQgfSBmcm9tICcuL2NvbXBvbmVudHMvZW1vamktY2F0ZWdvcmllcy5jb21wb25lbnQnO1xuaW1wb3J0IHsgRW1vamlDYXRlZ29yeUNvbXBvbmVudCB9IGZyb20gJy4vY29tcG9uZW50cy9lbW9qaS1jYXRlZ29yeS5jb21wb25lbnQnO1xuaW1wb3J0IHsgRW1vamlDb250ZW50Q29tcG9uZW50IH0gZnJvbSAnLi9jb21wb25lbnRzL2Vtb2ppLWNvbnRlbnQuY29tcG9uZW50JztcbmltcG9ydCB7IEVtb2ppRm9vdGVyQ29tcG9uZW50IH0gZnJvbSAnLi9jb21wb25lbnRzL2Vtb2ppLWZvb3Rlci5jb21wb25lbnQnO1xuaW1wb3J0IHsgRW1vamlIZWFkZXJDb21wb25lbnQgfSBmcm9tICcuL2NvbXBvbmVudHMvZW1vamktaGVhZGVyLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBFbW9qaUxpc3RDb21wb25lbnQgfSBmcm9tICcuL2NvbXBvbmVudHMvZW1vamktbGlzdC5jb21wb25lbnQnO1xuaW1wb3J0IHsgRW1vamlTZWFyY2hDb21wb25lbnQgfSBmcm9tICcuL2NvbXBvbmVudHMvZW1vamktc2VhcmNoLmNvbXBvbmVudCc7XG5cbmltcG9ydCB7IEVtb2ppUGlja2VyQXBpRGlyZWN0aXZlIH0gZnJvbSAnLi9kaXJlY3RpdmVzL2Vtb2ppLXBpY2tlci1hcGkuZGlyZWN0aXZlJztcbmltcG9ydCB7IEVtb2ppUGlja2VyQ2FyZXREaXJlY3RpdmUgfSBmcm9tICcuL2RpcmVjdGl2ZXMvZW1vamktcGlja2VyLWNhcmV0LmRpcmVjdGl2ZSc7XG5pbXBvcnQgeyBFbW9qaUVtcHR5Q2F0ZWdvcnlQaXBlIH0gZnJvbSAnLi9waXBlcy9lbW9qaS1lbXB0eS1jYXRlZ29yeS5waXBlJztcbmltcG9ydCB7IEVtb2ppUGlja2VyQ29tcG9uZW50IH0gZnJvbSAnLi9jb21wb25lbnRzL2Vtb2ppLXBpY2tlci5jb21wb25lbnQnO1xuaW1wb3J0IHsgRW1vamlGYWxsYmFjayB9IGZyb20gJy4vcGlwZXMvZW1vamktZmFsbGJhY2sucGlwZSc7XG5cblxuQE5nTW9kdWxlKHtcbiAgZGVjbGFyYXRpb25zOiBbXG4gICAgRW1vamlQaWNrZXJBcGlEaXJlY3RpdmUsXG4gICAgRW1vamlQaWNrZXJDYXJldERpcmVjdGl2ZSxcbiAgICBFbW9qaUJ1dHRvbkNvbXBvbmVudCxcbiAgICBFbW9qaUNvbnRlbnRDb21wb25lbnQsXG4gICAgRW1vamlQaWNrZXJDb21wb25lbnQsXG4gICAgRW1vamlMaXN0Q29tcG9uZW50LFxuICAgIEVtb2ppSGVhZGVyQ29tcG9uZW50LFxuICAgIEVtb2ppU2VhcmNoQ29tcG9uZW50LFxuICAgIEVtb2ppQ2F0ZWdvcmllc0NvbXBvbmVudCxcbiAgICBFbW9qaUNhdGVnb3J5Q29tcG9uZW50LFxuICAgIEVtb2ppRm9vdGVyQ29tcG9uZW50LFxuICAgIEVtb2ppRW1wdHlDYXRlZ29yeVBpcGUsXG4gICAgRW1vamlGYWxsYmFja1xuICBdLFxuICBpbXBvcnRzOiBbXG4gICAgQ29tbW9uTW9kdWxlXG4gIF0sXG4gIGV4cG9ydHM6IFtcbiAgICBFbW9qaVBpY2tlckFwaURpcmVjdGl2ZSxcbiAgICBFbW9qaVBpY2tlckNhcmV0RGlyZWN0aXZlLFxuICAgIEVtb2ppQnV0dG9uQ29tcG9uZW50LFxuICAgIEVtb2ppQ29udGVudENvbXBvbmVudCxcbiAgICBFbW9qaVBpY2tlckNvbXBvbmVudCxcbiAgICBFbW9qaUxpc3RDb21wb25lbnQsXG4gICAgRW1vamlIZWFkZXJDb21wb25lbnQsXG4gICAgRW1vamlTZWFyY2hDb21wb25lbnQsXG4gICAgRW1vamlDYXRlZ29yaWVzQ29tcG9uZW50LFxuICAgIEVtb2ppQ2F0ZWdvcnlDb21wb25lbnQsXG4gICAgRW1vamlGb290ZXJDb21wb25lbnRcbiAgXSxcbiAgcHJvdmlkZXJzOiBbXSxcbiAgZW50cnlDb21wb25lbnRzOiBbRW1vamlQaWNrZXJDb21wb25lbnRdXG59KVxuZXhwb3J0IGNsYXNzIE5neEVtb2ppUGlja2VyTW9kdWxlIHtcbiAgc3RhdGljIGZvclJvb3QoKTogTW9kdWxlV2l0aFByb3ZpZGVyczxOZ3hFbW9qaVBpY2tlck1vZHVsZT4ge1xuICAgIHJldHVybiB7XG4gICAgICBuZ01vZHVsZTogTmd4RW1vamlQaWNrZXJNb2R1bGUsXG4gICAgICBwcm92aWRlcnM6IFtdXG4gICAgfTtcbiAgfVxuIH1cbiJdfQ==