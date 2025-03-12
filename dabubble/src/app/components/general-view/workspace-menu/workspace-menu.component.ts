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
import { ActivatedRoute, Router } from '@angular/router';
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
    private route: ActivatedRoute,
    private cd: ChangeDetectorRef,
    private chatService: ChatService
  ) { }

  ngOnInit() {
    this.userDatasService.currentUserData$.subscribe((userDatas) => {
      if (!this.userDatasService.checkIfGuestIsLoggedIn()) {
        this.workspaceUserData = userDatas;
        this.fetchUserData();
      } else {
        //Lädt nur den Entwicklerchannel wenn Gast eingeloggt ist
        this.fetchChannelNames(['ER84UOYc0F2jptDjWxFo']);
      }
    });
    if (!this.userDatasService.checkIfGuestIsLoggedIn()) {
      this.subscribeAllMembers();
    }
  }

  async subscribeAllMembers() {
    await this.channelMemberService.selectAllMembers();
    console.log(this.workspaceUserData);
    this.channelMemberService.allMembersSubject$.subscribe((allUsers) => {
      this.allUsers = allUsers.filter(
        (user) =>
          user.privateChats[0] !== this.workspaceUserData?.privateChats[0]
      );
    });
  }

  toggleMargin() {
    this.toggleMarginLeft
      ? (this.toggleMarginLeft = false)
      : (this.toggleMarginLeft = true);
  }

  fetchUserData(): void {
    try {
      if (this.workspaceUserData) {
        this.fetchChannelNames(this.workspaceUserData.channels);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  }

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

  openCreateChannelOverlay() {
    if (!this.userDatasService.checkIfGuestIsLoggedIn()) {
      this.openCreateChannel.emit();
    } else {
      console.warn('Log in to create Channels');
    }
  }

  openNewMessage() {
    if (!this.userDatasService.checkIfGuestIsLoggedIn()) {
      this.router.navigate(['/general/new-message'], {
        queryParamsHandling: 'merge',
        replaceUrl: true,
      });

      this.chatService.showChatWhenResponsive = true;
      this.chatService.showAltHeader = true;
    } else {
      console.warn('Log in to send Private Messages');
    }
  }

  readonly channelOpenState = signal(false);
  readonly messagesOpenState = signal(false);

  modifyUrlWithChatString(channelId: string) {
    this.router.navigate(['/general/public-chat'], {
      queryParams: { chatId: channelId },
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });

    this.chatService.showChatWhenResponsive = true;
    this.chatService.showAltHeader = true;
  }

  async openDirectMessage(userId: string) {
    const privateChatId = await this.userDatasService.getPrivateChannel(userId);
    this.router.navigate(['/general/private-chat'], {
      queryParams: { chatId: privateChatId },
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });

    this.chatService.showChatWhenResponsive = true;
    this.chatService.showAltHeader = true;
  }
}
