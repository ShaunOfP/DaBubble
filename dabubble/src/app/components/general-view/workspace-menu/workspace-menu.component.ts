import { Component, Output, EventEmitter, OnInit } from '@angular/core';
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
  @Output() callParent: EventEmitter<void> = new EventEmitter();
  @Output() newMessage: EventEmitter<void> = new EventEmitter();
  currentChannels: string[] | undefined = [];
  currentUserId: string = ``;

  constructor(public userDatasService: UserDatasService, private route: ActivatedRoute) {

  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const userID = params['userID'];
      if (userID) {
        this.fetchUserData(userID);
        this.currentUserId = userID;
      }
      else {
        console.error('No user ID provided');
      }
    });
    console.log(this.currentChannels);
  }


  async fetchUserData(userID: string): Promise<void> {
    try {
      const userData = await this.userDatasService.getUserDataById(userID);
      this.currentChannels = userData?.channels
      // this.currentChannels.push(userData?.channels);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  }


  openCreateChannelOverlay() {
    this.callParent.emit();
  }

  openNewMessage() {
    this.newMessage.emit();
  }

  readonly channelOpenState = signal(false);
  readonly messagesOpenState = signal(false);
}
