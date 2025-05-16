import {
  Component,
  Output,
  EventEmitter,
  OnInit,
  ChangeDetectorRef,
  ViewChild,
  ElementRef,
  HostListener,
  OnDestroy,
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
import { FormsModule } from '@angular/forms';
import { FilterService } from '../../../services/component-services/filter.service';
import { SearchResultWorkspaceComponent } from "./search-result-workspace/search-result-workspace.component";
import { Observable, Subscription } from 'rxjs';
import { Channel, ChannelService } from '../../../services/firebase-services/channel.service';

@Component({
  selector: 'app-workspace-menu',
  standalone: true,
  imports: [
    CommonModule,
    MatSidenavModule,
    MatExpansionModule,
    WorkspaceStateToggleButtonComponent,
    FormsModule,
    SearchResultWorkspaceComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './workspace-menu.component.html',
  styleUrl: './workspace-menu.component.scss',
})
export class WorkspaceMenuComponent implements OnInit, OnDestroy {
  @Output() newMessage: EventEmitter<void> = new EventEmitter();
  @ViewChild('searchResults') searchResultRef!: ElementRef;
  currentChannels: string[] = [];
  showCreateChannelOverlay: boolean = false;
  workspaceUserData!: UserObserver | null;
  toggleMarginLeft: boolean = true;
  userDatas: any[] = [];
  allUsers: any[] = [];
  blur: boolean = false;
  searchInput: string = '';
  private subscription = new Subscription();
  readableChannelNames$!: Observable<Channel[]>;

  constructor(
    public userDatasService: UserDatasService,
    private channelMemberService: ChannelMemberService,
    private router: Router,
    private cd: ChangeDetectorRef,
    private chatService: ChatService,
    private filterService: FilterService,
    private channelService: ChannelService
  ) { }

  ngOnInit() {
    this.getCurrentUserData();
    this.chatService.threadClosed = false;
  }


  @HostListener('document:click', ['$event'])
  onClick(event: MouseEvent): void {
    const searchRef = this.searchResultRef.nativeElement.contains(event.target);
    if (!searchRef) {
      this.closeSearch();
    }
  }


  closeSearch() {
    this.blur = false;
    this.searchInput = '';
  }


  searchInWorkspace() {
    this.filterService.resetSearchResults();
    this.filterService.updateFilter(this.searchInput);
  }


  /**
   * Sets the current user data and fetches all the channels, direct messages, etc..
   * If the guest is logged in it only loads the main channel
   */
  getCurrentUserData() {
    this.subscription.add(this.userDatasService.currentUserData$.subscribe((userDatas) => {
      if (userDatas) {
        this.workspaceUserData = userDatas;
        this.fetchChannelData();
        this.subscribeAllMembers();
      }
    }));
  }


  /**
   * Subscribes to all members and filters the own private chat out. Checks for online status afterwards
   */
  async subscribeAllMembers() {
    await this.channelMemberService.selectAllMembers();
    this.subscription.add(this.channelMemberService.allMembersSubject$.subscribe((allUsers) => {
      this.allUsers = allUsers.filter(
        (user) => user.privateChats[0] !== this.workspaceUserData?.privateChats[0]
      );
    }));
    this.userDatasService.getOnlineUsers();
    this.cd.detectChanges();
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
   * Translates ids to readable channel names
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
  fetchChannelNames(channelIdArray: string[]) {
    this.readableChannelNames$ = this.userDatasService.getChannelsData(channelIdArray);
  }


  /**
   * If guest is not logged in opens the create channel component
   */
  openCreateChannelOverlay() {
    if (!this.userDatasService.checkIfGuestIsLoggedIn()) {
      this.channelService.isCreateChannelClosed = false;
      this.channelService.isCreateChannelOverlayVisible = true;
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
    this.chatService.currentThreadsSubject.next([]);
    this.chatService.isAlreadyFocusedOncePerLoad = false;
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
    this.chatService.currentThreadsSubject.next([]);
    if (!this.chatService.threadClosed) {
      this.chatService.threadClosed = true;
      this.chatService.toggleDrawerState();
    }
    this.chatService.isAlreadyFocusedOncePerLoad = false;
    this.showResponsiveComponents();
  }


  /**
   * Sets variables to true to make them visible for responsive needs
   */
  showResponsiveComponents() {
    this.chatService.showChatWhenResponsive = true;
    this.chatService.showAltHeader = true;
  }


  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.subscription = new Subscription();
    this.workspaceUserData = null;
  }
}
