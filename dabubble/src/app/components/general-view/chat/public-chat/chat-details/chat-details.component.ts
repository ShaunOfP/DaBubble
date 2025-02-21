import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { NgForm, FormsModule } from '@angular/forms';
import { ChatService } from '../../../../../services/firebase-services/chat.service';
import { PublicChatComponent } from '../public-chat.component';
import { UserDatasService } from '../../../../../services/firebase-services/user-datas.service';
import { ChannelMemberService, Member } from '../../../../../services/firebase-services/channel-member.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-chat-details',
  standalone: true,
  imports: [FormsModule, CommonModule],
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
    private chatService: ChatService,
    public publicChat: PublicChatComponent,
    public userDataService: UserDatasService,
    private channelMemberService: ChannelMemberService,
    private router: Router
  ) {

  }


  /**
   * Assigns the correct Values to the matching Variables when initialized
   */
  async ngOnInit() {
    this.currentChannelId = this.publicChat.currentChannelData['channelId'];
    this.currentChannelName = this.publicChat.currentChannelData['channelName'];
    this.currentChannelOwner = await this.getNameOfChannelOwner(this.publicChat.currentChannelData['owner']);
    this.currentChannelDescription = this.publicChat.currentChannelData['description'];
  }


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


  closeChatDetails() {
    this.callParent.emit();
  }

  openNewChannelInput() {
    if (!this.userDataService.checkIfGuestIsLoggedIn()) {
      this.toggleNewChannelNameInputVisibility();
      this.toggleChannelNameContainerVisibility();
    } else {
      console.warn("Log in to Edit the Channel Name");
    }
  }

  showChannelNameContainer() {
    this.toggleNewChannelNameInputVisibility();
    this.toggleChannelNameContainerVisibility();
  }

  openDesciptionEdit() {
    if (!this.userDataService.checkIfGuestIsLoggedIn()) {
      this.toggleChannelDescriptionVisibility();
      this.toggleNewChannelDescriptionVisibility();
    } else {
      console.warn("Log in to Edit the Channel Description");
    }
  }

  showChannelDescriptionContainer() {
    this.toggleNewChannelDescriptionVisibility();
    this.toggleChannelDescriptionVisibility();
  }

  toggleChannelNameContainerVisibility() {
    this.showChannelName = !this.showChannelName;
  }

  toggleNewChannelNameInputVisibility() {
    this.showNewChannelNameForm = !this.showNewChannelNameForm;
  }

  toggleChannelDescriptionVisibility() {
    this.descriptionContainerVisible = !this.descriptionContainerVisible;
  }

  toggleNewChannelDescriptionVisibility() {
    this.newDescriptionContainerVisible = !this.newDescriptionContainerVisible;
  }

  submitNewName(ngForm: NgForm) {
    if (ngForm.touched && ngForm.valid) {
      this.chatService.updateChatInformation(this.currentChannelId, 'channelName', this.newChannelNameInput)
        .then(() => {
          this.showChannelNameContainer();
        });
    }
  }

  submitNewDescription(ngForm: NgForm) {
    if (ngForm.touched && ngForm.valid) {
      this.chatService.updateChatInformation(this.currentChannelId, 'description', this.newDescriptionInput)
        .then(() => {
          this.showChannelDescriptionContainer();
        });
    }
  }


  /**
   * Lets the user leave the current Channel
   */
  leaveChannel() {
    if (!this.userDataService.checkIfGuestIsLoggedIn()) {
      let currentChannelData = this.publicChat.currentChannelData;
      this.userDataService.getCurrentUserId();
      let currentUserId = this.userDataService.currentUserId;
      if (currentChannelData.channelName != "Entwicklerchannel") {
        this.channelMemberService.removeCurrentUserFromChannel(currentUserId, currentChannelData);
        this.userDataService.getCurrentUserData().then((result: any) => {
          this.userDataService.removeChannelFromUserData(result['channels']);
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
  goBackToMainChannel(){
    this.router.navigate(['/general/public-chat'], {
      queryParams: { chatId: 'ER84UOYc0F2jptDjWxFo' },
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
  }
}