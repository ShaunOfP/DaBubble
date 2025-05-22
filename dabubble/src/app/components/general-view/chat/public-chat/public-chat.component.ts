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
import { Observable, distinctUntilChanged, filter, map, switchMap, take, tap } from 'rxjs';
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

  public messages$!: Observable<any[]>;
  public newMessage: boolean = false;
  public hoveredMessageId: string | null = null;
  public chatDetails: boolean = false;
  public showMembersInfo: boolean = false;
  public showPicker: boolean = false;
  public showEditMessage: boolean = false;
  public editMessageId: string | null = null;
  public messageValue: string = '';
  public isMobile: boolean = false;
  public messageDetailsMap: { [id: string]: any } = {};
  public showMobilePicker: boolean = false;

  private scrollListener!: () => void;
  private initialLoadCompleteForCurrentChat: boolean = false;

  /**
   * Constructor for the PublicChatComponent.
   * @param {ChatService} chatService Service for chat-related operations.
   * @param {ActivatedRoute} route Service for accessing route parameters.
   * @param {UserDatasService} userDataService Service for fetching user data.
   * @param {Router} router Service for navigation.
   * @param {ChannelMemberService} channelMembersService Service for managing channel members and UI state.
   */
  constructor(
    public chatService: ChatService,
    private route: ActivatedRoute,
    private userDataService: UserDatasService,
    private router: Router,
    public channelMembersService: ChannelMemberService
  ) { }

  /**
   * Lifecycle hook called when the component is initialized.
   * Cleans up existing channel subscriptions, determines the current chat ID,
   * loads messages, and checks the window width.
   */
  ngOnInit(): void {
    this.chatService.cleanChannelSubscription();
    this.chatService.getCurrentChatId();
    this.loadMessages();
    this.isWidth400OrLess();
  }

  /**
   * Sets the status for displaying the mobile emoji picker.
   * @param {boolean} status True to show the picker, false otherwise.
   */
  public setMobilePicker(status: boolean): void {
    this.showMobilePicker = status;
  }

  /**
   * Sets the ID of the message currently being edited.
   * @param {string} messageId The unique ID of the message to be edited.
   */
  public setEditId(messageId: string): void {
    this.editMessageId = messageId;
  }

  /**
   * Loads chat messages based on the `chatId` from the route parameters.
   * Messages are transformed to include user details and date display logic.
   * Manages the `newMessage` flag to indicate newly arrived messages after initial load.
   * Automatically scrolls to new messages or to the bottom on initial load.
   */
  public loadMessages(): void {
    const currentRoute = this.router.url;
    if (currentRoute.includes('private-chat')) {
      return;
    }

    this.messages$ = this.route.queryParams.pipe(
      map(params => params['chatId']),
      distinctUntilChanged(),
      tap(chatId => {
        if (chatId) {
          this.chatService.currentChatId = chatId;
          this.initialLoadCompleteForCurrentChat = false;
          this.newMessage = false;
        }
      }),
      filter(chatId => !!chatId),
      switchMap(() => this.chatService.getMessages()),
      tap((messages: Message[]) => {
        this.loadMessageUserIdIntoObject(messages);
      }),
      map((messages: Message[]) => this.returnNewObservable(messages)),
      tap(() => {
        if (!this.initialLoadCompleteForCurrentChat) {
          setTimeout(() => {
            this.scrollToElement('auto');
          }, 500);

          this.initialLoadCompleteForCurrentChat = true;
        } else {
          this.newMessage = true;
          this.scrollToElement('auto');
        }
      })
    );
  }

  /**
   * Transforms an array of messages to include display-related metadata for dates.
   * This method maps over a list of messages and determines whether the date
   * of each message should be displayed. It compares the current message's date
   * with the last seen date to decide if a new date separator is needed.
   * @param {Message[]} messages - An array of messages to process.
   * @returns {Array<object>} - A new array of messages, each with added properties:
   * - `showDate` (boolean): Whether to display the date for this message.
   * - `formattedDate` (string | null): The formatted date to display if `showDate` is true.
   */
  private returnNewObservable(messages: Message[]): any[] {
    let lastDisplayedDate: string | null = null;
    return messages.map((message) => {
      const messageDateStr = message.createdAt ? new Date(message.createdAt).toLocaleDateString(
        'de-DE', { day: '2-digit', month: '2-digit', year: '2-digit' }
      ) : null;

      const shouldShowDate = messageDateStr && messageDateStr !== lastDisplayedDate;
      if (shouldShowDate) {
        lastDisplayedDate = messageDateStr;
      }
      return {
        ...message,
        showDate: !!shouldShowDate,
        formattedDate: shouldShowDate ? messageDateStr : null,
      };
    });
  }

  /**
   * Loads user details for each message in an array if they haven't been loaded yet.
   * Stores the fetched user data in `messageDetailsMap`.
   * @param {Message[]} messages An array of messages for which user details should be loaded.
   */
  private loadMessageUserIdIntoObject(messages: Message[]): void {
    messages.forEach(message => {
      if (message.uniqueId && !this.messageDetailsMap[message.uniqueId]) {
        this.userDataService.getUserDataObservable(message.userId)
          .pipe(take(1))
          .subscribe(userData => {
            if (userData) {
              this.messageDetailsMap[message.uniqueId] = userData;
            }
          });
      }
    });
  }

  /**
   * Initializes the value of the message input field with the content of an existing message.
   * @param {string} content The content of the message to be edited.
   */
  public initializeMessageValue(content: string): void {
    this.messageValue = content;
  }

  /**
   * Updates an existing chat message with new content.
   * @param {string} messageId The Firebase message ID (often the document key).
   * @param {string} messageUniqueId The unique ID of the message within the application.
   */
  public updateChatMessage(messageId: string, messageUniqueId: string): void {
    if (this.messageValue.trim() === '') return;
    this.chatService.updateChatMessage(messageId, this.messageValue, messageUniqueId);
    this.editMessageId = null;
    this.messageValue = '';
  }

  /**
   * Toggles the visibility of the chat details view.
   * Also manages the state of an overlaying grey screen.
   */
  public toggleChatDetails(): void {
    this.channelMembersService.showChatGreyScreen = !this.channelMembersService.showChatGreyScreen;
    this.chatDetails = !this.chatDetails;
  }

  /**
   * Opens the view with information about channel members.
   * Activates the overlaying grey screen.
   */
  public openMembersInfo(): void {
    this.channelMembersService.showChatGreyScreen = true;
    this.showMembersInfo = true;
  }

  /**
   * Closes the view with information about channel members.
   * Deactivates the overlaying grey screen.
   */
  public closeMembersInfo(): void {
    this.showMembersInfo = false;
    this.channelMembersService.showChatGreyScreen = false;
  }

  /**
   * Opens the menu for adding members to the channel.
   * Closes the member info view first, if open.
   * Activates the overlaying grey screen.
   */
  public openAddMembersMenu(): void {
    if (this.showMembersInfo) {
      this.closeMembersInfo();
    }
    this.channelMembersService.showChatGreyScreen = true;
    this.channelMembersService.showAddMembersMenu = true;
  }

  /**
   * Closes the menu for adding members.
   * Deactivates the overlaying grey screen.
   */
  public closeAddMembersMenu(): void {
    this.channelMembersService.showAddMembersMenu = false;
    this.channelMembersService.showChatGreyScreen = false;
  }

  /**
   * Lifecycle hook called after the component's view children are initialized.
   * Adds a scroll listener to the chat container, if present.
   */
  ngAfterViewInit(): void {
    if (this.chatContainer?.nativeElement) {
      this.scrollListener = this.handleScroll.bind(this);
      this.chatContainer.nativeElement.addEventListener('scroll', this.scrollListener);
    }
  }

  /**
   * Lifecycle hook called immediately before the component is destroyed.
   * Removes the scroll listener and cleans up ChatService subscriptions.
   */
  ngOnDestroy(): void {
    if (this.chatContainer?.nativeElement && this.scrollListener) {
      this.chatContainer.nativeElement.removeEventListener('scroll', this.scrollListener);
    }
    this.chatService.cleanChannelSubscription();
  }

  /**
   * Scrolls the chat container to the specified element or position, typically the bottom.
   * @param {ScrollBehavior} behavior The scroll behavior ('auto' or 'smooth').
   */
  public scrollToElement(behavior: ScrollBehavior): void { // Name reverted to scrollToElement
    if (this.chatContainer?.nativeElement) {
      try {
        this.chatContainer.nativeElement.scroll({
          top: this.chatContainer.nativeElement.scrollHeight,
          left: 0,
          behavior: behavior,
        });
      } catch (error) {
        console.error("Error scrolling to element:", error);
      }
    }
  }

  /**
   * Handles the scroll event in the chat container.
   * Sets `newMessage` to false if the user has scrolled away from the absolute bottom
   * after new messages have arrived and caused a scroll.
   */
  private handleScroll(): void {
    if (this.chatContainer?.nativeElement) {
      const element = this.chatContainer.nativeElement;
      const threshold = 10;
      if (this.newMessage) {
        const isScrolledToBottom = element.scrollTop + element.clientHeight >= element.scrollHeight - threshold;
        if (!isScrolledToBottom) {
          this.newMessage = false;
        }
      }
    }
  }

  /**
   * Formats a numeric timestamp into a readable time string (HH:MM).
   * @param {number} timestamp The timestamp to format.
   * @returns {string} The formatted time string.
   */
  public formatTime(timestamp: number): string {
    if (isNaN(timestamp)) return '';
    const date = new Date(timestamp);
    return date.toLocaleTimeString('de-DE', {
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  /**
   * Checks if a message is from the currently logged-in user
   * to apply different styles.
   * @param {string} userId The user ID of the message author.
   * @returns {'secondary' | 'primary'} Returns 'secondary' if the message is from the current user, otherwise 'primary'.
   * @remarks This method subscribes to `this.route.queryParams` on each call.
   * For better performance with frequent calls (e.g., in `*ngFor`), the `currentUserId`
   * should be obtained once in `ngOnInit` or reactively. The `take(1)` here is a mitigation.
   */
  public checkStyle(userId: string): 'secondary' | 'primary' {
    let currentLoggedInUserId: string = '';
    this.route.queryParams.pipe(take(1)).subscribe((params) => {
      currentLoggedInUserId = params['userID'];
    });
    return userId === currentLoggedInUserId ? 'secondary' : 'primary';
  }

  /**
   * Sends a reaction (emoji) to a message.
   * @param {string} emoji The emoji to send as a reaction.
   * @param {string} messageId The ID of the message being reacted to.
   */
  public sendReaction(emoji: string, messageId: string): void {
    this.chatService.updateMessage(emoji, messageId, this.userDataService.currentUserId, false);
  }

  /**
   * Opens the thread area for a specific message.
   * @param {string} messageId The ID of the message for which to open the thread.
   */
  public openThread(messageId: string): void {
    this.chatService.messageID = messageId;
    this.chatService.getMessageThread(messageId);
    if (this.chatService.threadClosed) {
      this.chatService.toggleDrawerState();
      this.chatService.threadClosed = false;
    }
    this.chatService.showThreadWhenResponsive = true;
  }

  /**
   * HostListener that reacts to window resize events.
   * Sets the `isMobile` flag if the window width is 400 pixels or less.
   */
  @HostListener('window:resize', [])
  public isWidth400OrLess(): void {
    this.isMobile = window.innerWidth <= 400;
  }

  /**
   * HostListener that reacts to window resize events.
   * @returns {boolean} True if the window width is 500 pixels or less.
   * Sets `showMobilePicker` to false if the width is above 500 pixels.
   */
  @HostListener('window:resize', [])
  public isWindowBelow500(): boolean {
    const isBelow = window.innerWidth <= 500;
    if (!isBelow) {
      this.showMobilePicker = false;
    }
    return isBelow;
  }
}
