import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  AfterViewInit,
  OnDestroy,
  HostListener,
} from '@angular/core';
import { ChatService } from '../../../../services/firebase-services/chat.service';
import { Observable, Subscription, combineLatest, distinctUntilChanged, filter, map, switchMap, take, tap } from 'rxjs';
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
import { ReactionsComponent } from './reactions/reactions.component';
import { ChannelMemberService } from '../../../../services/firebase-services/channel-member.service';

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
    ReactionsComponent
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
  showMembersInfo: boolean = false;
  showPicker: boolean = false;
  showEditMessage: boolean = false;
  editMessageId: string | null = null;
  messageValue: string = '';
  hideReactionMenu: boolean = false;
  isMobile = false;
  messageDetailsMap: { [id: string]: any } = {};
  private subscription!: Subscription;

  private scrollListener!: () => void;

  constructor(
    public chatService: ChatService,
    private route: ActivatedRoute,
    private filterService: FilterService,
    private userDataService: UserDatasService,
    private router: Router,
    public channelMembersService: ChannelMemberService
  ) { }

  ngOnInit() {
    this.loadMessages();
    this.loadFilter();
    this.isWidth400OrLess();
    this.subscription = this.chatService.triggerChatReload().subscribe(() => {
      this.loadFilter();
    });
  }


  loadMessages() {
    const currentRoute = this.router.url;
    if (currentRoute.includes('private-chat')) return;
    this.messages$ = this.route.queryParams.pipe(
      map(params => params['chatId']),
      distinctUntilChanged(),
      tap(chatId => {
        if (!chatId) return
        else this.chatService.currentChatId = chatId;
      }),
      filter(chatId => !!chatId),
      switchMap(() => this.chatService.getMessages()),
      map((messages: Message[]) => this.returnNewObservable(messages, null)),
      tap(() => {
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


  loadMessageUserIdIntoObject(messages: Array<Message>) {
    messages.forEach(message => {
      this.userDataService.getUserDataObservable(message.userId)
        .pipe(take(1))
        .subscribe(userData => {
          this.messageDetailsMap[message.uniqueId] = userData;
        }
        );
    });
  }


  initializeMessageValue(content: string) {
    this.messageValue = content;
  }


  updateChatMessage(messageId: string, messageUniqueId: string) {
    this.chatService.updateChatMessage(messageId, this.messageValue, messageUniqueId);
    this.editMessageId = null;
    this.hideReactionMenu = false;
  }


  toggleChatDetails() {
    this.channelMembersService.showChatGreyScreen = !this.channelMembersService.showChatGreyScreen;
    this.chatDetails = !this.chatDetails;
  }


  openMembersInfo() {
    this.channelMembersService.showChatGreyScreen = true;
    this.showMembersInfo = true;
  }


  closeMembersInfo() {
    this.showMembersInfo = false;
    this.channelMembersService.showChatGreyScreen = false;
  }


  openAddMembersMenu() {
    if (this.showMembersInfo) {
      this.closeMembersInfo();
    }
    this.channelMembersService.showChatGreyScreen = true;
    this.channelMembersService.showAddMembersMenu = true;
  }


  closeAddMembersMenu() {
    this.channelMembersService.showAddMembersMenu = false;
    this.channelMembersService.showChatGreyScreen = false;
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
    this.subscription.unsubscribe();
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
    this.chatService.updateMessage(emoji, id, this.userDataService.currentUserId, false)
  }


  openThread(messageId: string): void {
    this.chatService.messageID = messageId;
    this.chatService.getMessageThread(messageId);
    if (this.chatService.threadClosed) {
      this.chatService.toggleDrawerState();
      this.chatService.threadClosed = false;
    }
    this.chatService.showThreadWhenResponsive = true;
  }


  @HostListener('window:resize', [])
  isWidth400OrLess() {
    if (window.innerWidth <= 400) {
      this.isMobile = true;
    } else {
      this.isMobile = false;
    }
  }
}