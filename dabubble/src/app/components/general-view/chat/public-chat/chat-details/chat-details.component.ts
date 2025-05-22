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
  currentChannelOwner: string = '';
  currentChannelData: any;
  newDescriptionInput: string = '';
  newChannelNameInput: string = '';
  showChannelName: boolean = true;
  showNewChannelNameForm: boolean = false;
  descriptionContainerVisible: boolean = true;
  newDescriptionContainerVisible: boolean = false;
  currentUserIdForLeaveChannel: string = ``;

  constructor(
    public chatService: ChatService,
    public publicChat: PublicChatComponent,
    public userDataService: UserDatasService,
    private channelMemberService: ChannelMemberService,
    private router: Router
  ) { }


  ngOnInit() {
    if (this.chatService.currentChannelData?.owner) {
      this.getNameOfChannelOwner(this.chatService.currentChannelData?.owner).then(name => {
        this.currentChannelOwner = name;
      });
    }
  }


  /**
   * Converts the Owner-Id to the Owner-Name aka readable Name (also removes the double quotes from the Owners name)
   * @param ownerId A string from the Database field "owner" containing the User-Id of the Channel-Owner
   * @returns The name of the Owner rather than the ID (as a string)
   */
  async getNameOfChannelOwner(ownerId: string) {
    if (ownerId != "DABubble385-Team") {
      const ownerName = await this.userDataService.getUserName(ownerId);
      return ownerName;
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
    this.toggleNewChannelNameInputVisibility();
    this.toggleChannelNameContainerVisibility();
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
    this.toggleChannelDescriptionVisibility();
    this.toggleNewChannelDescriptionVisibility();
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
    let currentChannelData = this.chatService.currentChannelData;
    this.userDataService.getCurrentUserId();
    if (this.userDataService.checkIfGuestIsLoggedIn()) {
      this.currentUserIdForLeaveChannel = `guest`
    } else {
      this.currentUserIdForLeaveChannel = this.userDataService.currentUserId;
    }
    if (currentChannelData?.channelName != "Entwicklerchannel" && currentChannelData != undefined) {
      this.channelMemberService.removeCurrentUserFromChannel(this.currentUserIdForLeaveChannel, currentChannelData);
      this.userDataService.getCurrentUserData().then((result: any) => {
        this.userDataService.removeChannelFromUserData(result['channels'], currentChannelData.channelId);
      });
      this.closeChatDetails();
      this.chatService.cleanChannelSubscription();
      this.goBackToMainChannel();
      this.closeThread();
      this.chatService.showAltHeader = false;
      this.chatService.showChatDetailsMobileGreyLayer = false;
      this.chatService.showChatWhenResponsive = false;
      this.chatService.showThreadWhenResponsive = false;
    } else {
      // console.warn("Entwicklerchannel kann nicht verlassen werden");
    }
  }


  closeThread() {
    this.chatService.threadClosed = true;
    this.chatService.currentThreadsSubject.next([]);
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