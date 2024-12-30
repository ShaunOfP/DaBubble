import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { ChannelMemberService, Member} from '../../../services/firebase-services/channel-member.service';


@Component({
  selector: 'app-all-members',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './all-members.component.html',
  styleUrl: './all-members.component.scss'
})
export class AllMembersComponent implements OnChanges{
  @Input() searchQuery: string = '';
  @Output() memberClicked = new EventEmitter<void>();
  memberList: Member[] = [];
  lowerCaseQuery!: string;

  constructor(
    private memberService: ChannelMemberService,){
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['searchQuery']) {
      this.updateMembersList(this.searchQuery.toLowerCase());
    }
  }

  private async updateMembersList(query: string): Promise<void> {
    if (query.trim() !== '') {
      this.memberList = await this.memberService.searchUsers(query);
    } else {
      this.memberList = [];
    }
  }

  selectMember(member: Member){
    this.memberService.selectMember(member);
    this.memberClicked.emit();
  }

}
