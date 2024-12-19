import { Component, ViewChild, ElementRef } from '@angular/core';
import { ChatDetailsComponent } from '../chat-details/chat-details.component';
import { ChannelMembersComponent } from "../channel-members/channel-members.component";
import { AddMembersComponent } from "../add-members/add-members.component";
import { CommonModule } from '@angular/common';
import { EmojiPickerComponent } from '../emoji-picker/emoji-picker.component';
import { NewMessageComponent } from "../new-message/new-message.component";
import { SharedModule } from '../../../shared/shared.module';

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
    SharedModule
  ],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss',
})
export class ChatComponent {
  @ViewChild('emojiTarget', { static: true }) emojiTarget!: ElementRef;
  selectedEmoji: string = '';

  openChatDetails() {
    document.getElementById('chatDetailsOverlay')?.classList.remove('d-none');
  }

  closeChatDetails() {
    document.getElementById('chatDetailsOverlay')?.classList.add('d-none');
  }

  openMembersInfo() {
    document.getElementById('channelMembersMenu')?.classList.remove('d-none');
  }

  closeMembersInfo() {
    document.getElementById('channelMembersMenu')?.classList.add('d-none');
  }

  openAddMembersMenu() {
    if (!document.getElementById('channelMembersMenu')?.classList.contains('d-none')) {
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
    document.getElementById('header')?.classList.add('d-none');
    document.getElementById('chat')!.innerHTML = ``;
    this.changeHeaders();
    document.getElementById('new-message-component')?.classList.remove('d-none');
  }

  changeHeaders() {
    document.getElementById('chat-container')?.classList.remove('height-normal-header');
    document.getElementById('chat-container')?.classList.add('height-new-message');
  }
}