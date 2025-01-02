import { Component, OnInit, ElementRef, ViewChild, AfterViewInit, AfterViewChecked, OnDestroy } from '@angular/core';
import { ChatService } from '../../../../services/firebase-services/chat.service';
import { Observable, map } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Message } from '../../../../models/interfaces';

@Component({
  selector: 'app-chat-all',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './chat-all.component.html',
  styleUrls: ['./chat-all.component.scss'],
})
export class ChatAllComponent implements OnInit, AfterViewInit, AfterViewChecked, OnDestroy {
  @ViewChild('chatContainer') chatContainer!: ElementRef;
  messages$!: Observable<any[]>;
  channelId: string = 'dOCTHJxiNDhYvmqMokLv';
  private observer!: MutationObserver;
  private previousNumberOfChildren: number = 0;

  constructor(private chatService: ChatService) {}

  ngOnInit(): void {
    this.messages$ = this.chatService.getMessages(this.channelId).pipe(
      map((messages: Message[]) => {
        let lastDate: string | null = null;
        return this.returnNewObservable(messages, lastDate);
      })
    );
  }

  ngAfterViewInit(): void {
    if (this.chatContainer) {
      console.log('chatContainer is defined');
      this.scrollToBottom();
      this.observer = new MutationObserver(() => {
        this.scrollToBottom();
      });
      this.observer.observe(this.chatContainer.nativeElement, { childList: true, subtree: true });
      console.log('Chat container:', this.chatContainer);
    } else {
      console.error('chatContainer is not defined in ngAfterViewInit');
    }
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  ngOnDestroy(): void {
    if (this.observer) {
      this.observer.disconnect();
    }
  }

  private scrollToBottom(): void {
    try {
      console.log('scrollToBottom called');
      if (this.chatContainer) {
        const chatContainerElement = this.chatContainer.nativeElement;
        const numberOfChildren = chatContainerElement.children.length;
        console.log('Number of children:', numberOfChildren);
        console.log('Previous number of children:', this.previousNumberOfChildren);

        // Log the class of the parent element
        console.log('Parent element class:', chatContainerElement.className);

        // Log the classes of the child elements
        for (let i = 0; i < chatContainerElement.children.length; i++) {
          const child = chatContainerElement.children[i];
          console.log(`Child ${i} class:`, child.className);
        }

        if (numberOfChildren > this.previousNumberOfChildren) {
          chatContainerElement.scrollTop = chatContainerElement.scrollHeight;
          console.log('Scrolled to bottom');
          this.previousNumberOfChildren = numberOfChildren;
        }
      } else {
        console.error('chatContainer is not defined');
      }
    } catch (err) {
      console.error('Error scrolling to bottom:', err);
    }
  }

  returnNewObservable(messages: Message[], lastDate: string | null) {
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
    // Logic for opening a thread
  }
}