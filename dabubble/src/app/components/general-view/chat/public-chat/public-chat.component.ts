import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  AfterViewInit,
  OnDestroy,
  viewChild,
  Injectable,
} from '@angular/core';
import { ChatService } from '../../../../services/firebase-services/chat.service';
import { BehaviorSubject, Observable, combineLatest, distinctUntilChanged, map, tap } from 'rxjs';
import { CommonModule, Location } from '@angular/common';
import { Message } from '../../../../models/interfaces';
import { ActivatedRoute } from '@angular/router';
import { ChatComponent } from '../chat.component';

import { ChannelMembersComponent } from './channel-members/channel-members.component';
import { AddMembersComponent } from './add-members/add-members.component';
import { ChatDetailsComponent } from './chat-details/chat-details.component';
import { FormsModule } from '@angular/forms';
import { FilterService } from '../../../../services/component-services/filter.service';
import { EmojiPickerComponent } from '../../emoji-picker/emoji-picker.component';

@Component({
  selector: 'app-public-chat',
  standalone: true,
  imports: [
    ChatDetailsComponent,
    ChannelMembersComponent,
    CommonModule,
    AddMembersComponent,
    EmojiPickerComponent,
    FormsModule,
  ],
  templateUrl: './public-chat.component.html',
  styleUrls: ['./public-chat.component.scss'],
})
export class PublicChatComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('chatContainer') chatContainer!: ElementRef;

  messages$!: Observable<Message[]>;
  filteredMessages$!: Observable<any[]>;
  reactions$!:Observable<any[]>
  channelId: string = 'ER84UOYc0F2jptDjWxFo';
  newMessage: boolean = false;
  hoveredMessageId: string | null = null;
  currentChannelName: string = `Entwicklerchannel`; //ändern via abfrage
  chatDetails: boolean = false;
  showGreyScreen: boolean = false;
  showMembersInfo: boolean = false;
  showAddMembers: boolean = false;
  showPicker:boolean = false

  private scrollListener!: () => void;

  constructor(
    private chatService: ChatService,
    private route: ActivatedRoute,
    private location: Location,
    private filterService : FilterService
  ) {}

  ngOnInit(): void {
/*     this.route.queryParams.subscribe((params) => {
      this.channelId = params['chatID'];
    }); */
    this.loadMessages();
    this.loadFilter();
    this.detectUrlChange();
  }

  loadMessages() {
    const messages = this.chatService.getMessages(this.channelId);
    this.messages$ = messages.pipe(
      map((messages: Message[]) => this.returnNewObservable(messages, null)),
      tap((updatedMessages) => {
        console.log("Updated messages:", updatedMessages); // Logge die transformierten Nachrichten
        this.newMessage = true;
      })
    );
    setTimeout(() => this.scrollToElement('auto'), 1000);
  }

  // loadFilter() {
  //   this.filteredMessages$ = combineLatest([
  //     this.messages$,
  //     this.filterService.filterText$.pipe(distinctUntilChanged())
  //   ]).pipe(
  //     map(([messages, filterText]) => {
  //       if (!filterText) {
  //         return messages;
  //       }
  //       const searchLower = filterText.toLowerCase();
  //       return messages.filter(message => {
  //         const contentMatch = message.content?.toLowerCase().startsWith(searchLower);
  //         const senderMatch = message.sender?.toLowerCase().startsWith(searchLower);
  //         const dateStr = new Date(message.createdAt).toLocaleDateString('de-DE');
  //         const dateMatch = dateStr.toLowerCase().includes(searchLower);
  //         return contentMatch || senderMatch || dateMatch;
  //       });
  //     })
  //   );
  // }
  
  loadFilter() {
    this.filteredMessages$ = combineLatest([
      this.messages$,
      this.filterService.filterText$.pipe(distinctUntilChanged())
    ]).pipe(
      map(([messages, filterText]) => {
        if (!filterText) return messages;
    
        const searchLower = filterText.toLowerCase();
        return messages.filter(message => {
          const contentMatch = message.content?.toLowerCase().startsWith(searchLower);
          const senderMatch = message.sender?.toLowerCase().startsWith(searchLower);
          const dateStr = new Date(message.createdAt).toLocaleDateString('de-DE');
          const dateMatch = dateStr.toLowerCase().includes(searchLower);
          return contentMatch || senderMatch || dateMatch;
        });
      })
    );
  }

  reactionEntries(message: Message): { emoji: string, count: number }[] {
    return Object.entries(message.reaction || {}).map(([emoji, users]) => ({
      emoji,
      count: (users as string[]).length // Typ-Cast, um `unknown` zu vermeiden
    }));
  }
  

  /**
   * Subscribes to URL Changes
   */
  detectUrlChange() {
    this.location.onUrlChange((url) => {
      this.extractCurrentChannelIdFromUrl(url);
      this.loadMessages();
    });
  }

  /**
   * Extracts the ChatID from the current URL and assigns it to the channelId-Variable
   * @param url The current URL as a string
   */
  extractCurrentChannelIdFromUrl(url: string) {
    const fixedUrl = url.replace('/chatID=', '&chatID=');
    const queryParams = new URLSearchParams(fixedUrl.split('?')[1]);
    const chatID = queryParams.get('chatID');
    if (chatID) {
      this.channelId = chatID;
    }
  }

  toggleChatDetails() {
    this.showGreyScreen = !this.showGreyScreen;
    this.chatDetails = !this.chatDetails;
  }

  openMembersInfo() {
    this.showGreyScreen = true;
    this.showMembersInfo = true;
  }

  closeMembersInfo() {
    this.showMembersInfo = false;
    this.showGreyScreen = false;
  }

  openAddMembersMenu() {
    if (this.showMembersInfo) {
      this.closeMembersInfo();
    }
    this.showGreyScreen = true;
    this.showAddMembers = true;
  }

  closeAddMembersMenu() {
    this.showAddMembers = false;
    this.showGreyScreen = false;
  }

  // loadChatOnIdChange() {
  //   this.getChatMessages();
  // }

  // getChatMessages() {
  //   if (this.channelId != ``) {
  //     this.messages$ = this.chatService.getMessages(this.channelId).pipe(
  //       map((messages: Message[]) => this.returnNewObservable(messages, null)),
  //       tap(() => {
  //         this.newMessage = true;
  //       })
  //     );
  //     setTimeout(() => this.scrollToElement('auto'), 1000);
  //   } else {
  //     console.log("No ChatId provided yet");
  //   }
  // }

  ngAfterViewInit(): void {
    if (this.chatContainer) {
      this.scrollListener = this.onScroll.bind(this);
      this.chatContainer.nativeElement.addEventListener(
        'scroll',
        this.scrollListener
      );
    }
  }

  ngOnDestroy(): void {
    if (this.chatContainer && this.scrollListener) {
      this.chatContainer.nativeElement.removeEventListener(
        'scroll',
        this.scrollListener
      );
    }
  }

  scrollToElement(behavior: string): void {
    if (this.chatContainer) {
      this.chatContainer.nativeElement.scroll({
        top: this.chatContainer.nativeElement.scrollHeight,
        left: 0,
        behavior: behavior,
      });
      this.newMessage = false;
    }
  }

  onScroll(): void {
    if (this.chatContainer) {
      const element = this.chatContainer.nativeElement;
      const isAtBottom =
        element.scrollTop + element.clientHeight >= element.scrollHeight - 10;
      if (isAtBottom) {
        this.newMessage = false;
      }
    }
  }

  /**
   * Transforms an array of messages to include display-related metadata for dates.
   *
   * This method maps over a list of messages and determines whether the date
   * of each message should be displayed. It compares the current message's date
   * with the last seen date to decide if a new date separator is needed.
   *
   * @param {Message[]} messages - An array of messages to process.
   * @param {string | null} lastDate - The last displayed date in 'dd.mm.yy' format or null if none.
   * @returns {Array} - A new array of messages, each with added properties:
   *   - `showDate` (boolean): Whether to display the date for this message.
   *   - `formattedDate` (string | null): The formatted date to display if `showDate` is true.
   */
  returnNewObservable(messages: Message[], lastDate: string | null) {
    return messages.map((message) => {
      const currentDate = new Date(message.createdAt).toLocaleDateString(
        'de-DE',
        {
          day: '2-digit',
          month: '2-digit',
          year: '2-digit',
        }
      );
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
    return userId === currentUser ? 'secondary' : 'primary';
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
