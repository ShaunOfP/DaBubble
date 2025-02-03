import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ChannelMemberService } from '../../../services/firebase-services/channel-member.service';
import { AddMembersToNewChannelComponent } from '../workspace-menu/add-members-to-new-channel/add-members-to-new-channel.component';

@Component({
  selector: 'app-create-channel',
  standalone: true,
  imports: [FormsModule, CommonModule, AddMembersToNewChannelComponent],
  templateUrl: './create-channel.component.html',
  styleUrl: './create-channel.component.scss',
})
export class CreateChannelComponent implements OnInit {
  @Output() callParentToClose: EventEmitter<void> = new EventEmitter();

  newChannelName: string = '';
  newChannelDescription: string = '';
  createChannelContainerVisible: boolean = true;
  isComponentVisible: boolean = false;
  isMobile: boolean = false;

  constructor(private memberService: ChannelMemberService) {}

  /**
   * Checks if the user is accessing the page on a mobile device
   */
  ngOnInit(): void {
    const isMobile =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );
    if (isMobile) {
      console.log('Mobile device detected');
      this.isMobile = true;
    } else {
      console.log('Desktop device detected');
      this.isMobile = false;
    }
    this.memberService.isComponentVisible$.subscribe((isVisible) => {
      this.isComponentVisible = isVisible;
    });
  }

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
    this.openCreateChannelContainer();
  }

  /**
   * Removes a class to make the AddMembersToNewChannel Component visible
   */
  openAddMembersToNewChannelMenu() {
    this.memberService.updateComponentStatus(true);
  }

  /**
   * Adds a class to hide the Create-Channel-Container
   */
  closeCreateChannelContainer() {
    if (window.innerWidth > 500) {
      this.createChannelContainerVisible = false;
    }
  }

  /**
   * Removes a class to make the Create-Channel-Container visible
   */
  openCreateChannelContainer() {
    this.createChannelContainerVisible = true;
  }

  /**
   *
   *
   */
  formSubmit(ngForm: NgForm) {
    this.openAddMembersToNewChannelMenu();
    if (ngForm.submitted && ngForm.form.valid) {
      this.memberService.setChannelData(
        this.newChannelName,
        this.newChannelDescription
      );
      this.closeCreateChannelContainer();
    }
  }
}
