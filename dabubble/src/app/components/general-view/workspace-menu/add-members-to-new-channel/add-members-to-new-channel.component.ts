import {
  Component,
  ElementRef,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
  HostListener,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { AllMembersComponent } from '../../all-members/all-members.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  ChannelMemberService,
  Member,
} from '../../../../services/firebase-services/channel-member.service';
import { AllSelectedMembersComponent } from './all-selected-members/all-selected-members.component';
import { UserDatasService } from '../../../../services/firebase-services/user-datas.service';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';

@Component({
  selector: 'app-add-members-to-new-channel',
  standalone: true,
  imports: [
    CommonModule,
    AllMembersComponent,
    ReactiveFormsModule,
    AllSelectedMembersComponent,
    FormsModule,
    MatBottomSheetModule,
  ],
  templateUrl: './add-members-to-new-channel.component.html',
  styleUrl: './add-members-to-new-channel.component.scss',
})
export class AddMembersToNewChannelComponent implements OnInit {
  @ViewChild('nameInput') nameInputField!: ElementRef;
  @Output() closeAll: EventEmitter<void> = new EventEmitter();
  selectedOption: boolean = true;
  searchQuery: string = '';
  selectedMembers: Member[] = [];
  allMembers: Member[] = [];
  openSelectedMembers: boolean = false;
  channelCreated: boolean = false;
  searchFocus: boolean = false;
  isFocused: boolean = false;
  isMobile: boolean = false;
  openAddMembers: boolean = true;
  isComponentVisible: boolean = false;
  isAnimating: boolean = false;

  constructor(
    private memberService: ChannelMemberService,
    private userDataService: UserDatasService,
    private eRef: ElementRef
  ) { }


  /**
   * Listens to all events of the document. When the click event is fired the function is called
   * @param event Click Event
   */
  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    if (
      this.openAddMembers &&
      !this.eRef.nativeElement
        .querySelector('.main-content')
        .contains(event.target as Node) &&
      !this.eRef.nativeElement
        .querySelector('container-wrapper')
        .contains(event.target as Node)
    ) {
      this.close();
    }
  }

  ngOnInit(): void {
    this.subscribeToSelectedMembers();
    this.subscribeToVisibilityOfComponent();
    this.openAddMembers = true;
    if (window.innerWidth < 450) {
      this.isMobile = true;
    }
  }


  /**
   * Subscribes to the currently selected members
   */
  subscribeToSelectedMembers() {
    this.memberService.selectedMembers$.subscribe((members) => {
      this.selectedMembers = members;
    });
  }


  /**
   * Subscribes to the current state of the visibility of the component
   */
  subscribeToVisibilityOfComponent() {
    this.memberService.isComponentVisible$.subscribe((isVisible) => {
      this.isComponentVisible = isVisible;
    });
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
    this.isAnimating = true;
    setTimeout(() => {
      if (!this.isMobile) {
        this.closeAll.emit();
      }
      this.isAnimating = false;
      this.clearSearchField();
      this.selectedMembers.forEach((member) => this.removeMember(member));
      this.searchFocus = false;
      this.selectedOption = true;
      this.channelCreated = false;
      this.openAddMembers = false;
      this.memberService.updateComponentStatus(false);
    }, 200);
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
