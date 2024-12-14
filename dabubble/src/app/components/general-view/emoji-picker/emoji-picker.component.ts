import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card'; 

@Component({
  selector: 'app-emoji-picker',
  standalone: true,
  imports: [MatCardModule, CommonModule], // Importiere MatCardModule
  templateUrl: './emoji-picker.component.html',
  styleUrl: './emoji-picker.component.scss'
})
export class EmojiPickerComponent {
  selectedEmoji: string = ''; // Variable für das ausgewählte Emoji

  showEmojiCard(emoji: string) {
    this.selectedEmoji = emoji; // Speichere das angeklickte Emoji
  }
}