import {
  Component,
  Output,
  EventEmitter,
  OnInit,
  ChangeDetectorRef,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { ChangeDetectionStrategy, signal } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { CommonModule, Location } from '@angular/common';
import { UserDatasService, UserObserver } from '../../../services/firebase-services/user-datas.service';
import { ChatService } from '../../../services/firebase-services/chat.service';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, Subject } from 'rxjs';
import { WorkspaceStateToggleButtonComponent } from "./workspace-state-toggle-button/workspace-state-toggle-button.component";

@Component({
  selector: 'app-workspace-menu',
  standalone: true,
  imports: [MatSidenavModule, MatExpansionModule, CommonModule, WorkspaceStateToggleButtonComponent],
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

  constructor(
    public userDatasService: UserDatasService,
    private chatService: ChatService,
    private router: Router,
    private route: ActivatedRoute,
    private cd: ChangeDetectorRef,
    private location: Location
  ) {
    // this.currentUrl = window.location.href;
  }


  ngOnInit() {
    this.userDatasService.currentUserData$.subscribe((userDatas) => {
      this.workspaceUserData = userDatas;
      this.fetchUserData();
      // console.log(userDatas?.channels);      
    });
  }


  toggleMargin() {
    this.toggleMarginLeft ? this.toggleMarginLeft = false : this.toggleMarginLeft = true;
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
    this.currentUrl = window.location.href;
    if (this.currentUrl.includes('chatID')) {
      if (this.previousChatId != ``) {
        this.currentUrl = this.currentUrl.replace(`%2FchatID=${this.previousChatId}`, "");
      }
    }
    let newUrl = `${this.currentUrl}%2FchatID=${channelId}`;
    this.location.replaceState(this.fixDuplicateUrl(newUrl));
    this.previousChatId = channelId;
  }


  fixDuplicateUrl(url: string): string {
    const currentHost = window.location.origin;
    if (url.startsWith(currentHost + "/")) {
      return url.replace(currentHost + "/", "");
    }
    return url;
  }


  openDirectMessage(userId: string) {
    //implement logic to open a message
  }
}
