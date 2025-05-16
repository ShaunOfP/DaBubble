import { CommonModule } from '@angular/common';
import {
  Component,
  OnInit,
} from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ChannelMemberService } from '../../../../services/firebase-services/channel-member.service';
import { ChannelService } from '../../../../services/firebase-services/channel.service';
import { AddMembersToNewChannelComponent } from './add-members-to-new-channel/add-members-to-new-channel.component';

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
  showMe: boolean = false;

  constructor(private memberService: ChannelMemberService,
    public channelService: ChannelService,
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
    this.channelService.isAddMembersToNewChannelVisible = false;
    this.channelService.isCreateChannelOverlayVisible = false;
  }


  /**
   * Calls functions to ensure the right classes on the HTMLElements when the Component was closed
   */
  closeCreateChannelAndChangeClasses() {
    this.closeCreateChannel();
    this.openCreateChannelContainer();
  }


  /**
   * Changes variable to make the AddMembersToNewChannel Component visible
   */
  openAddMembersToNewChannelMenu() {
    this.channelService.isAddMembersToNewChannelVisible = true;
  }


  /**
   * Hides the CreateChannel-Overlay to make room for the AddMembersToNewChannel-Component
   */
  hideCreateChannelOverlay() {
    this.channelService.isCreateChannelOverlayVisible = false;
  }


  /**
   * Changes variable to make the Create-Channel-Container visible
   */
  openCreateChannelContainer() {
    this.channelService.isCreateChannelClosed = false;
  }


  /**
   * On Submit assigns the new Channel Data to open it and Close the Channel Creation
   * @param ngForm for Validation
   */
  formSubmit(ngForm: NgForm) {
    if (ngForm.submitted && ngForm.form.valid) {
      this.memberService.setChannelData(
        this.newChannelName,
        this.newChannelDescription
      );
      if (window.innerWidth > 500) {
        this.hideCreateChannelOverlay();
      }
      this.openAddMembersToNewChannelMenu();
    }
  }
}
