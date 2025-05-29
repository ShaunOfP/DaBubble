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
export class PrivateChatComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('chatContainer') chatContainer!: ElementRef;
  @ViewChild('messageContentSpan', { static: false }) clickabelSpan?: ElementRef;
  public messages$!: Observable<any[]>;
  public reactions$!: Observable<any[]>;
  public channelId: string = '';
  public newMessage: boolean = false;
  public hoveredMessageId: string | null = null;
  public showPicker: boolean = false;
  public showFirstMessage: boolean = true;
  public showEditMessage: boolean = false;
  public editMessageId: string | null = null;
  public messageDetailsMap: { [id: string]: any } = {};
  public messageValue: string = '';
  public isMobile: boolean = false;
  public showMobilePicker: boolean = false;

  private scrollListener!: () => void;
  private initialLoadCompleteForCurrentChat: boolean = false;

  /**
   * Constructor for the PrivateChatComponent.
   * @param {ChatService} chatService Service for chat-related operations.
   * @param {ActivatedRoute} route Service for accessing route parameters.
   * @param {ChatComponent} chatComponent Reference to the parent chat component.
   * @param {UserDatasService} userDatasService Service for fetching user data.
   * @param {Router} router Service for navigation.
   */
  constructor(
    private chatService: ChatService,
    private route: ActivatedRoute,
    public chatComponent: ChatComponent,
    public userDatasService: UserDatasService,
    private router: Router,
  ) { }

  /**
   * Lifecycle hook called when the component is initialized.
   * Loads messages and applies initial filtering.
   */
  ngOnInit(): void {
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
   * Shows the user information card.
   */
  public showMemberInfo(): void {
    this.userDatasService.showUserInfoCard = true;
  }

  /**
   * Opens the thread area for a specific private chat message.
   * @param {string} messageId The ID of the message for which to open the thread.
   */
  public openThread(messageId: string): void {
    this.chatService.messageID = messageId;
    this.chatService.getMessageThreadForPrivateChats(messageId);
    if (this.chatService.threadClosed) {
      this.chatService.toggleDrawerState();
      this.chatService.threadClosed = false;
    }
    this.chatService.showThreadWhenResponsive = true;
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
   * Initializes the value of the message input field with the content of an existing message.
   * @param {string} content The content of the message to be edited.
   */
  public initializeMessageValue(content: string): void {
    this.messageValue = content;
  }

  /**
   * Loads and filters chat messages based on the `chatId` from the route parameters.
   * Messages are transformed to include user details and date display logic.
   * Manages the `newMessage` flag and scrolling.
   */
  public loadMessages(): void {
    if (this.chatService.getCurrentRoute() === 'public') {
      return;
    }
    this.messages$ = this.route.queryParams.pipe(
      map(params => params['chatId']),
      distinctUntilChanged(),
      tap(chatId => {
        if (!chatId) {
          console.error("No chatId found in query parameters!");
        } else {
          this.chatService.currentChatId = chatId;
          this.initialLoadCompleteForCurrentChat = false;
          this.newMessage = false;
        }
      }),
      filter(chatId => !!chatId),
      switchMap(() => this.chatService.getMessages()),
      tap((messages: Message[]) => {
        this.loadMessageUserIdIntoObject(messages);
        this.modifyMessageContent(messages);
      }),
      map((messages: Message[]) => {
        return messages.filter(message =>
          message.userId === this.userDatasService.currentUserId ||
          message.userId === this.chatService.privateChatOtherUserId
        );
      }),
      map((messages: Message[]) => this.returnNewObservable(messages, null)),
      tap((updatedMessages: Message[]) => {
        if (updatedMessages.length > 0) {
          this.showFirstMessage = false;
        }
        if (!this.initialLoadCompleteForCurrentChat) {
          this.scrollToElement('auto');
          this.initialLoadCompleteForCurrentChat = true;
        } else {
          this.newMessage = true;
          this.scrollToElement('auto');
        }
      })
    );
  }


  /**
   * Iterates through all messages of the current Chat to replace substrings inside of the messages.
   * Sanitizes the returned string to allow it in the Dom
   * @param messages all messages of the currently opened chat
   */
  modifyMessageContent(messages: Message[]) {
    messages.forEach(message => {
      message.content = this.replaceUserName(message);
    });
  }


  /**
   * Modifies the message content so that it can be clicked in the chat
   * @param messageData data of the message
   * @returns a modified version of the message content
   */
  replaceUserName(messageData: Message) {
    let messageContent = messageData.content;
    if (messageData.taggedUsers.type === `public`) {
      return messageContent.replace(`#${messageData.taggedUsers.name}`, '');
    } else {
      return messageContent.replace(`@${messageData.taggedUsers.name}`, '');
    }
  }


  /**
   * Opens the correct channel via the provided data
   * @param id Either userId or ChannelId
   * @param type private or public
   */
  async goToId(id: string, type: string) {
    if (type === 'public') {
      this.router.navigate(['/general/public-chat'], {
        queryParams: { chatId: id },
        queryParamsHandling: 'merge',
        replaceUrl: true,
      });
    } else {
      const privateChatId = await this.userDatasService.getPrivateChannel(id);
      this.router.navigate(['/general/private-chat'], {
        queryParams: { chatId: privateChatId },
        queryParamsHandling: 'merge',
        replaceUrl: true,
      });
    }
  }


  /**
   * Loads user details for each message in an array if they haven't been loaded yet.
   * Stores the fetched user data in `messageDetailsMap`.
   * @param {Message[]} messages An array of messages for which user details should be loaded.
   */
  public loadMessageUserIdIntoObject(messages: Array<Message>): void {
    messages.forEach(message => {
      if (message.uniqueId && !this.messageDetailsMap[message.uniqueId]) {
        this.userDatasService.getUserDataObservable(message.userId)
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
   * Sends a reaction (emoji) to a message.
   * @param {string} emoji The emoji to send as a reaction.
   * @param {string} id The ID of the message being reacted to.
   */
  public sendReaction(emoji: string, id: string): void {
    this.chatService.updateMessage(emoji, id, this.userDatasService.currentUserId, false);
  }


  /**
   * Transforms message reactions into an array of objects with emoji and count.
   * @param {Message} message The message object containing reactions.
   * @returns {{ emoji: string, count: number }[]} An array of reaction entries.
   */
  public reactionEntries(message: Message): { emoji: string, count: number }[] {
    return Object.entries(message.reaction || {}).map(([emoji, users]) => ({
      emoji,
      count: (users as string[]).length
    }));
  }

  /**
   * Lifecycle hook called after the component's view children are initialized.
   * Adds a scroll listener to the chat container, if present.
   */
  ngAfterViewInit(): void {
    if (this.chatContainer?.nativeElement) {
      this.scrollListener = this.onScroll.bind(this);
      this.chatContainer.nativeElement.addEventListener('scroll', this.scrollListener);
    }
  }

  /**
   * Lifecycle hook called immediately before the component is destroyed.
   * Removes the scroll listener.
   */
  ngOnDestroy(): void {
    if (this.chatContainer?.nativeElement && this.scrollListener) {
      this.chatContainer.nativeElement.removeEventListener('scroll', this.scrollListener);
    }
  }

  /**
   * Scrolls the chat container to the specified element or position, typically the bottom.
   * @param {ScrollBehavior | string} behavior The scroll behavior ('auto' or 'smooth').
   */
  public scrollToElement(behavior: ScrollBehavior | string): void {
    if (this.chatContainer?.nativeElement) {
      try {
        this.chatContainer.nativeElement.scroll({
          top: this.chatContainer.nativeElement.scrollHeight,
          left: 0,
          behavior: behavior as ScrollBehavior,
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
  public onScroll(): void {
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
   * Transforms an array of messages to include display-related metadata for dates.
   * This method maps over a list of messages and determines whether the date
   * of each message should be displayed. It compares the current message's date
   * with the last seen date to decide if a new date separator is needed.
   * @param {Message[]} messages - An array of messages to process.
   * @param {string | null} initialLastDate - The last displayed date in 'dd.mm.yy' format or null if none (for the start of this batch).
   * @returns {Array<object>} - A new array of messages, each with added properties:
   * - `showDate` (boolean): Whether to display the date for this message.
   * - `formattedDate` (string | null): The formatted date to display if `showDate` is true.
   */
  public returnNewObservable(messages: Message[], initialLastDate: string | null): any[] {
    let lastDate = initialLastDate;
    return messages.map((message) => {
      const currentDate = message.createdAt ? new Date(message.createdAt).toLocaleDateString(
        'de-DE',
        {
          day: '2-digit',
          month: '2-digit',
          year: '2-digit',
        }
      ) : null;
      const showDate = currentDate && currentDate !== lastDate;
      if (showDate) {
        lastDate = currentDate;
      }
      return {
        ...message,
        showDate: !!showDate,
        formattedDate: showDate ? currentDate : null,
      };
    });
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
   * Checks if a message is from the currently logged-in user to apply different styles.
   * @param {string} userId The user ID of the message author.
   * @returns {'secondary' | 'primary'} Returns 'secondary' if the message is from the current user, otherwise 'primary'.
   * @remarks This method subscribes to `this.route.queryParams` on each call.
   * For better performance with frequent calls (e.g., in `*ngFor`), the `currentUserId`
   * should be obtained once in `ngOnInit` or reactively. The `take(1)` here is a mitigation.
   */
  public checkStyle(userId: string): 'secondary' | 'primary' {
    let currentUser: string = '';
    // Consider moving currentUser logic to ngOnInit if userID from params doesn't change frequently during component lifecycle
    this.route.queryParams.pipe(take(1)).subscribe((params) => {
      currentUser = params['userID'];
    });
    return userId === currentUser ? 'secondary' : 'primary';
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
