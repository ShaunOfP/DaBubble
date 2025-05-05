import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FilterService } from '../../../../services/component-services/filter.service';
import { Router } from '@angular/router';
import { UserDatasService } from '../../../../services/firebase-services/user-datas.service';
import { ChannelService } from '../../../../services/firebase-services/channel.service';

@Component({
  selector: 'app-search-results',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './search-results.component.html',
  styleUrl: './search-results.component.scss',
})
export class SearchResultsComponent implements OnInit {
  @Input() inputSearch!: string;
  @Output() closeClicked = new EventEmitter<void>();
  channelResults: any[] = [];
  memberResults: any[] = [];
  messageResults: any[] = [];

  constructor(
    private filterService: FilterService,
    private router: Router,
    private userDatasService: UserDatasService,
    private channelService: ChannelService
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
    });
  }


  /**
   * Subscribes to the current Members which fit the search criteria
   */
  subscribeToCurrentMembers() {
    this.filterService.memberMatch$.subscribe((members) => {
      this.memberResults = members;
    });
  }


  /**
   * Subscribes to the current Message which fir the search criteria
   */
  subscribeToCurrentMessages() {
    this.filterService.messageMatch$.subscribe((message) => {
      this.messageResults = message;
    });
  }


  /**
   * Searches for the channel which contains the selected message and opens the correct channel
   * @param id Id of the selected message
   */
  async goToMessage(id: string) {
    let channelId = await this.channelService.findChannelIdViaMessageId(id);
    if (channelId) this.modifyUrlWithChatString(channelId);
    this.filterService.resetSearchResults();
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
