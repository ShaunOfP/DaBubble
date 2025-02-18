import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { EmojiPickerComponent } from '../emoji-picker/emoji-picker.component';
import { NewMessageComponent } from './new-message/new-message.component';
import { SharedModule } from '../../../shared/shared.module';
import { ChatService } from '../../../services/firebase-services/chat.service';
import { Message } from '../../../models/interfaces';
import { UserDatasService } from '../../../services/firebase-services/user-datas.service';
import { RouterModule } from '@angular/router';
import { PrivateChatComponent } from "./private-chat/private-chat.component";
import { map, Observable } from 'rxjs';
import { PublicChatComponent } from './public-chat/public-chat.component';
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
    private chatService: ChatService,
    private userDatasService: UserDatasService,
    private location: Location
  ) { }


  @ViewChild(PublicChatComponent) publicChatComponent!: PublicChatComponent;
  @ViewChild('emojiTarget', { static: true }) emojiTarget!: ElementRef;
  @ViewChild('messageInput', { static: false }) messageInput!: ElementRef;
  selectedEmoji: string = '';
  chatDetails: boolean = false;
  showNewMessageHeader: boolean = false;
  showMembersInfo: boolean = false;
  showAddMembers: boolean = false;
  showGreyScreen: boolean = false;
  userIds!: string[];
  currentChannelName: string = ``; //holen vom service via url

  ngOnInit() { }


  onEmojiReceived(emoji: string) {
    this.selectedEmoji = emoji;
    this.emojiTarget.nativeElement.value += emoji;
    this.hideEmojiPicker();
  }


  toggleEmojiPicker() {
    const emojiPickerElement = document.getElementById('emojiChat');
    if (emojiPickerElement) {
      emojiPickerElement.classList.toggle('d-none');
    }
  }


  hideEmojiPicker() {
    const emojiPickerElement = document.getElementById('emojiChat');
    if (emojiPickerElement) {
      emojiPickerElement.classList.add('d-none');
    }
  }


  openNewMessageWindow() {
    this.showNewMessageHeader = true;
    this.changeHeaders();
  }


  changeHeaders() {
    document
      .getElementById('chat-container')
      ?.classList.remove('height-normal-header');
    document
      .getElementById('chat-container')
      ?.classList.add('height-new-message');
  }


  async sendMessage(content: string): Promise<void> {
    debugger
    if (!this.userDatasService.currentUserId || !content) {
      this.userDatasService.getCurrentChannelId();

      if (!this.userDatasService.currentUserId) {
        console.error('User ID is not available');
        return;
      }
      if (!content){
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
      id: this.generateId(), // Generate a unique ID for the message
      sender: userName, // Replace with actual sender name
      createdAt: new Date().getTime(),
      content: content,
      userId: this.userDatasService.currentUserId, // Use the actual user ID
      reaction: {}
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


  private generateId(): string {
    // Generate a unique ID for the message (e.g., using a UUID library or custom logic)
    return 'unique-id-' + Math.random().toString(36).substr(2, 9);
  }
}
