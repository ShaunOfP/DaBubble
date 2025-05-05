import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
import { FilterService } from '../../../../services/component-services/filter.service';
import { Router } from '@angular/router';
import { UserDatasService } from '../../../../services/firebase-services/user-datas.service';
import { ChatService } from '../../../../services/firebase-services/chat.service';

@Component({
  selector: 'app-search-result-workspace',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './search-result-workspace.component.html',
  styleUrl: './search-result-workspace.component.scss'
})
export class SearchResultWorkspaceComponent {
  @Input() inputSearch!: string;
  @Output() closeClicked = new EventEmitter<void>();
  channelResults: any[] = [];
  memberResults: any[] = [];
  messageResults: any[] = [];

  constructor(
    private filterService: FilterService,
    private router: Router,
    private userDatasService: UserDatasService,
    private cdr: ChangeDetectorRef,
    private chatService: ChatService
  ) { }

  ngOnInit(): void {
    this.subscribeToCurrentChannels();
    this.subscribeToCurrentMembers();
    this.subscribeToCurrentMessages();
  }


  /**
   * Subscribes to the current Channels which fit the search criteria
   */
  subscribeToCurrentChannels() {
    this.filterService.channelMatch$.subscribe((channels) => {
      this.channelResults = channels;
      this.detectChangesManually();
    });
  }


  /**
   * Subscribes to the current Members which fit the search criteria
   */
  subscribeToCurrentMembers() {
    this.filterService.memberMatch$.subscribe((members) => {
      this.memberResults = members;
      this.detectChangesManually();
    });
  }


  /**
   * Subscribes to the current Message which fir the search criteria
   */
  subscribeToCurrentMessages() {
    this.filterService.messageMatch$.subscribe((message) => {
      this.messageResults = message;
      this.detectChangesManually();
    });
  }


  /**
   * Searches for the channel which contains the selected message and opens the correct channel
   * @param id Id of the selected message
   */
  async goToMessage(id: string) {
    if (id) this.modifyUrlWithChatString(id);
    this.filterService.updateFilter('');
    this.showResponsiveComponents();
  }


  /**
   * Sets variables to true to make them visible for responsive needs
   */
  showResponsiveComponents() {
    this.chatService.showChatWhenResponsive = true;
    this.chatService.showAltHeader = true;
  }


  /**
   * Tells Angular to check for changes/updated values
   */
  detectChangesManually() {
    this.cdr.detectChanges();
  }


  /**
   * Closes the Component when clicked
   */
  onCloseClick() {
    this.closeClicked.emit();
    this.filterService.resetSearchResults();
  }


  /**
   * Opens the Channel which is selected in the search results dropdown and closes the Component
   * @param channelId ID of the selected Channel
   */
  modifyUrlWithChatString(channelId: string) {
    this.router.navigate(['/general/public-chat'], {
      queryParams: { chatId: channelId },
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
    this.onCloseClick();
  }


  /**
   * Opens the direct Message to the User which was selected in the search results dropdown and closes the component
   * @param userId ID of the selected User
   */
  async openDirectMessage(userId: string) {
    const privateChatId = await this.userDatasService.getPrivateChannel(userId);
    this.router.navigate(['/general/private-chat'], {
      queryParams: { chatId: privateChatId },
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
    this.onCloseClick();
  }
}