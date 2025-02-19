import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { UserDatasService } from '../../../../../services/firebase-services/user-datas.service';
import { CommonModule } from '@angular/common';
import { ChannelMemberService, Member } from '../../../../../services/firebase-services/channel-member.service';
import { PublicChatComponent } from '../public-chat.component';

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

  constructor(
    public userDataService: UserDatasService,
    private channelMemberService: ChannelMemberService,
    private publicChatComponent: PublicChatComponent,
  ) {

  }


  ngOnInit() {
    this.userDataService.currentUserData$.subscribe((userDatas) => { //hier subscribe nötig?
      this.currentUserData = userDatas;
      // this.addMembers();
    });
    // this.addMembers();
  }


  addMembers() {
    this.publicChatComponent.currentChannelData.users.forEach((member: Member) => {
      this.channelMemberService.selectMember(member);
      console.log(member);
      // sind im selectedMembersSubject im channel-member.service
    });
    // this.channelMemberService.selectedMembers$.subscribe((members) => {
    //   console.log(members);
    // });
    // console.log(this.channelMemberService.selectedMembers$);
    // add-members-to-new-channel-component app-all-selected-members angucken
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
