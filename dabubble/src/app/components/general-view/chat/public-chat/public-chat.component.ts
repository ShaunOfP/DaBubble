import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  AfterViewInit,
  OnDestroy,
} from '@angular/core';
import { ChatService } from '../../../../services/firebase-services/chat.service';
import { Observable, combineLatest, distinctUntilChanged, filter, map, switchMap, tap } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Message } from '../../../../models/interfaces';
import { ActivatedRoute, Router } from '@angular/router';
import { ChannelMembersComponent } from './channel-members/channel-members.component';
import { AddMembersComponent } from './add-members/add-members.component';
import { ChatDetailsComponent } from './chat-details/chat-details.component';
import { FormsModule } from '@angular/forms';
import { FilterService } from '../../../../services/component-services/filter.service';
import { EmojiPickerComponent } from '../../emoji-picker/emoji-picker.component';
import { UserDatasService } from '../../../../services/firebase-services/user-datas.service';
import { getDoc } from '@angular/fire/firestore';

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
  newMessage: boolean = false;
  hoveredMessageId: string | null = null;
  chatDetails: boolean = false;
  showGreyScreen: boolean = false;
  showMembersInfo: boolean = false;
  showAddMembers: boolean = false;
  showPicker: boolean = false
  showPopoverReaction: number | null = null;
  reactionUserNamesCache: { [key: number]: string[] } = {}; // Cache für Benutzernamen
  currentChannelData: any;
  currentChatId: string = '';

  private scrollListener!: () => void;

  constructor(
    private chatService: ChatService,
    private route: ActivatedRoute,
    private filterService: FilterService,
    private userDataService: UserDatasService,
    private router: Router
  ) { }

  ngOnInit() {
    this.getCurrentChatId();
    this.loadMessages();
    this.loadFilter();
  }


  getCurrentChatId() {
    this.route.queryParams.subscribe((params) => {
      if (params['chatId']) {
        this.currentChatId = params['chatId'];
        this.loadChannelInfo();
        this.loadMessages();
      } else {
        console.error('No userID found in query parameters');
      }
    });
  }


  async loadChannelInfo() {
    const data = await getDoc(this.chatService.getChannelDocRef(this.currentChatId));

    if (data.exists()) {
      this.currentChannelData = data.data();
      console.log(this.currentChannelData);
    }
  }

  loadMessages() {
    const currentRoute = this.router.url;
    if (currentRoute.includes('private-chat')) {
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

  // reactionEntries(message: Message): { emoji: string, count: number, users: string[] }[] {
  //   return Object.entries(message.reaction || {}).map(([emoji, users]) => ({
  //     emoji,
  //     count: (users as string[]).length,
  //     users: users as string[],
  //   }));
  // }

  reactionEntries(message: Message): {
    isImage: boolean;
    value: string;
    count: number;
    users: string[];
  }[] {
    return Object.entries(message.reaction || {}).map(([emoji, users]) => {
      // Falls in deiner Datenbank "green_check" als Platzhalter steht
      if (emoji === 'green_check') {
        return {
          isImage: true,
          // Pfad zu deiner SVG oder PNG
          value: 'img/general-view/chat/green_check.svg',
          count: (users as string[]).length,
          users: users as string[],
        };
      } else {
        // Andernfalls ist es ein normales Emoji
        return {
          isImage: false,
          value: emoji,
          count: (users as string[]).length,
          users: users as string[],
        };
      }
    });
  }


  async showPopover(index: number, users: string[]) {
    if (!this.reactionUserNamesCache[index]) {
      this.reactionUserNamesCache[index] = await this.formatUserNames(users);
    }
    this.showPopoverReaction = index;
  }

  hidePopover() {
    this.showPopoverReaction = null;
  }

  async formatUserNames(users: string[]): Promise<string[]> {
    let formattedNames = await Promise.all(
      users.map(async (id) => id === this.userDataService.currentUserId ? "Du" : await this.userDataService.getUserName(id))
    );
    const yourself = formattedNames.includes("Du");
    formattedNames = formattedNames.filter(name => name !== "Du");
    let maxNames = yourself ? 1 : 2;
    let result = formattedNames.slice(0, maxNames);
    if (yourself) {
      result.push("Du");
    }
    return result;
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

  sendReaction(emoji: string, id: string) {
    console.log(emoji + id);
    this.chatService.updateMessage(emoji, id, this.userDataService.currentUserId)
  }

  openThread(messageId:string): void {
    debugger
    
    this.chatService.getMessageThread(messageId)
  }
}