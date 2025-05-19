import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { combineLatest, distinctUntilChanged, filter, map, Observable, switchMap, take, tap } from 'rxjs';
import { Message } from '../../../../models/interfaces';
import { ChatService } from '../../../../services/firebase-services/chat.service';
import { ActivatedRoute } from '@angular/router';
import { FilterService } from '../../../../services/component-services/filter.service';
import { EmojiPickerComponent } from '../../emoji-picker/emoji-picker.component';
import { MatCardModule } from '@angular/material/card';
import { ChatComponent } from '../chat.component';
import { UserInfoCardComponent } from "../user-info-card/user-info-card.component";
import { UserDatasService } from '../../../../services/firebase-services/user-datas.service';
import { DmReactionsComponent } from "./dm-reactions/dm-reactions.component";
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-private-chat',
  standalone: true,
  imports: [CommonModule, EmojiPickerComponent, MatCardModule, UserInfoCardComponent, DmReactionsComponent, FormsModule],
  templateUrl: './private-chat.component.html',
  styleUrl: './private-chat.component.scss'
})
export class PrivateChatComponent implements OnInit {
  @ViewChild('chatContainer') chatContainer!: ElementRef;
  messages$!: Observable<Message[]>;
  filteredMessages$!: Observable<any[]>;
  reactions$!: Observable<any[]>;
  channelId: string = '';
  newMessage: boolean = false;
  hoveredMessageId: string | null = null;
  showPicker: boolean = false;
  showFirstMessage: boolean = true;
  showEditMessage: boolean = false;
  editMessageId: string | null = null;
  messageDetailsMap: { [id: string]: any } = {};
  messageValue: string = '';
  isMobile: boolean = false;
  showMobilePicker: boolean = false;

  private scrollListener!: () => void;

  constructor(
    private chatService: ChatService,
    private route: ActivatedRoute,
    private filterService: FilterService,
    public chatComponent: ChatComponent,
    public userDatasService: UserDatasService
  ) { }

  ngOnInit(): void {
    this.loadMessages();
    this.loadFilter();
  }


  setMobilePicker(boolean: boolean) {
    this.showMobilePicker = boolean;
    console.log(this.showMobilePicker);
  }


  setEditId(messageId: string) {
    this.editMessageId = messageId;
  }


  showMemberInfo() {
    this.userDatasService.showUserInfoCard = true;
  }


  // openThread(messageId: string): void {
  //   this.chatService.messageID = messageId;
  //   this.chatService.getMessageThread(messageId);
  //   if (this.chatService.threadClosed) {
  //     this.chatService.toggleDrawerState();
  //     this.chatService.threadClosed = false;
  //   }
  //   this.chatService.showThreadWhenResponsive = true;
  // }


  updateChatMessage(messageId: string, messageUniqueId: string) {
    this.chatService.updateChatMessage(messageId, this.messageValue, messageUniqueId);
    this.editMessageId = null;
  }


  initializeMessageValue(content: string) {
    this.messageValue = content;
  }


  loadMessages() {
    if (this.chatService.getCurrentRoute() === 'public') {
      return;
    }

    this.messages$ = this.route.queryParams.pipe(
      map(params => params['chatId']),
      distinctUntilChanged(),
      tap(chatId => {
        if (!chatId) {
          console.error("Keine chatId in den Query-Parametern gefunden!");
        } else {
          this.chatService.currentChatId = chatId;
        }
      }),
      filter(chatId => !!chatId),
      switchMap(() => this.chatService.getMessages()),
      map((messages: Message[]) => this.returnNewObservable(messages, null)),
      tap((updatedMessages: Message[]) => {
        if (updatedMessages.length > 0) {
          this.showFirstMessage = false;
        }
        this.newMessage = true;
        setTimeout(() => this.scrollToElement('auto'), 1000);
      })
    );
  }


  loadMessageUserIdIntoObject(messages: Array<Message>) {
    messages.forEach(message => {
      this.userDatasService.getUserDataObservable(message.userId)
        .pipe(take(1))
        .subscribe(userData => {
          this.messageDetailsMap[message.uniqueId] = userData;
        }
        );
    });
  }


  sendReaction(emoji: string, id: string) {
    this.chatService.updateMessage(emoji, id, this.userDatasService.currentUserId, false)
  }


  loadFilter() {
    this.filteredMessages$ = combineLatest([
      this.messages$,
      this.filterService.filterText$.pipe(distinctUntilChanged())
    ]).pipe(
      map(([messages, filterText]) => {
        this.loadMessageUserIdIntoObject(messages);
        if (!filterText) return messages;
        const searchLower = filterText.toLowerCase();
        return messages.filter(message => {
          const contentMatch = message.content?.toLowerCase().startsWith(searchLower);
          const dateStr = new Date(message.createdAt).toLocaleDateString('de-DE');
          const dateMatch = dateStr.toLowerCase().includes(searchLower);
          return contentMatch || dateMatch;
        });
      })
    );
  }


  reactionEntries(message: Message): { emoji: string, count: number }[] {
    return Object.entries(message.reaction || {}).map(([emoji, users]) => ({
      emoji,
      count: (users as string[]).length
    }));
  }


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


  @HostListener('window:resize', [])
  isWidth400OrLess() {
    if (window.innerWidth <= 400) {
      this.isMobile = true;
    } else {
      this.isMobile = false;
    }
  }


  @HostListener('window:resize', [])
  isWindowBelow500() {
    if (window.innerWidth <= 500) {
      return true;
    } else {
      this.showMobilePicker = false;
      return false;
    }
  }
  
}