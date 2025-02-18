import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { UserDatasService } from '../../../../../services/firebase-services/user-datas.service';
import { CommonModule } from '@angular/common';
import { ChannelService } from '../../../../../services/firebase-services/channel.service';
import { ChannelMemberService } from '../../../../../services/firebase-services/channel-member.service';

@Component({
  selector: 'app-channel-members',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './channel-members.component.html',
  styleUrl: './channel-members.component.scss'
})
export class ChannelMembersComponent implements OnInit {
  @Output() closeMe: EventEmitter<void> = new EventEmitter();
  @Output() openAddMembers: EventEmitter<void> = new EventEmitter();
  currentUserData: any = '';
  allUsers: any = '';

  constructor(public userDataService: UserDatasService, private channelMemberService: ChannelMemberService) {

  }


  ngOnInit() {
    this.userDataService.currentUserData$.subscribe((userDatas) => {
      this.currentUserData = userDatas;
      this.subscribeAllMembers();
    });
  }


  //Wenn user id im channel dann sollen die hier angezeigt werden
  async subscribeAllMembers() {
    await this.channelMemberService.selectAllMembers();
    this.channelMemberService.allMembersSubject$.subscribe((allUsers) => {
      this.allUsers = allUsers.filter(
        (user) => user.privateChats[0] !== this.currentUserData?.privateChats[0]
      );
    });
  }


  /**
   * Emits a signal to the parent component to open the Add Members Menu
   */
  openAddMembersMenu() {
    this.openAddMembers.emit();
  }


  /**
   * 
   */
  openProfileInfo() {
    //Öffnen des Profilinfo Containers, wenn nicht die eigenen Member Card
  }


  /**
   * Emits a signal to the parent component to close the Channel Members Menu
   */
  closeChannelMembersMenu() {
    this.closeMe.emit();
  }
}
