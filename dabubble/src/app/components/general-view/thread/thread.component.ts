import { Component, EventEmitter, Output, ViewChild, ElementRef } from '@angular/core';
import { EmojiPickerComponent } from '../emoji-picker/emoji-picker.component';
import { SharedModule } from '../../../shared/shared.module';
import { ThreadMessagesComponent } from "./thread-messages/thread-messages.component";
import { MatSidenavModule } from '@angular/material/sidenav';
import { AltHeaderMobileComponent } from "../alt-header-mobile/alt-header-mobile.component";
import { ChatService } from '../../../services/firebase-services/chat.service';

@Component({
  selector: 'app-thread',
  standalone: true,
  imports: [EmojiPickerComponent, SharedModule, ThreadMessagesComponent, MatSidenavModule, AltHeaderMobileComponent],
  templateUrl: './thread.component.html',
  styleUrl: './thread.component.scss'
})
export class ThreadComponent {
  @Output() callParent: EventEmitter<void> = new EventEmitter();
  @ViewChild('emojiTarget', { static: true }) emojiTarget!: ElementRef;
  selectedEmoji: string = '';
  toggleMarginLeft: boolean = true;

  constructor(private chatService: ChatService) {

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
}
