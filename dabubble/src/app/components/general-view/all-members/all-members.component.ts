import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Member} from '../../../models/member';
import { UserDatasService } from '../../../services/firebase-services/user-datas.service';


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
  selectedMembers: Map<string, boolean> = new Map();

  constructor(
    private userService: UserDatasService,){
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['searchQuery']) {
      this.updateMembersList(this.searchQuery);
    }
  }

  private async updateMembersList(query: string): Promise<void> {
    if (query.trim() !== '') {
      const members = await this.userService.searchUsers(query);
      this.memberList = members.map(member => ({
        ...member,
        id: member.privateChats[0] || null, 
        selected: this.selectedMembers.get(member.privateChats[0]) || false
      }));
    } else {
      this.memberList = [];
    }
  }

  selectMember(member: Member){
    const memberId = member.privateChats[0];
    if (memberId) {
      member.selected = true;
      this.selectedMembers.set(memberId, true);
      this.userService.addMemberToList(member);
    }
  }

}
