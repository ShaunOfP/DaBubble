import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { ChatService } from '../../../../services/firebase-services/chat.service';
import { EmojiPickerComponent } from "../../emoji-picker/emoji-picker.component";

@Component({
  selector: 'app-thread-messages',
  standalone: true,
  imports: [CommonModule, EmojiPickerComponent],
  templateUrl: './thread-messages.component.html',
  styleUrl: './thread-messages.component.scss'
})
export class ThreadMessagesComponent {
  messages$!: Observable<any[]>;
  showReaction: boolean = true;
  showEmojiPicker: boolean = false;
  @ViewChild('emojiTarget', { static: true }) emojiTarget!: ElementRef;
  selectedEmoji: string = '';
  reactions: any[] = [{ //type zu object wenn sender berücksichtigt wird
    'emoji': '😁',
    'sender': 'Jake'
  }];
  hoverIndex: number | null = null;

  constructor(private chatService: ChatService) { }

  ngOnInit() {
    this.messages$ = this.chatService.getThreadCollection('dOCTHJxiNDhYvmqMokLv', 'buM6uSAhw8snf948FEIh');
  }

  //wenn reaktionen vorhanden dann showReactions auf true

  openEmojiPicker() {
    this.showEmojiPicker ? this.hideEmojiPicker() : this.showEmojiPicker = true;
  }

  onEmojiReceived(emoji: string) {
    this.selectedEmoji = emoji;
    this.reactions.push({
      'emoji': emoji,
      'sender': 'Peter'
    });
    console.log(this.reactions);
    this.hideEmojiPicker();
  }

  hideEmojiPicker() {
    this.showEmojiPicker = false;
  }

  toggleReactionSender(index: number | null) {
    if (!this.showEmojiPicker) {
      this.hoverIndex = index;
    }
  }
}
