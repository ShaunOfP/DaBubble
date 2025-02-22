import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { UserDatasService } from '../../../../../services/firebase-services/user-datas.service';
import { CommonModule } from '@angular/common';
import { PublicChatComponent } from '../public-chat.component';
import { UserInfoCardComponent } from "../../user-info-card/user-info-card.component";
import { ChatComponent } from '../../chat.component';

@Component({
  selector: 'app-channel-members',
  standalone: true,
  imports: [CommonModule, UserInfoCardComponent],
  templateUrl: './channel-members.component.html',
  styleUrl: './channel-members.component.scss'
})
export class ChannelMembersComponent implements OnInit {
  @Output() closeMe: EventEmitter<void> = new EventEmitter();
  @Output() openAddMembers: EventEmitter<void> = new EventEmitter();
  allUsers: any = [];
  currentUserId: string = '';
  showUserInfoCard: boolean = false;

  constructor(
    public userDataService: UserDatasService,
    private publicChatComponent: PublicChatComponent,
    private chatComponent: ChatComponent
  ) {

  }


  ngOnInit() {
    this.userDataService.getCurrentUserId();
    this.currentUserId = this.userDataService.currentUserId;
    this.addMembersToComponent();
  }


  /**
   * Adds the Members to the Component List
   */
  addMembersToComponent() {
    this.publicChatComponent.currentChannelData.users.forEach((userId: string) => {
      this.userDataService.getSingleUserData(userId)
        .then(result => {
          this.allUsers.push(result);
        });
    });
  }


  /**
   * Emits a signal to the parent component to open the Add Members Menu
   */
  openAddMembersMenu() {
    if (!this.userDataService.checkIfGuestIsLoggedIn()) {
      this.openAddMembers.emit();
    } else {
      console.warn("Log in to add Members to a Public Channel");
    }
  }


  /**
   * Fetches the data of the selected User and opens the UserInfoCard for that user
   */
  openProfileInfoCard(userId: string) {
    this.chatComponent.getUserDataFromSingleMemberOfPublicChat(userId);
    this.userDataService.showUserInfoCard = true;
  }


  /**
   * Emits a signal to the parent component to close the Channel Members Menu
   */
  closeChannelMembersMenu() {
    this.closeMe.emit();
  }
}
