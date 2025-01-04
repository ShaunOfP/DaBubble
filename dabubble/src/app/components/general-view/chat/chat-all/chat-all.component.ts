import { Component, OnInit, ElementRef, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { ChatService } from '../../../../services/firebase-services/chat.service';
import { Observable, map, tap } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Message } from '../../../../models/interfaces';
import { ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-chat-all',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './chat-all.component.html',
  styleUrls: ['./chat-all.component.scss'],
})
export class ChatAllComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('chatContainer') chatContainer!: ElementRef;
  messages$!: Observable<any[]>;
  channelId: string = 'dOCTHJxiNDhYvmqMokLv';
  newMessage: boolean = false;
  private scrollListener!: () => void;

  constructor(private chatService: ChatService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.messages$ = this.chatService.getMessages(this.channelId).pipe(
      map((messages: Message[]) => this.returnNewObservable(messages, null)),
      tap(() => {
        this.newMessage = true;
      })
    );
    setTimeout(() => this.scrollToElement('auto'), 1000);
  }

  ngAfterViewInit(): void {
    if (this.chatContainer) {
      this.scrollListener = this.onScroll.bind(this);
      this.chatContainer.nativeElement.addEventListener('scroll', this.scrollListener);
    }
  }

  ngOnDestroy(): void {
    if (this.chatContainer && this.scrollListener) {
      this.chatContainer.nativeElement.removeEventListener('scroll', this.scrollListener);
    }
  }

  scrollToElement(behavior:string): void {
    if (this.chatContainer) {
      this.chatContainer.nativeElement.scroll({
        top: this.chatContainer.nativeElement.scrollHeight,
        left: 0,
        behavior: behavior
      });
      this.newMessage = false;

    }
  }

  onScroll(): void {
    if (this.chatContainer) {
      const element = this.chatContainer.nativeElement;
      const isAtBottom = element.scrollTop + element.clientHeight >= element.scrollHeight - 10;
      if (isAtBottom) {
        this.newMessage = false;        
      }
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
    let currentUser: string = '';
    this.route.queryParams.subscribe((params) => {
      currentUser = params['userID'];
    });
    return userId === currentUser ? 'primary' : 'secondary';
  }
  

  openThread(): void {
    // Logic for opening a thread
  }
}





// ngAfterViewInit(): void {
  //   if (this.chatContainer) {
  //     console.log('chatContainer is defined');
  //     this.scrollToBottom();
  //     this.observer = new MutationObserver(() => {
  //       this.scrollToBottom();
  //     });
  //     this.observer.observe(this.chatContainer.nativeElement, { childList: true, subtree: true });
  //     console.log('Chat container:', this.chatContainer);
  //   } else {
  //     console.error('chatContainer is not defined in ngAfterViewInit');
  //   }
  // }

  // ngAfterViewChecked() {
  //   this.scrollToBottom();
  // }

  // ngOnDestroy(): void {
  //   if (this.observer) {
  //     this.observer.disconnect();
  //   }
  // }

  // private scrollToBottom(): void {
  //   try {
  //     console.log('scrollToBottom called');
  //     if (this.chatContainer) {
  //       const chatContainerElement = this.chatContainer.nativeElement;
  //       const numberOfChildren = chatContainerElement.children.length;
  //       console.log('Number of children:', numberOfChildren);
  //       console.log('Previous number of children:', this.previousNumberOfChildren);

  //       // Log the class of the parent element
  //       console.log('Parent element class:', chatContainerElement.className);

  //       // Log the classes of the child elements
  //       for (let i = 0; i < chatContainerElement.children.length; i++) {
  //         const child = chatContainerElement.children[i];
  //         console.log(`Child ${i} class:`, child.className);
  //       }

  //       if (numberOfChildren > this.previousNumberOfChildren) {
  //         chatContainerElement.scrollTop = chatContainerElement.scrollHeight;
  //         console.log('Scrolled to bottom');
  //         this.previousNumberOfChildren = numberOfChildren;
  //       }
  //     } else {
  //       console.error('chatContainer is not defined');
  //     }
  //   } catch (err) {
  //     console.error('Error scrolling to bottom:', err);
  //   }
  // }