import { Component, EventEmitter, Output, ViewChild, ElementRef, OnInit } from '@angular/core';
import { EmojiPickerComponent } from '../emoji-picker/emoji-picker.component';
import { SharedModule } from '../../../shared/shared.module';
import { ThreadMessagesComponent } from "./thread-messages/thread-messages.component";
import { MatSidenavModule } from '@angular/material/sidenav';
import { AltHeaderMobileComponent } from "../alt-header-mobile/alt-header-mobile.component";
import { ChatService } from '../../../services/firebase-services/chat.service';
import { UserDatasService } from '../../../services/firebase-services/user-datas.service';
import { Message } from '../../../models/interfaces';

@Component({
  selector: 'app-thread',
  standalone: true,
  imports: [EmojiPickerComponent, SharedModule, ThreadMessagesComponent, MatSidenavModule, AltHeaderMobileComponent],
  templateUrl: './thread.component.html',
  styleUrl: './thread.component.scss'
})
export class ThreadComponent implements OnInit {
  @Output() callParent: EventEmitter<void> = new EventEmitter();
  @ViewChild('emojiTarget', { static: true }) emojiTarget!: ElementRef;
  selectedEmoji: string = '';
  toggleMarginLeft: boolean = true;

  constructor(public chatService: ChatService,
    private userDatasService: UserDatasService) {

  }

  ngOnInit(): void {

  }

  toggleMargin() {
    this.toggleMarginLeft ? this.toggleMarginLeft = false : this.toggleMarginLeft = true;
    this.chatService.chatMarginRight = true;
    this.callParent.emit();
  }

  onEmojiReceived(emoji: string) {
    this.selectedEmoji = emoji;
    this.emojiTarget.nativeElement.value += emoji;
    this.toggleEmojiPicker();
  }

  toggleEmojiPicker() {
    const emojiPickerElement = document.getElementById('emojiThreads');
    if (emojiPickerElement) {
      emojiPickerElement.classList.toggle('d-none');
    }
  }

  hideEmojiPicker() {
    const emojiPickerElement = document.getElementById('emojiThreads');
    if (emojiPickerElement) {
      emojiPickerElement.classList.add('d-none');
    }
  }

  async sendMessage(content: string) {
    if (!content) return
    const userId = this.userDatasService.currentUserId;
    const userName = await this.userDatasService.getUserName(userId);
    const avatarUrl = await this.userDatasService.getUserAvatar(this.userDatasService.currentUserId);
    const message: Message = {
      id: this.generateId(),
      sender: userName,
      createdAt: new Date().getTime(),
      content: content,
      userId: this.userDatasService.currentUserId,
      reaction: {},
      avatar: avatarUrl
    };
    const messageId = this.chatService.currentMessageId;
    this.chatService.generateThread(messageId, message);
    this.emojiTarget.nativeElement.value = ``;
  }

  private generateId(): string {
    return 'unique-id-' + Math.random().toString(36).substring(2, 9);
  }
}
