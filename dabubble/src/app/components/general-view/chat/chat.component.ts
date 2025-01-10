import { Component, ViewChild, ElementRef, OnInit, viewChild } from '@angular/core';
import { ChatDetailsComponent } from './chat-details/chat-details.component';
import { ChannelMembersComponent } from './channel-members/channel-members.component';
import { CommonModule } from '@angular/common';
import { EmojiPickerComponent } from '../emoji-picker/emoji-picker.component';
import { NewMessageComponent } from './new-message/new-message.component';
import { SharedModule } from '../../../shared/shared.module';
import { ChatService } from '../../../services/firebase-services/chat.service';
import { Message } from '../../../models/interfaces';
import { UserDatasService, UserObserver } from '../../../services/firebase-services/user-datas.service';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { PrivateChatComponent } from "./private-chat/private-chat.component";
import { PublicChatComponent } from './public-chat/public-chat.component';
import { AddMembersComponent } from './add-members/add-members.component';
import { map } from 'rxjs';
import { user } from '@angular/fire/auth';


@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [
    ChatDetailsComponent,
    ChannelMembersComponent,
    CommonModule,
    EmojiPickerComponent,
    NewMessageComponent,
    SharedModule,
    RouterModule,
    PrivateChatComponent,
    PublicChatComponent,
    AddMembersComponent
],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss',
})
export class ChatComponent implements OnInit {
  userID!: string;

  constructor(
    private chatService: ChatService,
    private userDatasService: UserDatasService,
    private route: ActivatedRoute
  ) {}


  @ViewChild(PublicChatComponent) publicChatComponent!: PublicChatComponent;
  @ViewChild('emojiTarget', { static: true }) emojiTarget!: ElementRef;
  @ViewChild('messageInput', { static: false }) messageInput!: ElementRef;
  selectedEmoji: string = '';
  chatDetails: boolean = false;
  showNewMessageHeader: boolean = false;
  showMembersInfo: boolean = false;
  showAddMembers: boolean = false;
  showGreyScreen: boolean = false;
  userIds!: string[]


  // openChatDetails() {
  //   document.getElementById('chatDetailsOverlay')?.classList.remove('d-none');
  // }

  ngOnInit(): void {

    //kann in userService definiert und für alle Komponenten welche die Id brauchen nutzbar machen
    this.route.queryParams.subscribe((params) => {
      const userID = params['userID'];
      if (userID) {
        this.userID = userID;
        console.log(this.userID);
        
      } else {
        console.error('No user ID provided');
      }
    });
    this.userDatasService.userIds$.pipe(
      map((ids) => console.log(ids))
    )
    .subscribe();    
  }


  activateGreyScreen() {
    this.showGreyScreen = true;
  }


  hideGreyScreen() {
    this.showGreyScreen = false;
  }


  toggleChatDetails() {
    this.showGreyScreen ? this.hideGreyScreen() : this.activateGreyScreen();
    this.chatDetails = !this.chatDetails;
  }


  openMembersInfo() {
    this.activateGreyScreen();
    this.showMembersInfo = true;
  }


  closeMembersInfo() {
    this.showMembersInfo = false;
    this.hideGreyScreen();
  }


  openAddMembersMenu() {
    if (this.showMembersInfo) {
      this.closeMembersInfo();
    }
    this.activateGreyScreen();
    this.showAddMembers = true;
  }


  closeAddMembersMenu() {
    this.showAddMembers = false;
    this.hideGreyScreen();
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
    if (!this.userID || !content) {
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
        this.publicChatComponent.scrollToElement('auto');
        this.messageInput.nativeElement.value = ''
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
