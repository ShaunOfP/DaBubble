import { Component, Output, EventEmitter, OnInit, ChangeDetectorRef } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { ChangeDetectionStrategy, signal } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { CommonModule } from '@angular/common';
import { UserDatasService } from '../../../services/firebase-services/user-datas.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-workspace-menu',
  standalone: true,
  imports: [MatSidenavModule, MatExpansionModule, CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './workspace-menu.component.html',
  styleUrl: './workspace-menu.component.scss'
})
export class WorkspaceMenuComponent implements OnInit {
  @Output() openCreateChannel: EventEmitter<void> = new EventEmitter();
  @Output() newMessage: EventEmitter<void> = new EventEmitter();
  currentChannels: string[] = [];
  currentUserId: string = ``;
  readableChannels: any[] = [];
  showCreateChannelOverlay: boolean = false;

  constructor(public userDatasService: UserDatasService, private route: ActivatedRoute, private cd: ChangeDetectorRef) {

  }

  async ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const userID = params['userID'];
      if (userID) {
        this.currentUserId = userID;
      }
      else {
        console.error('No user ID provided');
      }
    });
    await this.fetchUserData(this.currentUserId);
  }


  async fetchUserData(userID: string): Promise<void> {
    try {
      const userData = await this.userDatasService.getUserDataById(userID);
      if (userData) {
        this.fetchChannelNames(userData.channels);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  }


  async fetchChannelNames(channelIdArray: string[]): Promise<void> {
    let array: any[] = [];
    for (const channelId of channelIdArray) {
      await this.userDatasService.getChannelNames(channelId).then(result => {
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
    this.newMessage.emit();
  }

  readonly channelOpenState = signal(false);
  readonly messagesOpenState = signal(false);
}
