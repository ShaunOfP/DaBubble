import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { ChatService } from '../../../../services/firebase-services/chat.service';

@Component({
  selector: 'app-thread-messages',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './thread-messages.component.html',
  styleUrl: './thread-messages.component.scss'
})
export class ThreadMessagesComponent {
  messages$!: Observable<any[]>;

  constructor(private chatService: ChatService) { }

  ngOnInit(){
    this.messages$ = this.chatService.getThreadCollection('dOCTHJxiNDhYvmqMokLv', 'buM6uSAhw8snf948FEIh');
  }
}
