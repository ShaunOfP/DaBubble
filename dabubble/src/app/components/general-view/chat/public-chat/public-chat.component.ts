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
import { BehaviorSubject, Observable, combineLatest, distinctUntilChanged, filter, map, switchMap, tap } from 'rxjs';
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
import { UserDatasService } from '../../../../services/firebase-services/user-datas.service';

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
  reactions$!: Observable<any[]>;
  channelId: string = 'ER84UOYc0F2jptDjWxFo';
  newMessage: boolean = false;
  hoveredMessageId: string | null = null;
  currentChannelName: string = `Entwicklerchannel`;
  chatDetails: boolean = false;
  showGreyScreen: boolean = false;
  showMembersInfo: boolean = false;
  showAddMembers: boolean = false;
  showPicker: boolean = false
  showPopoverReaction: number | null = null;
  reactionUserNamesCache: { [key: number]: string[] } = {}; // Cache für Benutzernamen

  private scrollListener!: () => void;

  constructor(
    private chatService: ChatService,
    private route: ActivatedRoute,
    private location: Location,
    private filterService: FilterService,
    private userDataService: UserDatasService
  ) { }

  ngOnInit(): void {
    /*     this.route.queryParams.subscribe((params) => {
          this.channelId = params['chatID'];
        }); */
    this.loadMessages();
    this.loadFilter();
    this.detectUrlChange();
  }

  loadMessages() {
    // const messages = this.chatService.getMessages();
    // this.messages$ = messages.pipe(
    //   map((messages: Message[]) => this.returnNewObservable(messages, null)),
    //   tap((updatedMessages) => {
    //     console.log("Updated messages:", updatedMessages);
    //     this.newMessage = true;
    //   })
    // );
    // setTimeout(() => this.scrollToElement('auto'), 1000);
    debugger
    this.messages$ = this.route.queryParams.pipe(
      map(params => params['chatId']),
      distinctUntilChanged(), // Nur weiter, wenn sich die chatId wirklich ändert
      tap(chatId => {
        if (!chatId) {
          console.error("Keine chatId in den Query-Parametern gefunden!");
        } else {
          this.chatService.currentChatId = chatId;
          console.log("Aktuelle chatId:", this.chatService.currentChatId);
        }
      }),
      filter(chatId => !!chatId), // Nur fortfahren, wenn eine gültige chatId vorhanden ist
      switchMap(() => this.chatService.getMessages()),
      map((messages: Message[]) => this.returnNewObservable(messages, null)),
      tap((updatedMessages: Message[]) => {
        console.log("Aktualisierte Nachrichten:", updatedMessages);
        this.newMessage = true;
        setTimeout(() => this.scrollToElement('auto'), 1000);
      })
    );


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

  // reactionEntries(message: Message): { emoji: string, count: number }[] {
  //   return Object.entries(message.reaction || {}).map(([emoji, users]) => ({
  //     emoji,
  //     count: (users as string[]).length,
  //   }));
  // }


  reactionEntries(message: Message): { emoji: string, count: number, users: string[] }[] {
    return Object.entries(message.reaction || {}).map(([emoji, users]) => ({
      emoji,
      count: (users as string[]).length,
      users: users as string[],
    }));
  }



  async showPopover(index: number, users: string[]) {
    if (!this.reactionUserNamesCache[index]) {
      this.reactionUserNamesCache[index] = await this.formatUserNames(users);
    }
    this.showPopoverReaction = index;
  }

  hidePopover(i: number) {
    this.showPopoverReaction = i - (i + 1);
  }

  async formatUserNames(users: string[]): Promise<string[]> {
    let formattedNames = await Promise.all(
      users.map(async (id) => id === this.userDataService.currentUserId ? "Du" : await this.userDataService.getUserName(id))
    );
    const hasDu = formattedNames.includes("Du");
    let maxNames = hasDu ? 1 : 2;
    formattedNames.sort((a, b) => (a === "Du" ? 1 : b === "Du" ? -1 : 0));
    return formattedNames.slice(0, maxNames).concat(hasDu ? ["Du"] : []);
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