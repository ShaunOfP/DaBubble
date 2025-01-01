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
  channelId: string = 'dOCTHJxiNDhYvmqMokLv';
  lastTimestamp: string = '';

  constructor(private chatService: ChatService) {}

  ngOnInit(): void {
    this.messages$ = this.chatService.getMessages(this.channelId);
  }

  parseTimestamp(timestamp:string){
    const parsedTimestamp = parseInt(timestamp, 10);
    const timestampInMs = parsedTimestamp < 1e12 ? parsedTimestamp * 1000 : parsedTimestamp;
    return timestampInMs
  }

  formatTime(timestamp: string) {
    const timestampInMs = this.parseTimestamp(timestamp) 
    const date = new Date(timestampInMs);
    return date.toLocaleTimeString('de-DE', {
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  newDate(timestamp:string){
    const dateTime = this.parseTimestamp(timestamp)
    const date = new Date(dateTime).toLocaleDateString('de-DE', {
      day: '2-digit',
      month:'2-digit',
      year: '2-digit',
    })
    console.log(date)
    if(this.lastTimestamp === '' || this.lastTimestamp <= date)
    {
      this.lastTimestamp = date
      return true
    }
    else{ return false}
  }

  // formatDate(timestamp: string){
  //   const dateTime = this.parseTimestamp(timestamp) 
  //   const date = new Date(dateTime)
  //   return date.toLocaleTimeString('de-DE', {
  //     day: '2-digit',
  //     month:'2-digit',
  //     year: '2-digit',
  //   })
  // }

  checkStyle(userId: string) {
    return userId === 'OI28qbeslOMfD5nSoQMw8vmU6uQ2' ? 'primary' : 'secondary';
  }

  openThread(){
    
  }
}
