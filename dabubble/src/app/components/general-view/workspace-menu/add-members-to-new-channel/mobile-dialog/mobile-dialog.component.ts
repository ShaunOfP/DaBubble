import { Component, ElementRef, ViewChild } from '@angular/core';
import {
  ChannelMemberService,
  Member,
} from '../../../../../services/firebase-services/channel-member.service';
import { CommonModule } from '@angular/common';
import { AllMembersComponent } from '../../../all-members/all-members.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AllSelectedMembersComponent } from '../all-selected-members/all-selected-members.component';
import { UserDatasService } from '../../../../../services/firebase-services/user-datas.service';
import {
  MatBottomSheetModule,
  MatBottomSheetRef,
} from '@angular/material/bottom-sheet';

@Component({
  selector: 'app-mobile-dialog',
  standalone: true,
  imports: [
    CommonModule,
    AllMembersComponent,
    ReactiveFormsModule,
    FormsModule,
    MatBottomSheetModule,
    AllSelectedMembersComponent,
  ],
  templateUrl: './mobile-dialog.component.html',
  styleUrl: './mobile-dialog.component.scss',
})
export class MobileDialogComponent {
  @ViewChild('nameInput') nameInputField!: ElementRef;

  selectedOption: boolean = true;
  searchQuery: string = '';
  selectedMembers: Member[] = [];
  allMembers: Member[] = [];
  openSelectedMembers: boolean = false;
  channelCreated: boolean = false;
  searchFocus: boolean = false;
  isFocused: boolean = false;

  constructor(
    private memberService: ChannelMemberService,
    private userDataService: UserDatasService,
    private bottomSheetRef: MatBottomSheetRef<MobileDialogComponent>
  ) {}

  ngOnInit(): void {
    this.memberService.selectedMembers$.subscribe((members) => {
      this.selectedMembers = members;
    });
  }

  getInitials(username: string): string {
    if (!username) return '';
    return username
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase())
      .join('');
  }

  /**
   * Handles the submission process to create a new channel after member selection.
   * - Evaluates the user's input and determines which action to execute.
   * - If `selectedOption` is `true`, the `addAllMembersToChannel` function is called.
   * - If the `selectedMembers` array is not empty, the `addSelectedMembersToChannel` function is called.
   * - After executing one of the above functions, the window is closed with a delay of 2000 ms.
   */
  onSubmit() {
    if (this.selectedOption) {
      this.addAllMembersToChannel();
    } else if (this.selectedMembers.length > 0) {
      this.addSelectedMembersToChannel();
    } else {
      return;
    }
    this.channelCreated = true;
    setTimeout(() => {
      this.close();
    }, 2000);
  }

  /**
   * Adds all current members to a new channel:
   * - Initiates member retrieval with selectAllMembers() in member Service
   * - Subscribes observable `allMembersSubject$` to retrieve all members.
   * - Filters out the channel creator from the list of members.
   * - Passes the filtered members and the creator's ID to the `createNewChannel` method.
   */
  async addAllMembersToChannel(): Promise<void> {
    await this.memberService.selectAllMembers();
    this.memberService.allMembersSubject$.subscribe({
      next: (users) => {
        this.allMembers = users;
      },
    });
    const filteredMembers = this.allMembers.filter(
      (member) => member.id !== this.userDataService.currentUserId
    );
    this.memberService.createNewChannel(
      filteredMembers,
      this.userDataService.currentUserId
    );
  }

  /**
   * Initiates the creation of a new channel with the selected members.
   * - Passes the `selectedMembers` array and the creator's ID to the `createNewChannel` function
   */
  addSelectedMembersToChannel() {
    this.memberService.createNewChannel(
      this.selectedMembers,
      this.userDataService.currentUserId
    );
  }

  /**
   * Resets all input fields, arrays, and variables and closes the dialog.
   */
  close(): void {
    this.clearSearchField();
    this.selectedMembers.forEach((member) => this.removeMember(member));
    this.searchFocus = false;
    this.selectedOption = true;
    this.channelCreated = false;
    this.bottomSheetRef.dismiss('closed');
  }

  /**
   * Clears the search input by setting the `searchQuery` variable to an empty string.
   * Removes focus from the search field by setting the `searchFocus` variable to `false`.
   */
  clearSearchField() {
    this.searchQuery = '';
    this.searchFocus = false;
  }

  /**
   * Initiates the removal of a member when clicked.
   * - Calls the function 'removeMember' of the memberService
   * - Passes the provided member's data to the service
   */
  removeMember(member: Member): void {
    this.memberService.removeMember(member);
  }

  /**
   * Sets variable isFocused to 'true' when search field is clicked on
   */
  handleFocus() {
    this.isFocused = true;
  }

  /**
   * Handles the blur event when clicking outside the search field.
   * - Sets the `isFocused` variable to `false`, indicating that the search field has lost focus
   * - Updates the `searchFocus` variable based on the state of the `selectedMembers` array and the `searchQuery`
   */
  handleBlur() {
    this.isFocused = false;

    if (this.selectedMembers.length > 0 && this.searchQuery === '') {
      this.searchFocus = false;
    } else {
      this.searchFocus = true;
    }
  }

  /**
   * Determines the visibility of selected members in the search field.
   * - Returns `true` if the search field is not focused (`isFocused` is `false`)
   *   and there are selected members in the `selectedMembers` array.
   * - Returns `false` otherwise.
   * @returns {boolean}
   */
  showSelectedMembersInSearchField(): boolean {
    return !this.isFocused && this.selectedMembers.length > 0;
  }

  /**
   * Toggles the visibility of the selected members list.
   * - Flips the state of the `openSelectedMembers` variable:
   *   - If `openSelectedMembers` is `true`, it becomes `false`.
   *   - If `openSelectedMembers` is `false`, it becomes `true`.
   */
  showSelectedMembers() {
    this.openSelectedMembers = !this.openSelectedMembers;
  }

  /**
   * Closes the selected members window by setting variable 'openSelectedMembers' to false
   */
  closeSelectedMembersWindow(): void {
    this.openSelectedMembers = false;
  }
}
