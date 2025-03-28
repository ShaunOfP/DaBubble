import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { combineLatest, distinctUntilChanged, filter, map, Observable, switchMap, tap } from 'rxjs';
import { Message } from '../../../../models/interfaces';
import { ChatService } from '../../../../services/firebase-services/chat.service';
import { ActivatedRoute } from '@angular/router';
import { FilterService } from '../../../../services/component-services/filter.service';
import { EmojiPickerComponent } from '../../emoji-picker/emoji-picker.component';
import { MatCardModule } from '@angular/material/card';
import { ChatComponent } from '../chat.component';
import { UserInfoCardComponent } from "../user-info-card/user-info-card.component";
import { UserDatasService } from '../../../../services/firebase-services/user-datas.service';

@Component({
  selector: 'app-private-chat',
  standalone: true,
  imports: [CommonModule, EmojiPickerComponent, MatCardModule, UserInfoCardComponent],
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
  showPopoverReaction: number | null = null;
  showFirstMessage: boolean = true;

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


  showMemberInfo() {
    this.userDatasService.showUserInfoCard = true;
  }


  loadMessages() {
    // Umschreiben in den Service, sodass entweder das hier geladen wird, wenn url private enthält oder sonst das andere wenn url public enthält
    // if private dann folgender code, besser anpassen durch url auslesung
    // je nach public/private in den jeweiligen collections suchen
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
          console.log("Aktuelle chatId:", this.chatService.currentChatId);
        }
      }),
      filter(chatId => !!chatId),
      switchMap(() => this.chatService.getMessages()),
      map((messages: Message[]) => this.returnNewObservable(messages, null)),
      tap((updatedMessages: Message[]) => {
        console.log("Aktualisierte Nachrichten:", updatedMessages);
        if (updatedMessages.length > 0){
          this.showFirstMessage = false;
        }
        this.newMessage = true;
        setTimeout(() => this.scrollToElement('auto'), 1000);
      })
    );
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
}