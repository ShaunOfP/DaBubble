import { CommonModule, Location } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { combineLatest, distinctUntilChanged, map, Observable, tap } from 'rxjs';
import { Message } from '../../../../models/interfaces';
import { ChatService } from '../../../../services/firebase-services/chat.service';
import { ActivatedRoute } from '@angular/router';
import { FilterService } from '../../../../services/component-services/filter.service';
import { EmojiPickerComponent } from '../../emoji-picker/emoji-picker.component';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-private-chat',
  standalone: true,
  imports: [CommonModule, EmojiPickerComponent, MatCardModule],
  templateUrl: './private-chat.component.html',
  styleUrl: './private-chat.component.scss'
})
export class PrivateChatComponent {
  @ViewChild('chatContainer') chatContainer!: ElementRef;
  messages$!: Observable<Message[]>;
  filteredMessages$!: Observable<any[]>;
  reactions$!: Observable<any[]>;
  channelId: string = 'ER84UOYc0F2jptDjWxFo';
  newMessage: boolean = false;
  hoveredMessageId: string | null = null;
  showPicker: boolean = false;
  showPopoverReaction: number | null = null;
  memberInfoVisible: boolean = false;

  private scrollListener!: () => void;

  constructor(
    private chatService: ChatService,
    private route: ActivatedRoute,
    private location: Location,
    private filterService: FilterService
  ) { }

  ngOnInit(): void {
    this.loadMessages();
    this.loadFilter();
    this.detectUrlChange();
  }


  showMemberInfo() {
    this.memberInfoVisible = !this.memberInfoVisible;
  }


  loadMessages() {
    const messages = this.chatService.getMessages();
    this.messages$ = messages.pipe(
      map((messages: Message[]) => this.returnNewObservable(messages, null)),
      tap((updatedMessages) => {
        console.log("Updated messages:", updatedMessages);
        this.newMessage = true;
      })
    );
    setTimeout(() => this.scrollToElement('auto'), 1000);
  }

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
      count: (users as string[]).length
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


  togglePopover(i: number) {

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

  openMessageToUser(){
    this.memberInfoVisible = false;
  }
}
