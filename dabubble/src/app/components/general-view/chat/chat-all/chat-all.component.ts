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
  messages$!: Observable<Message[]>;
  channelId = 'dOCTHJxiNDhYvmqMokLv';

  constructor(private chatService: ChatService) {}

  ngOnInit(): void {
    this.messages$ = this.chatService.getMessages(this.channelId);
  }

  formatTime(timestamp: number): string {
    const parsedTimestamp = parseInt(timestamp.toString(), 10);
    const timestampInMs = parsedTimestamp < 1e12 ? parsedTimestamp * 1000 : parsedTimestamp;
    const date = new Date(timestampInMs);
    return date.toLocaleTimeString('de-DE', {
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  checkStyle(userId: string) {
    return userId === 'OI28qbeslOMfD5nSoQMw8vmU6uQ2' ? 'primary' : 'secondary';
  }

  openThread(){
    
  }
}
