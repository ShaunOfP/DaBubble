import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';

import { ChannelMemberService } from '../../../services/firebase-services/channel-member.service';
import { AddMembersToNewChannelComponent } from '../workspace-menu/add-members-to-new-channel/add-members-to-new-channel.component';


@Component({
  selector: 'app-create-channel',
  standalone: true,
  imports: [FormsModule, CommonModule, AddMembersToNewChannelComponent],
  templateUrl: './create-channel.component.html',
  styleUrl: './create-channel.component.scss'
})
export class CreateChannelComponent {
  @Output() callParentToClose: EventEmitter<void> = new EventEmitter();
  
  newChannelName: string = '';
  newChannelDescription: string  = '';
  createChannelContainerVisible: boolean = true;
  addMembersToNewChannelVisible: boolean = false;

  constructor(private memberService: ChannelMemberService,){}

  /**
   * Sends a call to the parent component to close the Component
   */
  closeCreateChannel() {
    this.callParentToClose.emit();
  }


  /**
   * Calls functions to ensure the right classes on the HTMLElements when the Component was closed
   */
  closeCreateChannelAndChangeClasses() {
    this.closeCreateChannel();
    this.closeAddMembersToNewChannelMenu();
    this.openCreateChannelContainer();
  }


  /**
   * Removes a class to make the AddMembersToNewChannel Component visible
   */
  openAddMembersToNewChannelMenu() {
    this.addMembersToNewChannelVisible = true;
  }


  /**
   * Adds a class to hide the Create-Channel-Container
   */
  closeCreateChannelContainer() {
    this.createChannelContainerVisible = false;
  }


  /**
   * Adds a class to hide the AddMembersToNewChannel Component
   */
  closeAddMembersToNewChannelMenu() {
    this.addMembersToNewChannelVisible = false;
  }


  /**
   * Removes a class to make the Create-Channel-Container visible
   */
  openCreateChannelContainer() {
    this.createChannelContainerVisible = true;
  }


  /**
   * 
   * @param ngForm 
   */
  formSubmit(ngForm: NgForm) {
    this.openAddMembersToNewChannelMenu();
    this.closeCreateChannelContainer();

    if (ngForm.submitted && ngForm.form.valid) {
      this.memberService.setChannelData(this.newChannelName, this.newChannelDescription);
    }
  }
}