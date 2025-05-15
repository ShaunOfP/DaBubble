import { CommonModule } from '@angular/common';
import {
  Component,
  OnInit,
} from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ChannelMemberService } from '../../../services/firebase-services/channel-member.service';
import { AddMembersToNewChannelComponent } from '../workspace-menu/add-members-to-new-channel/add-members-to-new-channel.component';
import { ChannelService } from '../../../services/firebase-services/channel.service';

@Component({
  selector: 'app-create-channel',
  standalone: true,
  imports: [FormsModule, CommonModule, AddMembersToNewChannelComponent],
  templateUrl: './create-channel.component.html',
  styleUrl: './create-channel.component.scss',
})
export class CreateChannelComponent implements OnInit {
  newChannelName: string = '';
  newChannelDescription: string = '';
  createChannelContainerVisible: boolean = true;
  isComponentVisible: boolean = false;
  isMobile: boolean = false;

  constructor(private memberService: ChannelMemberService,
    public channelService: ChannelService
  ) { }


  /**
   * Checks if the user is accessing the page on a mobile device
   */
  ngOnInit(): void {
    const isMobile =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );
    if (isMobile) {
      this.isMobile = true;
    } else {
      this.isMobile = false;
    }
    this.memberService.isComponentVisible$.subscribe((isVisible) => {
      this.isComponentVisible = isVisible;
    });
    this.channelService.getChannelNames();
  }


  /**
   * Sends a call to the parent component to close the Component
   */
  closeCreateChannel() {
    this.channelService.isCreateChannelClosed = true;
  }


  /**
   * Calls functions to ensure the right classes on the HTMLElements when the Component was closed
   */
  closeCreateChannelAndChangeClasses() {
    this.closeCreateChannel();
    this.openCreateChannelContainer();
  }


  /**
   * Removes a class to make the AddMembersToNewChannel Component visible
   */
  openAddMembersToNewChannelMenu() {
    this.channelService.isAddMembersToNewChannelVisible = true;
  }


  /**
   * Adds a class to hide the Create-Channel-Container
   */
  closeCreateChannelContainer() {
    this.channelService.isCreateChannelClosed = true;
  }


  /**
   * Removes a class to make the Create-Channel-Container visible
   */
  openCreateChannelContainer() {
    this.channelService.isCreateChannelClosed = false;
  }


  /**
   * On Submit assigns the new Channel Data to open it and Close the Channel Creation
   * @param ngForm for Validation
   */
  formSubmit(ngForm: NgForm) {
    this.openAddMembersToNewChannelMenu();
    if (ngForm.submitted && ngForm.form.valid) {
      this.memberService.setChannelData(
        this.newChannelName,
        this.newChannelDescription
      );
      if (window.innerWidth > 500) {
        this.closeCreateChannelContainer();
      }
    }
  }
}
