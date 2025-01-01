import { Component, OnInit } from '@angular/core';
import { ChatService } from '../../../../services/firebase-services/chat.service';
import { Observable, last, map } from 'rxjs';
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
  messages$!: Observable<any[]>;
  channelId: string = 'dOCTHJxiNDhYvmqMokLv';

  constructor(private chatService: ChatService) {}

  ngOnInit(): void {
    this.messages$ = this.chatService.getMessages(this.channelId).pipe(
      map((messages: Message[]) => {
        let lastDate: string | null = null;
        return this.returnNewObservable(messages, lastDate)
       
      })
    );
  }
  
  returnNewObservable(messages: Message[], lastDate: string | null){
    return messages.map((message) => {
      const currentDate = new Date(message.createdAt).toLocaleDateString('de-DE', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit',
      });
      const showDate = currentDate !== lastDate;
      lastDate = currentDate; 
      return {
        ...message,
        showDate,
        formattedDate: showDate ? currentDate : null,
      };
    });
  }

  formatTime(timestamp: number): string {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('de-DE', {
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  checkStyle(userId: string): string {
    return userId === 'OI28qbeslOMfD5nSoQMw8vmU6uQ2' ? 'primary' : 'secondary';
  }

  openThread(): void {
    // Logik für Thread-Öffnung
  }
}
