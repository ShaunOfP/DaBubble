import { Component, ViewChild, ElementRef, OnInit, AfterViewInit, NgZone, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmojiPickerComponent } from '../emoji-picker/emoji-picker.component';
import { NewMessageComponent } from './new-message/new-message.component';
import { SharedModule } from '../../../shared/shared.module';
import { ChatService } from '../../../services/firebase-services/chat.service';
import { Message } from '../../../models/interfaces';
import { UserDatasService } from '../../../services/firebase-services/user-datas.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AltHeaderMobileComponent } from "../alt-header-mobile/alt-header-mobile.component";
import { Subscription } from 'rxjs';
import { FilterService } from '../../../services/component-services/filter.service';
import { Channel } from '../../../services/firebase-services/channel.service';
import { Member } from '../../../services/firebase-services/channel-member.service';


@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [
    CommonModule,
    EmojiPickerComponent,
    NewMessageComponent,
    SharedModule,
    RouterModule,
    AltHeaderMobileComponent
  ],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss',
})
export class ChatComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('emojiTarget', { static: true }) emojiTarget!: ElementRef;
  @ViewChild('messageInput', { static: false }) messageInput!: ElementRef<HTMLTextAreaElement>;
  selectedEmoji: string = '';
  chatDetails: boolean = false;
  showNewMessageHeader: boolean = false;
  showMembersInfo: boolean = false;
  showAddMembers: boolean = false;
  showGreyScreen: boolean = false;
  userIds!: string[];
  currentChannelName: string = ``;
  currentUserId: string = '';
  privateChatOtherUserData: any;
  currentChatId: string = '';
  private zoneSub!: Subscription;
  showMemberSearchResults: boolean = false;
  channelResults: any[] = [];
  memberResults: any[] = [];
  counter: number = 1;
  idOfChannelOrMember: string = ``;
  showPlaceholder: boolean = true;
  currentlyTaggedUserOrChannelId: {
    id: string,
    type: string,
    name: string,
    messageString: string
  } = { id: '', type: '', name: '', messageString: '' };

  constructor(
    public chatService: ChatService,
    private userDatasService: UserDatasService,
    private route: ActivatedRoute,
    private ngZone: NgZone,
    private filterService: FilterService,
    private router: Router
  ) { }


  ngOnInit() {
    this.goToMainChannel();
    this.fetchChannelDataForCurrentUser();
    this.subscribeToCurrentChannels();
    this.subscribeToCurrentMembers();
  }


  goToMainChannel() {
    this.router.navigate(['/general/public-chat'], {
      queryParams: { chatId: 'ER84UOYc0F2jptDjWxFo' },
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
  }


  ngAfterViewInit() {
    this.zoneSub = this.ngZone.onStable.subscribe(() => {
      setTimeout(() => {
        if (this.messageInput && !this.chatService.isAlreadyFocusedOncePerLoad) {
          this.messageInput.nativeElement.focus();
          this.chatService.isAlreadyFocusedOncePerLoad = true;
        }
      }, 50);
    });
  }


  ngOnDestroy() {
    this.zoneSub?.unsubscribe();
  }


  openChatSearch() {
    this.resetValuesForCustomMessageSending();
    switch (this.counter) {
      case 1:
        this.messageInput.nativeElement.value = "@";
        this.counter++;
        this.evaluateChatInput();
        break;
      case 2:
        this.messageInput.nativeElement.value = "#";
        this.counter++;
        this.evaluateChatInput();
        break;
      case 3:
        this.messageInput.nativeElement.value = "";
        this.counter = 1;
        this.evaluateChatInput();
        break;
    }
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
  * Subscribes to the current URL to get the newest Chat-ID and the User-Id from the logged in User
  */
  fetchChannelDataForCurrentUser() {
    this.route.queryParams.subscribe((params) => {
      if (params['chatId']) {
        this.currentChatId = params['chatId'];
        this.getChannelNameViaId(this.currentChatId);
      } else {
        console.error('No chatId found in query parameters');
      }
      if (params['userID']) {
        this.currentUserId = params['userID'];
      } else {
        console.error('No userID found in query parameters');
      }
    });
  }


  selectDataToSendMessageToPublicChat(channelData: Channel) {
    this.messageInput.nativeElement.value = `#${channelData.channelName} `;
    this.messageInput.nativeElement.focus();
    this.currentlyTaggedUserOrChannelId = { id: channelData.channelId, type: 'public', name: channelData.channelName, messageString: `#${channelData.channelName}` };
    this.showPlaceholder = false;
    this.filterService.updateFilter('');
    this.idOfChannelOrMember = channelData.channelId;
  }


  selectDataToSendMessageToMember(memberData: Member) {
    this.messageInput.nativeElement.value = `@${memberData.username} `;
    this.messageInput.nativeElement.focus();
    this.currentlyTaggedUserOrChannelId = { id: memberData.id, type: 'private', name: memberData.username, messageString: `@${memberData.username}` };
    this.showPlaceholder = false;
    this.filterService.updateFilter('');
    this.idOfChannelOrMember = memberData.privateChats;
  }


  /**
   * Takes the chatId-string and returns either the current Name of the Chat or the whole Data for the other User from
   * a private Chat. If the Guest is logged in the Name is hardcoded because it can't be changed.
   * @param chatId a string containing the ID of the currently opened Chat
   */
  async getChannelNameViaId(chatId: string) {
    if (this.chatService.getCurrentRoute() === 'public') {
      this.currentChannelName = await this.chatService.getChannelDocSnapshot(chatId);
    } else if (this.chatService.getCurrentRoute() === 'new-message') {
    } else {
      let otherUserInPrivateChatId = await this.chatService.getOtherUserNameFromPrivateChat(chatId, this.currentUserId);
      if (otherUserInPrivateChatId === undefined) {
        this.currentChannelName = await this.userDatasService.getUserName(this.currentUserId);
        this.privateChatOtherUserData = await this.userDatasService.getSingleUserData(this.currentUserId);
      } else {
        this.privateChatOtherUserData = await this.userDatasService.getSingleUserData(otherUserInPrivateChatId);
        this.currentChannelName = this.privateChatOtherUserData['username'];
      }
    }
  }


  /**
   * Assigns data to the variable, which is needed to load the UserInfoCard correctly
   * @param userId string containing the User Id
   */
  async getUserDataFromSingleMemberOfPublicChat(userId: string) {
    this.privateChatOtherUserData = await this.userDatasService.getSingleUserData(userId);
  }


  /**
   * Handles the Emoji selection and hides the Emoji picker
   * @param emoji the Emoji as a string
   */
  onEmojiReceived(emoji: string) {
    this.selectedEmoji = emoji;
    this.emojiTarget.nativeElement.value += emoji;
    this.hideEmojiPicker();
  }


  /**
   * Shows the Emoji picker
   */
  showEmojiPicker() {
    const emojiPickerElement = document.getElementById('emojiChat');
    if (emojiPickerElement) {
      emojiPickerElement.classList.remove('d-none');
    }
  }


  /**
   * Hides the Emoji picker
   */
  hideEmojiPicker() {
    const emojiPickerElement = document.getElementById('emojiChat');
    if (emojiPickerElement) {
      emojiPickerElement.classList.add('d-none');
    }
  }


  /**
   * Changes components to add a new message
   */
  openNewMessageWindow() {
    this.showNewMessageHeader = true;
    this.changeHeaders();
  }


  /**
   * Changes styling of the header to allow design for different use cases
   */
  changeHeaders() {
    document
      .getElementById('chat-container')
      ?.classList.remove('height-normal-header');
    document
      .getElementById('chat-container')
      ?.classList.add('height-new-message');
  }


  evaluateChatInput() {
    let messageValue = this.messageInput.nativeElement.value;
    if (this.idOfChannelOrMember !== ``) return;
    if (messageValue.charAt(0) === '@') {
      this.filterService.resetSearchResults();
      this.filterService.updateFilter(messageValue);
    } else if (messageValue.charAt(0) === '#') {
      this.filterService.resetSearchResults();
      this.filterService.updateFilter(messageValue);
    } else {
      this.resetValuesForCustomMessageSending();
      this.filterService.resetSearchResults();
      this.filterService.updateFilter('');
    }
  }


  /**
   * Sends the Message to the Chat/Channel
   * @param content Value from the input field
   * @returns void
   */
  async sendMessage(content: string): Promise<void> {
    if (!this.userDatasService.currentUserId || !content) {
      this.userDatasService.getCurrentUserId();
      if (!this.userDatasService.currentUserId) {
        console.error('User ID is not available');
        return;
      }
      if (!content) {
        console.error('Bitte geben sie eine Nachricht für den Chat ein');
        return;
      }
    }

    const userId = this.userDatasService.currentUserId
    const userName = await this.userDatasService.getUserName(userId)
    if (!userName) {
      console.error('User data is not available');
      return;
    }

    const message: Message = {
      uniqueId: this.generateId(),
      createdAt: new Date().getTime(),
      content: content,
      userId: this.userDatasService.currentUserId,
      reaction: {},
      threadAnswers: 0,
      taggedUsers: this.currentlyTaggedUserOrChannelId
    };

    if (this.chatService.currentChatId == ``) {
      console.error("No chat Id provided");
      return;
    }

    this.chatService
      .saveMessage(message)
      .then(() => {
        this.messageInput.nativeElement.value = '';
      })
      .catch((error) => {
        console.error('Error saving message:', error);
      });
  }


  resetValuesForCustomMessageSending() {
    this.idOfChannelOrMember = ``;
    this.showPlaceholder = true;
    this.counter = 1;
  }


  /**
   * Generates a unique id
   * @returns a unique id
   */
  private generateId(): string {
    return 'unique-id-' + Math.random().toString(36).substring(2, 9);
  }
}
