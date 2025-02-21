import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { UserDatasService } from '../../../../../services/firebase-services/user-datas.service';
import { CommonModule } from '@angular/common';
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
  allUsers: any = [];
  currentUserId: string = '';

  constructor(
    public userDataService: UserDatasService,
    private publicChatComponent: PublicChatComponent,
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
      console.log(userId);
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
