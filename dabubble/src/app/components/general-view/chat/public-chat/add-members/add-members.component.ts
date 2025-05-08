import { Component, EventEmitter, Output } from '@angular/core';
import { PublicChatComponent } from '../public-chat.component';
import { AllMembersComponent } from '../../../all-members/all-members.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  ChannelMemberService,
  Member,
} from '../../../../../services/firebase-services/channel-member.service';
import { AllSelectedMembersComponent } from '../../../workspace-menu/add-members-to-new-channel/all-selected-members/all-selected-members.component';
import { UserDatasService } from '../../../../../services/firebase-services/user-datas.service';
import { ChatService } from '../../../../../services/firebase-services/chat.service';

@Component({
  selector: 'app-add-members',
  standalone: true,
  imports: [
    AllMembersComponent,
    CommonModule,
    FormsModule,
    AllSelectedMembersComponent,
  ],
  templateUrl: './add-members.component.html',
  styleUrl: './add-members.component.scss',
})
export class AddMembersComponent {
  @Output() closeMe: EventEmitter<void> = new EventEmitter();
  currentChannelName: string = '';
  searchInput: string = '';
  selectedOption: boolean = true;
  isFocused: boolean = false;
  selectedMembers: Member[] = [];
  allMembers: Member[] = [];
  searchFocus: boolean = false;
  isComponentVisible: boolean = false;
  openAddMembers: boolean = true;
  isMobile: boolean = false;
  openSelectedMembers: boolean = false;

  constructor(
    public publicChatComponent: PublicChatComponent,
    public channelMemberService: ChannelMemberService,
    public userDataService: UserDatasService,
    public chatSerivce: ChatService
  ) { }

  ngOnInit() {
    this.subscribeToSelectedMembers();
    this.subscribeToVisibility();
    this.openAddMembers = true;
    if (window.innerWidth < 450) {
      this.isMobile = true;
    }
  }

  subscribeToSelectedMembers() {
    this.channelMemberService.selectedMembers$.subscribe((members) => {
      this.selectedMembers = members;
    });
  }

  subscribeToVisibility() {
    this.channelMemberService.isComponentVisible$.subscribe((isVisible) => {
      this.isComponentVisible = isVisible;
    });
  }

  showSelectedMembersInSearchField(): boolean {
    return !this.isFocused && this.selectedMembers.length > 0;
  }

  removeMember(member: Member): void {
    this.channelMemberService.removeMember(member);
  }

  handleBlur() {
    this.isFocused = false;
    if (this.selectedMembers.length > 0 && this.searchInput === '') {
      this.searchFocus = false;
    } else {
      this.searchFocus = true;
    }
  }

  clearSearchField() {
    this.searchInput = '';
    this.searchFocus = false;
  }

  showSelectedMembers() {
    this.openSelectedMembers = !this.openSelectedMembers;
  }

  /**
   * Closes the selected members window by setting variable 'openSelectedMembers' to false
   */
  closeSelectedMembersWindow(): void {
    this.openSelectedMembers = false;
  }

  /**
   * Emits a signal to the parent component to close the Add Members Menu
   */
  closeAddMembersMenu() {
    this.closeMe.emit();
    this.chatSerivce.showChatDetailsMobileGreyLayer = false;
  }

  onSubmit() {
    if (!this.userDataService.checkIfGuestIsLoggedIn()) {
      this.addSelectedMembersToExistingChannel();
      setTimeout(() => {
        this.closeAddMembersMenu();
      }, 2000);
    } else {
      console.warn('Log in to add Members to a Public Channel');
    }
  }

  getCurrentChatId(): string {
    return this.chatSerivce.currentChatId;
  }

  addSelectedMembersToExistingChannel() {
    const channelId = this.getCurrentChatId();
    if (this.selectedMembers.length > 0) {
      this.selectedMembers.forEach((selectedMember) => {
        this.chatSerivce.updateChatInformation(
          channelId,
          'users',
          selectedMember.id
        );
      });
    }
  }

  /**
   * Sets variable isFocused to 'true' when search field is clicked on
   */
  handleFocus() {
    this.isFocused = true;
  }
}
