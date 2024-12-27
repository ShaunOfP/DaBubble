import { Component, OnInit } from '@angular/core';
import { ChatService } from '../../../../services/firebase-services/chat.service';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-chat-all',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './chat-all.component.html',
  styleUrls: ['./chat-all.component.scss']
})
export class ChatAllComponent implements OnInit {
  messages$!: Observable<any[]>;
  threadMessages: any[] = [];

  constructor(private chatService: ChatService) { }

  ngOnInit(): void {
    const channelId = 'dOCTHJxiNDhYvmqMokLv'; // Replace with your channel ID
    this.messages$ = this.chatService.getMessages(channelId);
  }
}