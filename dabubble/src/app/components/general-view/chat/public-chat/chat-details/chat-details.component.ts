import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { NgForm, FormsModule } from '@angular/forms';
import { ChatService } from '../../../../../services/firebase-services/chat.service';
import { PublicChatComponent } from '../public-chat.component';
import { UserDatasService } from '../../../../../services/firebase-services/user-datas.service';

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

  constructor(private chatService: ChatService, public publicChat: PublicChatComponent, public userDataService: UserDatasService) {

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
    this.toggleNewChannelNameInputVisibility();
    this.toggleChannelNameContainerVisibility();
  }

  showChannelNameContainer() {
    this.toggleNewChannelNameInputVisibility();
    this.toggleChannelNameContainerVisibility();
  }

  openDesciptionEdit() {
    this.toggleChannelDescriptionVisibility();
    this.toggleNewChannelDescriptionVisibility();
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
      this.chatService.updateChatInformation(this.currentChannelId, 'channelDescription', this.newDescriptionInput)
        .then(() => {
          this.showChannelDescriptionContainer();
        });
    }
  }

  leaveChannel() {
    //logic for leaving the channel
  }


}