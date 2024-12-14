import { Component, ElementRef, ViewChild } from '@angular/core';
import { ChatDetailsComponent } from "../chat-details/chat-details.component";
import { EmojiPickerComponent } from '../emoji-picker/emoji-picker.component';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [ChatDetailsComponent, EmojiPickerComponent],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss'
})
export class ChatComponent {
  openChatDetails() {
    document.getElementById('chatDetailsOverlay')?.classList.remove('d-none');
  }

  closeChatDetails(){
    document.getElementById('chatDetailsOverlay')?.classList.add('d-none');
  }
}
