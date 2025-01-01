import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { ChatDetailsComponent } from '../chat-details/chat-details.component';
import { ChannelMembersComponent } from '../channel-members/channel-members.component';
import { AddMembersComponent } from '../add-members/add-members.component';
import { CommonModule } from '@angular/common';
import { EmojiPickerComponent } from '../emoji-picker/emoji-picker.component';
import { NewMessageComponent } from '../new-message/new-message.component';
import { SharedModule } from '../../../shared/shared.module';
import { ChatAllComponent } from './chat-all/chat-all.component';
import { ChatService } from '../../../services/firebase-services/chat.service';
import { Message } from '../../../models/interfaces';
import { UserDatasService } from '../../../services/firebase-services/user-datas.service';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [
    ChatDetailsComponent,
    ChannelMembersComponent,
    AddMembersComponent,
    CommonModule,
    EmojiPickerComponent,
    NewMessageComponent,
    SharedModule,
    ChatAllComponent,
    RouterModule,
  ],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss',
})
export class ChatComponent implements OnInit {
  private userID: string | null = null;

  constructor(
    private chatService: ChatService,
    private userDatasService: UserDatasService,
    private route: ActivatedRoute
  ) {}
  @ViewChild('emojiTarget', { static: true }) emojiTarget!: ElementRef;
  selectedEmoji: string = '';
  chatDetails: boolean = false;
  showNewMessageHeader: boolean = false;

  // openChatDetails() {
  //   document.getElementById('chatDetailsOverlay')?.classList.remove('d-none');
  // }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      const userID = params['userID'];
      if (userID) {
        this.userID = userID;
      } else {
        console.error('No user ID provided');
      }
    });
  }

  toggleChatDetails() {
    this.chatDetails = !this.chatDetails;
  }

  openMembersInfo() {
    document.getElementById('channelMembersMenu')?.classList.remove('d-none');
  }

  closeMembersInfo() {
    document.getElementById('channelMembersMenu')?.classList.add('d-none');
  }

  openAddMembersMenu() {
    if (
      !document
        .getElementById('channelMembersMenu')
        ?.classList.contains('d-none')
    ) {
      this.closeMembersInfo();
    }
    document.getElementById('addMembersMenu')?.classList.remove('d-none');
  }

  closeAddMembersMenu() {
    document.getElementById('addMembersMenu')?.classList.add('d-none');
  }

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

  async sendMessage(channelId: string, content: string): Promise<void> {
    if (!this.userID) {
      console.error('User ID is not available');
      return;
    }

    const userData = await this.userDatasService.getUserDataById(this.userID);
    if (!userData) {
      console.error('User data is not available');
      return;
    }

    const message: Message = {
      id: this.generateId(), // Generate a unique ID for the message
      sender: userData.username, // Replace with actual sender name
      createdAt: new Date().getTime(),
      content: content,
      userId: this.userID, // Use the actual user ID
    };

    this.chatService
      .saveMessage(channelId, message)
      .then(() => {
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
