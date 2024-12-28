// import { Component, OnInit } from '@angular/core';
// import { ChatService } from '../../../../services/firebase-services/chat.service';
// import { Observable } from 'rxjs';
// import { CommonModule } from '@angular/common';
// import { Message } from '../../../../models/interfaces';
// import { idToken } from '@angular/fire/auth';

// @Component({
//   selector: 'app-chat-all',
//   standalone: true,
//   imports: [CommonModule],
//   templateUrl: './chat-all.component.html',
//   styleUrls: ['./chat-all.component.scss'],
// })
// export class ChatAllComponent implements OnInit {
//   messages$!: Observable<Message[]>;
//   // chatMessages: Array<Message> = [];
//   threadMessages: string[] = [];
//   channelId = 'dOCTHJxiNDhYvmqMokLv';
//   constructor(private chatService: ChatService) {}

//   ngOnInit(): void {
//     this.messages$ = this.chatService.getMessages(this.channelId);
//     this.messages$.subscribe(messages => {
//       messages.forEach(message => {
//         console.log(message.userId);

//         return message.id
//       });
//     });

//     // const channelId = 'dOCTHJxiNDhYvmqMokLv'; // Replace with your channel ID

//      // this.chatService.getMessages(channelId).subscribe((messages) => {
//     //   this.chatMessages = messages;
//     //   console.log('Messages updated:', this.chatMessages);
//     // });
//   }

//   formatTime(timestamp: string): string {
//     const parsedTimestamp = parseInt(timestamp, 10);
//     const timestampInMs =
//       parsedTimestamp < 1e12 ? parsedTimestamp * 1000 : parsedTimestamp;
//     const date = new Date(timestampInMs);
//     return date.toLocaleTimeString('de-DE', {
//       hour: '2-digit',
//       minute: '2-digit',
//     });
//   }

//   checkStyle() {
//     const userId:string = this.chatUser()
//     if (userId == 'wf28r7gfewqq') {
//       return 'primary';
//     } else {
//       return 'secondary';
//     }
//   }

//   chatUser(){
//     this.messages$.subscribe(messages => {
//       messages.forEach(message => {
//         return message.userId
//       });
//     })
//   }
// }
// import { Component, OnInit } from '@angular/core';
// import { ChatService } from '../../../../services/firebase-services/chat.service';
// import { Observable, BehaviorSubject } from 'rxjs';
// import { CommonModule } from '@angular/common';
// import { Message } from '../../../../models/interfaces';

// @Component({
//   selector: 'app-chat-all',
//   standalone: true,
//   imports: [CommonModule],
//   templateUrl: './chat-all.component.html',
//   styleUrls: ['./chat-all.component.scss'],
// })
// export class ChatAllComponent implements OnInit {
//   messages$!: Observable<Message[]>;
//   currentUserId: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);
//   threadMessages: string[] = [];
//   channelId = 'dOCTHJxiNDhYvmqMokLv';

//   constructor(private chatService: ChatService) {}

//   ngOnInit(): void {
//     // Lade die Nachrichten für den Kanal
//     this.messages$ = this.chatService.getMessages(this.channelId);

//     // Abonniere die Nachrichten und speichere die User-ID der ersten Nachricht
//     this.messages$.subscribe(messages => {
//       if (messages.length > 0) {
//         const firstUserId = messages[0].userId;
//         console.log(firstUserId);

//         this.currentUserId.next(firstUserId); // Speichere die User-ID reaktiv
//       }
//     });
//   }

//   formatTime(timestamp: string): string {
//     const parsedTimestamp = parseInt(timestamp, 10);
//     const timestampInMs = parsedTimestamp < 1e12 ? parsedTimestamp * 1000 : parsedTimestamp;
//     const date = new Date(timestampInMs);
//     return date.toLocaleTimeString('de-DE', {
//       hour: '2-digit',
//       minute: '2-digit',
//     });
//   }

//   checkStyle(): string {
//     const userId = this.currentUserId.value; // Synchroner Zugriff auf die gespeicherte User-ID
//     console.log(userId);

//     if (userId === 'OI28qbeslOMfD5nSoQMw8vmU6uQ2') {
//       return 'primary';
//     } else {
//       return 'secondary';
//     }
//   }
// }

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

  checkStyle(userId: string) {
    return userId === 'OI28qbeslOMfD5nSoQMw8vmU6uQ2' ? 'primary' : 'secondary';
  }
}
