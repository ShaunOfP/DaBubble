import {
  Component,
  AfterViewInit,
  ViewChild,
  ElementRef,
  ChangeDetectorRef,
} from '@angular/core';
import { ChatDetailsComponent } from '../chat-details/chat-details.component';
import { ChannelMembersComponent } from "../channel-members/channel-members.component";
import { AddMembersComponent } from "../add-members/add-members.component";
import { CommonModule } from '@angular/common';
import { EmojiPickerComponent } from '../emoji-picker/emoji-picker.component';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [
    ChatDetailsComponent, 
    ChannelMembersComponent, 
    AddMembersComponent, 
    CommonModule, 
    EmojiPickerComponent
  ],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss',
})
export class ChatComponent implements AfterViewInit {
  @ViewChild(EmojiPickerComponent) emojiPicker!: EmojiPickerComponent;
  @ViewChild('emojiTarget', { static: true }) emojiTarget!: ElementRef;

  constructor(private cdRef: ChangeDetectorRef) {} 

  openChatDetails() {
    document.getElementById('chatDetailsOverlay')?.classList.remove('d-none');
  }

  closeChatDetails() {
    document.getElementById('chatDetailsOverlay')?.classList.add('d-none');
  }

  openMembersInfo() {
    document.getElementById('channelMembersMenu')?.classList.remove('d-none');
  }

  closeMembersInfo(){
    document.getElementById('channelMembersMenu')?.classList.add('d-none');
  }

  openAddMembersMenu() {
    if (!document.getElementById('channelMembersMenu')?.classList.contains('d-none')){
      this.closeMembersInfo();
    }
    document.getElementById('addMembersMenu')?.classList.remove('d-none');
  }

  closeAddMembersMenu(){
    document.getElementById('addMembersMenu')?.classList.add('d-none');
  }

  ngAfterViewInit() {
    this.emojiPicker.emojiSelected.subscribe((emoji: string) => {
      this.insertEmoji(emoji);
    });
  }

  insertEmoji(emoji: string) {
    this.emojiTarget.nativeElement.value += emoji;
    this.toggleEmojiPicker();
  }

  toggleEmojiPicker() {
    const emojiPickerElement = document.querySelector('app-emoji-picker');
    if (emojiPickerElement) {
      emojiPickerElement.classList.toggle('d-none');
    }
  }
}