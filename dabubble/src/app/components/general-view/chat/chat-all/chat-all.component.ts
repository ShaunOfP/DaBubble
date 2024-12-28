import { Component, OnInit } from '@angular/core';
import { ChatService } from '../../../../services/firebase-services/chat.service';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Message } from '../../../../models/interfaces';


@Component({
  selector: 'app-chat-all',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './chat-all.component.html',
  styleUrls: ['./chat-all.component.scss'],
})
export class ChatAllComponent implements OnInit {
  // messages$!: Observable<any[]>;
  chatMessages: Array<Message> = [];
  threadMessages: string[] = [];
  date: string[] = [];

  constructor(private chatService: ChatService) {}

  ngOnInit(): void {
    const channelId = 'dOCTHJxiNDhYvmqMokLv'; // Replace with your channel ID
    //   this.messages$ = this.chatService.getMessages(channelId);
    this.chatService.getMessages(channelId).subscribe((messages) => {
      this.chatMessages = messages;
      console.log('Messages updated:', this.chatMessages);
    });
  }
  formatTime(timestamp: string): string {
    const parsedTimestamp = parseInt(timestamp, 10);
    const timestampInMs =
      parsedTimestamp < 1e12 ? parsedTimestamp * 1000 : parsedTimestamp;
    const date = new Date(timestampInMs);
    return date.toLocaleTimeString('de-DE', {
      hour: '2-digit',
      minute: '2-digit',
    });
  }
}
