import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { ChannelMemberService, Member} from '../../../services/firebase-services/channel-member.service';


@Component({
  selector: 'app-all-members',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './all-members.component.html',
  styleUrl: './all-members.component.scss'
})
export class AllMembersComponent implements OnChanges, OnInit{
  @Input() searchQuery: string = '';
  @Output() memberClicked = new EventEmitter<void>();
  memberList: Member[] = [];
  selectedMembers: Member[] = [];
  lowerCaseQuery!: string;

  constructor(
    private memberService: ChannelMemberService,){
  }

  ngOnInit(): void {
    this.memberService.selectedMembers$.subscribe(members => {
      this.selectedMembers = members;
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['searchQuery']) {
      this.updateMembersList(this.searchQuery);
    }
  }

  //To LowerCase
  // ngOnChanges(changes: SimpleChanges): void {
  //   if (changes['searchQuery']) {
  //     this.updateMembersList(this.searchQuery.toLowerCase());
  //   }
  // }

  private async updateMembersList(query: string): Promise<void> {
    if (query.trim() !== '') {
      this.memberList = await this.memberService.searchUsers(query);
      const selectedMembersSet = new Set(this.selectedMembers.map(m => m.id))
      const updatedMembersList = this.memberList.map(m => {
        return {
          ... m, 
          selected: selectedMembersSet.has(m.id)
        }
      });
      this.memberList = updatedMembersList;
      console.log(this.memberList)
    } else {
      this.memberList = [];
    }
  }

  selectMember(member: Member){
    this.memberService.selectMember(member);
    this.memberClicked.emit();
  }

}

