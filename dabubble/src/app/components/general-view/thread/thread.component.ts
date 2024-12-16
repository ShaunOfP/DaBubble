import { Component, EventEmitter, Output, ViewChild, ElementRef } from '@angular/core';
import { EmojiPickerComponent } from '../emoji-picker/emoji-picker.component';

@Component({
  selector: 'app-thread',
  standalone: true,
  imports: [EmojiPickerComponent],
  templateUrl: './thread.component.html',
  styleUrl: './thread.component.scss'
})
export class ThreadComponent {
  @Output() callParent: EventEmitter<void> = new EventEmitter();
    @ViewChild('emojiTarget', { static: true }) emojiTarget!: ElementRef;
    selectedEmoji: string = '';

  /**
   * Emit a signal to the parent element to hide/close the Thread Menu
   */
  closeThread(){
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
}
