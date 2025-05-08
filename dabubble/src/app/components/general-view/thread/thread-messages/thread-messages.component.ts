import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ChatService } from '../../../../services/firebase-services/chat.service';
import { EmojiPickerComponent } from "../../emoji-picker/emoji-picker.component";
import { Message } from '../../../../models/interfaces';
import { ReactionsComponent } from '../../chat/public-chat/reactions/reactions.component';
import { ActivatedRoute } from '@angular/router';
import { UserDatasService } from '../../../../services/firebase-services/user-datas.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-thread-messages',
  standalone: true,
  imports: [CommonModule, EmojiPickerComponent, ReactionsComponent, FormsModule],
  templateUrl: './thread-messages.component.html',
  styleUrl: './thread-messages.component.scss'
})
export class ThreadMessagesComponent {
  messages$!: Observable<any[]> | undefined;
  showReaction: boolean = true;
  showEmojiPicker: boolean = false;
  hoveredMessageId: string | null = null
  showPicker: boolean = false
  showEditMessage: boolean = false;
  editMessageId: string | null = null;
  messageValue: string = '';
  hideReactionMenu: boolean = false;
  isMobile = false;

  @ViewChild('emojiTarget', { static: true }) emojiTarget!: ElementRef;
  selectedEmoji: string = '';
  hoverIndex: number | null = null;

  constructor(
    private chatService: ChatService,
    private route: ActivatedRoute,
    private userDataService: UserDatasService,

  ) { }

  ngOnInit() {
    this.messages$ = this.chatService.currentThreads$.pipe(
      map((messages: Message[]) => this.returnNewObservable(messages, null))
    );
    this.isWidth400OrLess();
  }


  @HostListener('window:resize', [])
  isWidth400OrLess() {
    if (window.innerWidth <= 400) {
      this.isMobile = true;
    } else {
      this.isMobile = false;
    }
  }


  initializeMessageValue(content: string) {
    this.messageValue = content;
  }


  updateThreadMessage(threadId: string) {
    this.chatService.updateThreadMessage(this.messageValue, threadId);
    this.editMessageId = null;
    this.hideReactionMenu = false;
  }


  returnNewObservable(messages: Message[], lastDate: string | null) {
    return messages.map((message) => {
      const currentDate = new Date(message.createdAt).toLocaleDateString(
        'de-DE',
        {
          day: '2-digit',
          month: '2-digit',
          year: '2-digit',
        }
      );
      const showDate = currentDate !== lastDate;
      lastDate = currentDate;
      return {
        ...message,
        showDate,
        formattedDate: showDate ? currentDate : null,
      };
    });
  }

  openEmojiPicker() {
    this.showEmojiPicker ? this.hideEmojiPicker() : this.showEmojiPicker = true;
  }

  hideEmojiPicker() {
    this.showEmojiPicker = false;
  }

  toggleReactionSender(index: number | null) {
    if (!this.showEmojiPicker) {
      this.hoverIndex = index;
    }
  }

  checkStyle(userId: string): string {
    let currentUser: string = '';
    this.route.queryParams.subscribe((params) => {
      currentUser = params['userID'];
    });
    return userId === currentUser ? 'secondary' : 'primary';
  }

  sendReaction(emoji: string, id: string) {
    this.chatService.updateMessage(emoji, id, this.userDataService.currentUserId, true)
  }
}