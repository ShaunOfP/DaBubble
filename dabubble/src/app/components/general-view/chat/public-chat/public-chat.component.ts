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
import { Observable, Subscription, distinctUntilChanged, filter, map, switchMap, take, tap } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Message } from '../../../../models/interfaces';
import { ActivatedRoute, Router } from '@angular/router';
import { ChannelMembersComponent } from './channel-members/channel-members.component';
import { AddMembersComponent } from './add-members/add-members.component';
import { ChatDetailsComponent } from './chat-details/chat-details.component';
import { FormsModule } from '@angular/forms';
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
  messages$!: Observable<any[]>;
  newMessage: boolean = false;
  hoveredMessageId: string | null = null;
  chatDetails: boolean = false;
  showMembersInfo: boolean = false;
  showPicker: boolean = false;
  showEditMessage: boolean = false;
  editMessageId: string | null = null;
  messageValue: string = '';
  isMobile: boolean = false;
  messageDetailsMap: { [id: string]: any } = {};
  showMobilePicker: boolean = false;

  private scrollListener!: () => void;

  constructor(
    public chatService: ChatService,
    private route: ActivatedRoute,
    private userDataService: UserDatasService,
    private router: Router,
    public channelMembersService: ChannelMemberService
  ) { }

  ngOnInit() {
    this.chatService.cleanChannelSubscription();
    this.chatService.getCurrentChatId();
    this.loadMessages(); 
    this.isWidth400OrLess();
  }

  setMobilePicker(boolean: boolean) {
    this.showMobilePicker = boolean;
    console.log(this.showMobilePicker);
  }

  setEditId(messageId: string) {
    this.editMessageId = messageId;
  }

  loadMessages() { 
    const currentRoute = this.router.url;
    if (currentRoute.includes('private-chat')) return;

    this.messages$ = this.route.queryParams.pipe(
      map(params => params['chatId']),
      distinctUntilChanged(),
      tap(chatId => {
        if (!chatId) return;
        this.chatService.currentChatId = chatId;
      }),
      filter(chatId => !!chatId),
      switchMap(() => this.chatService.getMessages()),
      tap((messages: Message[]) => { 
        this.loadMessageUserIdIntoObject(messages);
      }),
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
  * - `showDate` (boolean): Whether to display the date for this message.
  * - `formattedDate` (string | null): The formatted date to display if `showDate` is true.
  */
  returnNewObservable(messages: Message[], lastDate: string | null) {
    let currentLastDate = lastDate;
    return messages.map((message) => {
      const messageDate = message.createdAt ? new Date(message.createdAt).toLocaleDateString(
        'de-DE',
        {
          day: '2-digit',
          month: '2-digit',
          year: '2-digit',
        }
      ) : null;

      const showDate = messageDate && messageDate !== currentLastDate;
      if (showDate) {
        currentLastDate = messageDate;
      }
      return {
        ...message,
        showDate: !!showDate,
        formattedDate: showDate ? messageDate : null,
      };
    });
  }

  loadMessageUserIdIntoObject(messages: Array<Message>) {
    messages.forEach(message => {
      if (message.uniqueId && !this.messageDetailsMap[message.uniqueId]) {
        this.userDataService.getUserDataObservable(message.userId)
          .pipe(take(1))
          .subscribe(userData => {
            this.messageDetailsMap[message.uniqueId] = userData;
          });
      }
    });
  }

  initializeMessageValue(content: string) {
    this.messageValue = content;
  }

  updateChatMessage(messageId: string, messageUniqueId: string) {
    this.chatService.updateChatMessage(messageId, this.messageValue, messageUniqueId);
    this.editMessageId = null;
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
    this.chatService.cleanChannelSubscription();
  }

  scrollToElement(behavior: ScrollBehavior): void {
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
    this.route.queryParams.pipe(take(1)).subscribe((params) => {
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
    this.isMobile = window.innerWidth <= 400;
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