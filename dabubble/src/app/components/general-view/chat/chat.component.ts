import { Component, ViewChild, ElementRef } from '@angular/core';
import { ChatDetailsComponent } from '../chat-details/chat-details.component';
import { ChannelMembersComponent } from "../channel-members/channel-members.component";
import { AddMembersComponent } from "../add-members/add-members.component";
import { CommonModule } from '@angular/common';
import { EmojiPickerComponent } from '../emoji-picker/emoji-picker.component';
import { NewMessageComponent } from "../new-message/new-message.component";

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [
    ChatDetailsComponent,
    ChannelMembersComponent,
    AddMembersComponent,
    CommonModule,
    EmojiPickerComponent,
    NewMessageComponent
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
    this.toggleEmojiPicker();
  }

  toggleEmojiPicker() {
    const emojiPickerElement = document.getElementById('emojiChat');
    if (emojiPickerElement) {
      emojiPickerElement.classList.toggle('d-none');
    }
  }

  openNewMessageWindow(){
    document.getElementById('header')?.classList.add('d-none');
    document.getElementById('chat')?.classList.add('d-none');
    document.getElementById('new-message-component')?.classList.remove('d-none');
  }
}