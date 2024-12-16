import { CommonModule } from '@angular/common';
import { Component, Output, EventEmitter } from '@angular/core';
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

  @Output() emojiSelected = new EventEmitter<string>(); 

  addEmoji(emoji: string) {
    this.emojiSelected.emit(emoji); 
  }
}