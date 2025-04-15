import {
  Component,
  Output,
  EventEmitter,
  OnInit,
  ChangeDetectorRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';
import { ChangeDetectionStrategy, signal } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import {
  UserDatasService,
  UserObserver,
} from '../../../services/firebase-services/user-datas.service';
import { Router } from '@angular/router';
import { WorkspaceStateToggleButtonComponent } from './workspace-state-toggle-button/workspace-state-toggle-button.component';
import { ChannelMemberService } from '../../../services/firebase-services/channel-member.service';
import { ChatService } from '../../../services/firebase-services/chat.service';

@Component({
  selector: 'app-workspace-menu',
  standalone: true,
  imports: [
    CommonModule,
    MatSidenavModule,
    MatExpansionModule,
    WorkspaceStateToggleButtonComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './workspace-menu.component.html',
  styleUrl: './workspace-menu.component.scss',
})
export class WorkspaceMenuComponent implements OnInit {
  @Output() openCreateChannel: EventEmitter<void> = new EventEmitter();
  @Output() newMessage: EventEmitter<void> = new EventEmitter();
  currentChannels: string[] = [];
  readableChannels: any[] = [];
  showCreateChannelOverlay: boolean = false;
  workspaceUserData!: UserObserver | null;
  toggleMarginLeft: boolean = true;
  userDatas: any[] = [];
  allUsers: any[] = [];

  constructor(
    public userDatasService: UserDatasService,
    private channelMemberService: ChannelMemberService,
    private router: Router,
    private cd: ChangeDetectorRef,
    private chatService: ChatService
  ) { }

  ngOnInit() {
    this.getCurrentUserData();
  }


  /**
   * Sets the current user data and fetches all the channels, direct messages, etc..
   * If the guest is logged in it only loads the main channel
   */
  getCurrentUserData() {
    this.userDatasService.currentUserData$.subscribe((userDatas) => {
      this.workspaceUserData = userDatas;
      if (!this.userDatasService.checkIfGuestIsLoggedIn()) {
        this.fetchChannelData();
        this.subscribeAllMembers();
      } else {
        this.fetchChannelNames(['ER84UOYc0F2jptDjWxFo']);
      }
    });
  }


  /**
   * Subscribes to all members and filters the own private chat out. Checks for online status afterwards
   */
  async subscribeAllMembers() {
    await this.channelMemberService.selectAllMembers();
    this.channelMemberService.allMembersSubject$.subscribe((allUsers) => {
      this.allUsers = allUsers.filter(
        (user) => user.privateChats[0] !== this.workspaceUserData?.privateChats[0]
      );
    });
    this.userDatasService.getOnlineUsers();
  }


  /**
   * Toggles the left margin when a specific condition is met
   */
  toggleMargin() {
    this.toggleMarginLeft
      ? (this.toggleMarginLeft = false)
      : (this.toggleMarginLeft = true);
  }


  /**
   * Fetches the current channels for the logged in user
   */
  fetchChannelData(): void {
    try {
      if (this.workspaceUserData) {
        this.fetchChannelNames(this.workspaceUserData.channels);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  }


  /**
   * Fetches the current channel ids and converts them to readable names
   * @param channelIdArray array with channel ids
   */
  async fetchChannelNames(channelIdArray: string[]): Promise<void> {
    let array: any[] = [];
    for (const channelId of channelIdArray) {
      await this.userDatasService.getChannelNames(channelId).then((result) => {
        if (result) {
          array.push(result);
        }
      });
    }
    this.readableChannels = array;
    this.cd.detectChanges();
  }


  /**
   * If guest is not logged in opens the create channel component
   */
  openCreateChannelOverlay() {
    if (!this.userDatasService.checkIfGuestIsLoggedIn()) {
      this.openCreateChannel.emit();
    } else {
      console.warn('Log in to create Channels');
    }
  }


  /**
   * If guest is not logged in opens the new message component
   */
  openNewMessage() {
    if (!this.userDatasService.checkIfGuestIsLoggedIn()) {
      this.router.navigate(['/general/new-message'], {
        queryParamsHandling: 'merge',
        replaceUrl: true,
      });

      this.showResponsiveComponents();
    } else {
      console.warn('Log in to send Private Messages');
    }
  }

  readonly channelOpenState = signal(false);
  readonly messagesOpenState = signal(false);


  /**
   * Opens the public chat with the provided channel id
   * @param channelId Id of the channel that should be displayed
   */
  openPublicChatViaId(channelId: string) {
    this.router.navigate(['/general/public-chat'], {
      queryParams: { chatId: channelId },
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });

    this.showResponsiveComponents();
  }


  /**
   * Opens the direct message with the user of the provided id
   * @param userId Id of the user
   */
  async openDirectMessage(userId: string) {
    const privateChatId = await this.userDatasService.getPrivateChannel(userId);
    this.router.navigate(['/general/private-chat'], {
      queryParams: { chatId: privateChatId },
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });

    this.showResponsiveComponents();
  }


  /**
   * Sets variables to true to make them visible for responsive needs
   */
  showResponsiveComponents() {
    this.chatService.showChatWhenResponsive = true;
    this.chatService.showAltHeader = true;
  }
}
