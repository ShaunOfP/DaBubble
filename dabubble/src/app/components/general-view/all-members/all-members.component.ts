import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
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
  memberList: Member[] = [];
  lowerCaseQuery!: string;

  constructor(
    private memberService: ChannelMemberService,){
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['searchQuery']) {
      this.updateMembersList(this.searchQuery);
    }
  }

  private async updateMembersList(query: string): Promise<void> {
    this.lowerCaseQuery = query.toLowerCase();
    if (this.lowerCaseQuery.trim() !== '') {
      this.memberList = await this.memberService.searchUsers(this.lowerCaseQuery);
    } else {
      this.memberList = [];
    }
  }

  selectMember(member: Member){
    this.memberService.selectMember(member);
  }

}
