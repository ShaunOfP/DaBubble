import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmojiPickerComponent } from '../emoji-picker/emoji-picker.component';
import { NewMessageComponent } from './new-message/new-message.component';
import { SharedModule } from '../../../shared/shared.module';
import { ChatService } from '../../../services/firebase-services/chat.service';
import { Message } from '../../../models/interfaces';
import { UserDatasService } from '../../../services/firebase-services/user-datas.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AltHeaderMobileComponent } from "../alt-header-mobile/alt-header-mobile.component";


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
export class ChatComponent implements OnInit {
  constructor(
    public chatService: ChatService,
    private userDatasService: UserDatasService,
    private route: ActivatedRoute,
    private router: Router
  ) { }


  @ViewChild('emojiTarget', { static: true }) emojiTarget!: ElementRef;
  @ViewChild('messageInput', { static: false }) messageInput!: ElementRef;
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

  /**
   * Subscribes to the current URL to get the newest Chat-ID and the User-Id from the logged in User
   */
  async ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      if (params['chatId']) {
        this.currentChatId = params['chatId'];
        this.getChannelNameViaId(this.currentChatId);
      } else {
        console.error('No chatId found in query parameters');
      }
      if (params['userID']) {
        if (params['userID'] === 'guest') {
          this.currentUserId = 'guest';
          this.router.navigate(['/general/public-chat'], {
            queryParams: { chatId: 'ER84UOYc0F2jptDjWxFo' },
            queryParamsHandling: 'merge',
            replaceUrl: true,
          });
        } else {
          this.currentUserId = params['userID'];
        }
      } else {
        console.error('No userID found in query parameters');
      }
    });
  }


  /**
   * Takes the chatId-string and returns either the current Name of the Chat or the whole Data for the other User from
   * a private Chat. If the Guest is logged in the Name is hardcoded because it can't be changed.
   * @param chatId a string containing the ID of the currently opened Chat
   */
  async getChannelNameViaId(chatId: string) {
    if (this.userDatasService.checkIfGuestIsLoggedIn()) {
      this.currentChannelName = `Entwicklerchannel`;
    } else {
      if (this.chatService.getCurrentRoute() === 'public') {
        this.currentChannelName = await this.chatService.getChannelDocSnapshot(chatId);
      } else {
        let otherUserInPrivateChatId = await this.chatService.getOtherUserNameFromPrivateChat(chatId, this.currentUserId);
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


  /**
   * 
   * @param content 
   * @returns 
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

    const avatarUrl = await this.userDatasService.getUserAvatar(this.userDatasService.currentUserId);

    const message: Message = {
      id: this.generateId(), // Generate a unique ID for the message
      sender: userName, // Replace with actual sender name
      createdAt: new Date().getTime(),
      content: content,
      userId: this.userDatasService.currentUserId, // Use the actual user ID
      reaction: {},
      avatar: avatarUrl
    };

    if (this.chatService.currentChatId == ``) {
      console.log("No chat Id provided");
      return;
    }

    this.chatService
      .saveMessage(message)
      .then(() => {
        // this.publicChatComponent.scrollToElement('auto');
        this.messageInput.nativeElement.value = '';
        console.log('Message saved successfully');

      })
      .catch((error) => {
        console.error('Error saving message:', error);
      });
  }


  /**
   * Generates a unique id
   * @returns a unique id
   */
  private generateId(): string {
    return 'unique-id-' + Math.random().toString(36).substring(2, 9);
  }
}
