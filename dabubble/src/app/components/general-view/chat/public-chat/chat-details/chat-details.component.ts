import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { NgForm, FormsModule } from '@angular/forms';
import { ChatService } from '../../../../../services/firebase-services/chat.service';
import { PublicChatComponent } from '../public-chat.component';
import { UserDatasService } from '../../../../../services/firebase-services/user-datas.service';
import { ChannelMemberService } from '../../../../../services/firebase-services/channel-member.service';
import { Router } from '@angular/router';
import { ChannelMembersComponent } from "../channel-members/channel-members.component";

@Component({
  selector: 'app-chat-details',
  standalone: true,
  imports: [FormsModule, CommonModule, ChannelMembersComponent],
  templateUrl: './chat-details.component.html',
  styleUrl: './chat-details.component.scss'
})
export class ChatDetailsComponent {
  @Output() callParent: EventEmitter<void> = new EventEmitter();
  currentChannelId: string = '';
  currentChannelName: string = '';
  currentChannelOwner: string = '';
  currentChannelDescription: string = '';
  currentChannelData: any;
  newDescriptionInput: string = '';
  newChannelNameInput: string = '';
  showChannelName: boolean = true;
  showNewChannelNameForm: boolean = false;
  descriptionContainerVisible: boolean = true;
  newDescriptionContainerVisible: boolean = false;

  constructor(
    public chatService: ChatService,
    public publicChat: PublicChatComponent,
    public userDataService: UserDatasService,
    private channelMemberService: ChannelMemberService,
    private router: Router
  ) { }


  /**
   * Converts the Owner-Id to the Owner-Name aka readable Name (also removes the double quotes from the Owners name)
   * @param ownerId A string from the Database field "owner" containing the User-Id of the Channel-Owner
   * @returns The name of the Owner rather than the ID (as a string)
   */
  async getNameOfChannelOwner(ownerId: string) {
    if (ownerId != "DABubble385-Team") {
      const ownerName = await this.userDataService.getUserName(ownerId);
      return JSON.stringify(ownerName).replace(/^"|"$/g, '');
    } else {
      return ownerId;
    }
  }


  /**
   * Closing the Chat Details
   */
  closeChatDetails() {
    this.callParent.emit();
    this.channelMemberService.showChatGreyScreen = false;
  }


  /**
   * If Guest is not logged in it toggles Visibility of the Channel Name Input Field
   */
  openNewChannelInput() {
    if (!this.userDataService.checkIfGuestIsLoggedIn()) {
      this.toggleNewChannelNameInputVisibility();
      this.toggleChannelNameContainerVisibility();
    } else {
      console.warn("Log in to Edit the Channel Name");
    }
  }


  /**
   * Toggles visibility of Channel Name and Channel Name Edit Field
   */
  showChannelNameContainer() {
    this.toggleNewChannelNameInputVisibility();
    this.toggleChannelNameContainerVisibility();
  }


  /**
   * If Guest is not logged in it toggles Visibility of the Channel Description Input Field
   */
  openDescriptionEdit() {
    if (!this.userDataService.checkIfGuestIsLoggedIn()) {
      this.toggleChannelDescriptionVisibility();
      this.toggleNewChannelDescriptionVisibility();
    } else {
      console.warn("Log in to Edit the Channel Description");
    }
  }


  /**
   * Toggles visibility of Channel Name and Channel Description Edit Field
   */
  showChannelDescriptionContainer() {
    this.toggleNewChannelDescriptionVisibility();
    this.toggleChannelDescriptionVisibility();
  }


  /**
   * Toggles Variable for Channel Name Visibility
   */
  toggleChannelNameContainerVisibility() {
    this.showChannelName = !this.showChannelName;
  }


  /**
   * Toggles Variable for Channel Name Input Visibility
   */
  toggleNewChannelNameInputVisibility() {
    this.showNewChannelNameForm = !this.showNewChannelNameForm;
  }


  /**
   * Toggles Variable for Channel Description Visibility
   */
  toggleChannelDescriptionVisibility() {
    this.descriptionContainerVisible = !this.descriptionContainerVisible;
  }


  /**
   * Toggles Variable for Channel Description Input Visibility
   */
  toggleNewChannelDescriptionVisibility() {
    this.newDescriptionContainerVisible = !this.newDescriptionContainerVisible;
  }


  /**
   * Updates the new Channel Name to the Database
   * @param ngForm for Form Validation
   */
  submitNewName(ngForm: NgForm) {
    if (ngForm.touched && ngForm.valid) {
      if (this.chatService.currentChannelData?.channelId) {
        this.chatService.updateChatInformation(this.chatService.currentChannelData.channelId, 'channelName', this.newChannelNameInput)
          .then(() => {
            this.showChannelNameContainer();
          });
      }
    }
  }


  /**
   * Updates the new Channel Description to the Database
   * @param ngForm for Form Validation
   */
  submitNewDescription(ngForm: NgForm) {
    if (ngForm.touched && ngForm.valid) {
      if (this.chatService.currentChannelData?.channelId) {
        this.chatService.updateChatInformation(this.chatService.currentChannelData?.channelId, 'description', this.newDescriptionInput)
          .then(() => {
            this.showChannelDescriptionContainer();
          });
      }
    }
  }


  /**
   * Lets the user leave the current Channel
   */
  leaveChannel() {
    if (!this.userDataService.checkIfGuestIsLoggedIn()) {
      let currentChannelData = this.chatService.currentChannelData;
      this.userDataService.getCurrentUserId();
      let currentUserId = this.userDataService.currentUserId;
      if (currentChannelData?.channelName != "Entwicklerchannel" && currentChannelData != undefined) {
        this.channelMemberService.removeCurrentUserFromChannel(currentUserId, currentChannelData);
        this.userDataService.getCurrentUserData().then((result: any) => {
          this.userDataService.removeChannelFromUserData(result['channels'], this.currentChannelId);
        });
        this.closeChatDetails();
        this.goBackToMainChannel();
      } else {
        console.warn("Entwicklerchannel kann nicht verlassen werden");
      }
    } else {
      console.warn("Log in to Leave the Channel");
    }
  }


  /**
   * Navigates back to the Main Public Channel
   */
  goBackToMainChannel() {
    this.router.navigate(['/general/public-chat'], {
      queryParams: { chatId: 'ER84UOYc0F2jptDjWxFo' },
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
  }
}