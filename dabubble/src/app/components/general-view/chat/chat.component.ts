import { Component, ElementRef, ViewChild } from '@angular/core';
import { ChatDetailsComponent } from "../chat-details/chat-details.component";

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [ChatDetailsComponent],
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
