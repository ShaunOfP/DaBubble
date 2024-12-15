import {
  Component,
  AfterViewInit,
  ViewChild,
  ElementRef,
  ChangeDetectorRef,
} from '@angular/core';
import { ChatDetailsComponent } from '../chat-details/chat-details.component';
import { CommonModule } from '@angular/common';
import { EmojiPickerComponent } from '../emoji-picker/emoji-picker.component';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [ChatDetailsComponent, CommonModule, EmojiPickerComponent],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss',
})
export class ChatComponent implements AfterViewInit {
  @ViewChild(EmojiPickerComponent) emojiPicker!: EmojiPickerComponent;
  @ViewChild('emojiTarget', { static: true }) emojiTarget!: ElementRef;

  showEmojiPicker: boolean = false;

  constructor(private cdRef: ChangeDetectorRef) {} // ChangeDetectorRef injizieren

  openChatDetails() {
    document.getElementById('chatDetailsOverlay')?.classList.remove('d-none');
  }

  closeChatDetails() {
    document.getElementById('chatDetailsOverlay')?.classList.add('d-none');
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
