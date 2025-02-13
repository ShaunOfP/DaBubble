import {
  Component,
  Output,
  EventEmitter,
  OnInit,
  ChangeDetectorRef,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';
import { ChangeDetectionStrategy, signal } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import {
  UserDatasService,
  UserObserver,
} from '../../../services/firebase-services/user-datas.service';
import { ChatService } from '../../../services/firebase-services/chat.service';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, Subject } from 'rxjs';
import { WorkspaceStateToggleButtonComponent } from './workspace-state-toggle-button/workspace-state-toggle-button.component';
import { ChannelMemberService } from '../../../services/firebase-services/channel-member.service';
import { AltHeaderMobileComponent } from '../alt-header-mobile/alt-header-mobile.component';

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
  currentUrl: string = ``;
  workspaceUserData!: UserObserver | null;
  toggleMarginLeft: boolean = true;
  previousChatId: string = ``;
  userDatas: any[] = [];
  allUsers: any[] = [];

  constructor(
    public userDatasService: UserDatasService,
    private chatService: ChatService,
    private channelService: ChannelMemberService,
    private router: Router,
    private route: ActivatedRoute,
    private cd: ChangeDetectorRef,
    private location: Location,
  ) {
    // this.currentUrl = window.location.href;
  }

  ngOnInit() {
    this.userDatasService.currentUserData$.subscribe((userDatas) => {
      this.workspaceUserData = userDatas;
      this.fetchUserData();
      // console.log(userDatas?.channels);
    });
    this.subscribeAllMembers();
  }

  async subscribeAllMembers() {
    await this.channelService.selectAllMembers();
    this.channelService.allMembersSubject$.subscribe((allUsers) => {
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
    this.openCreateChannel.emit();
  }

  openNewMessage() {
    this.route.queryParams.subscribe((params) => {
      const userID = params['userID'];
      this.router.navigate(['/general/new-message'], {
        queryParams: { userID: userID },
      });
    });
  }

  readonly channelOpenState = signal(false);
  readonly messagesOpenState = signal(false);

  modifyUrlWithChatString(channelId: string) {
    this.router.navigate(['/general/public-chat'], {
      queryParams: { chatId: channelId },
      queryParamsHandling: 'merge',
      replaceUrl: true
    });
  }


  openDirectMessage(userId: string) {
      this.router.navigate(['/general/private-chat'], {
      queryParams: { chatId: userId },
      queryParamsHandling: 'merge',
      replaceUrl: true
    });
  }
}
