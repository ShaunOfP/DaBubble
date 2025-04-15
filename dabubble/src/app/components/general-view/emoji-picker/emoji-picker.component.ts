import { CommonModule } from '@angular/common';
import { Component, Output, EventEmitter, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-emoji-picker',
  standalone: true,
  imports: [MatCardModule, CommonModule], 
  templateUrl: './emoji-picker.component.html',
  styleUrl: './emoji-picker.component.scss',
})
export class EmojiPickerComponent {
  emojis = ['😁', '😀', '😃', '😄', '😉', '😊', '😋', '😎', '🙂', '😚', '😪', '😴', '😌', '😛', '🤐', '😂', '🤣', '😐', '🤔', '😮', '😬', '🤯', '😇', '🥳'];
  reactions = ['🤯', '😇', '🥳'];
  @Input() showReactionsOnly: boolean = false;
  @Output() emojiSelected = new EventEmitter<string>(); 


  /**
   * Adds an emoji
   * @param emoji the currently clicked Emoji from the emojis-array
   */
  addEmoji(emoji: string) {
    this.emojiSelected.emit(emoji); 
  }
}