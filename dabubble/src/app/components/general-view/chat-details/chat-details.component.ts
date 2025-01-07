import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { NgForm, FormsModule } from '@angular/forms';
import { ChatService } from '../../../services/firebase-services/chat.service';

@Component({
  selector: 'app-chat-details',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './chat-details.component.html',
  styleUrl: './chat-details.component.scss'
})
export class ChatDetailsComponent {
  @Output() callParent: EventEmitter<void> = new EventEmitter();

  currentChannelId: string = 'ER84UOYc0F2jptDjWxFo';

  newDescriptionInput: string = '';
  newChannelNameInput: string = '';

  showChannelName: boolean = true;
  showNewChannelNameForm: boolean = false;
  descriptionContainerVisible: boolean = true;
  newDescriptionContainerVisible: boolean = false;

  constructor(private chatService: ChatService) {

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
      this.chatService.updateChatInformation('x9SaITqN5cLpLMXnv2SY', 'channelName', this.newChannelNameInput)
        .then(() => {
          this.showChannelNameContainer();
        });
    }
  }

  submitNewDescription(ngForm: NgForm) {
    if (ngForm.touched && ngForm.valid) {
      this.chatService.updateChatInformation('x9SaITqN5cLpLMXnv2SY', 'channelDescription', this.newDescriptionInput)
        .then(() => {
          this.showChannelDescriptionContainer();
        });
    }
  }
}