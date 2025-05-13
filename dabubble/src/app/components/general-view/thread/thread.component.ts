import { Component, EventEmitter, Output, ViewChild, ElementRef, OnInit, OnDestroy, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { EmojiPickerComponent } from '../emoji-picker/emoji-picker.component';
import { SharedModule } from '../../../shared/shared.module';
import { ThreadMessagesComponent } from "./thread-messages/thread-messages.component";
import { MatDrawer, MatSidenavModule } from '@angular/material/sidenav';
import { AltHeaderMobileComponent } from "../alt-header-mobile/alt-header-mobile.component";
import { ChatService } from '../../../services/firebase-services/chat.service';
import { UserDatasService } from '../../../services/firebase-services/user-datas.service';
import { Message } from '../../../models/interfaces';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-thread',
  standalone: true,
  imports: [EmojiPickerComponent, SharedModule, ThreadMessagesComponent, MatSidenavModule, AltHeaderMobileComponent],
  templateUrl: './thread.component.html',
  styleUrl: './thread.component.scss'
})
export class ThreadComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('emojiTarget', { static: true }) emojiTarget!: ElementRef;
  selectedEmoji: string = '';
  @ViewChild('threadDrawer') drawer!: MatDrawer;
  private subscription!: Subscription;

  constructor(public chatService: ChatService,
    private userDatasService: UserDatasService,
    private cdr: ChangeDetectorRef
  ) {

  }

  ngOnInit() {
    this.subscription = this.chatService.toggleDrawer$.subscribe(() => {
      this.drawer.toggle();
    });
  }


  ngAfterViewInit() {
    this.chatService.threadClosed = true;
    this.drawer.close();
    this.cdr.detectChanges();
  }


  ngOnDestroy() {
    this.subscription.unsubscribe();
  }


  toggleDrawer() {
    this.drawer.toggle();
    this.chatService.threadClosed = true;
    this.chatService.showThreadWhenResponsive = false;
    this.chatService.messageID = '';
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
    const message: Message = {
      uniqueId: this.generateId(),
      createdAt: new Date().getTime(),
      content: content,
      userId: this.userDatasService.currentUserId,
      reaction: {},
      threadAnswers: 0
    };
    const messageId = this.chatService.currentMessageId;
    this.chatService.generateThread(messageId, message);
    this.emojiTarget.nativeElement.value = ``;
    this.chatService.updateThreadAnswersInCurrentMessage(messageId);
  }

  private generateId(): string {
    return 'unique-id-' + Math.random().toString(36).substring(2, 9);
  }
}
