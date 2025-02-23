import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import {
  ChannelMemberService,
  Member,
} from '../../../services/firebase-services/channel-member.service';

@Component({
  selector: 'app-all-members',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './all-members.component.html',
  styleUrl: './all-members.component.scss',
})
export class AllMembersComponent implements OnChanges, OnInit {
  @Input() searchQuery: string = '';
  @Output() memberClicked = new EventEmitter<void>();
  memberList: Member[] = [];
  selectedMembers: Member[] = [];
  lowerCaseQuery!: string;

  constructor(private memberService: ChannelMemberService) {}

  ngOnInit(): void {
    this.memberService.selectedMembers$.subscribe((members) => {
      this.selectedMembers = members;
    });
  }

  /**
   * Reacts to changes in the input properties of the component.
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['searchQuery']) {
      this.updateMembersList(this.searchQuery);
    }
  }

  /**
   * Updates the list of members (`memberList`) based on a search query:
   * - performs a search for users via `memberService.searchUsers`
   * - synchronizes the `selected` status of the search results with the existing `selectedMembers` list
   * - clears the `memberList` if the query is empty
   */
  private async updateMembersList(query: string): Promise<void> {
    if (query.trim() !== '') {
      this.memberList = await this.memberService.searchUsers(query);
      const selectedMembersSet = new Set(this.selectedMembers.map((m) => m.id));
      const updatedMembersList = this.memberList.map((m) => {
        return {
          ...m,
          selected: selectedMembersSet.has(m.id),
        };
      });
      this.memberList = updatedMembersList;
    } else {
      this.memberList = [];
    }
  }

  /**
   * Selects a member and triggers an event after selection:
   * - calls the `selectMember` method from the `channel-member-service`
   * - closes the search list after selection
   */
  selectMember(member: Member) {
    this.memberService.selectMember(member);
    this.memberClicked.emit();
  }
}
