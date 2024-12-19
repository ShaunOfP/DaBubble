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
      this.memberList = await this.userService.searchUsers(query);
    } else {
      this.memberList = [];
    }
  }


}
