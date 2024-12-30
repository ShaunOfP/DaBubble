import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import { CommonModule } from '@angular/common';
import { AllMembersComponent } from '../all-members/all-members.component';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChannelMemberService, Member} from '../../../services/firebase-services/channel-member.service';
import { AllSelectedMembersComponent } from './all-selected-members/all-selected-members.component';
import { firstValueFrom } from 'rxjs';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-add-members-to-new-channel',
  standalone: true,
  imports: [CommonModule, AllMembersComponent, ReactiveFormsModule, AllSelectedMembersComponent, FormsModule],
  templateUrl: './add-members-to-new-channel.component.html',
  styleUrl: './add-members-to-new-channel.component.scss'
})
export class AddMembersToNewChannelComponent implements OnInit{
  @ViewChild('nameInput') nameInputField!: ElementRef;
  @Output() closeAll: EventEmitter<void> = new EventEmitter();

  selectedOption: boolean = true;
  searchControl = new FormControl('');
  selectedMembers: Member[] = [];
  allMembers: Member[] = [];
  searchFocus: boolean = false;
  openSelectedMembers: boolean = false;
  userID: string | null = null;

  constructor(
    private memberService: ChannelMemberService, private route: ActivatedRoute){
  }

  close(): void {
    this.closeAll.emit();
  }

  ngOnInit(): void {
    this.memberService.selectedMembers$.subscribe(members => {
      this.selectedMembers = members;
    });
    this.route.queryParams.subscribe(params => {
      this.userID = params['userID'] || null;
      console.log('Extracted UID:', this.userID);
    });
  }

  removeMember(member: Member): void{
    this.memberService.removeMember(member);
  }

  async addAllMembersToChannel(): Promise<void> {
    await this.memberService.selectAllMembers();
    this.allMembers = await firstValueFrom(this.memberService.allMembersSubject$);
  }

  addSelectedMembersToChannel(){
  }

  clearSearchField(){
    this.searchControl.setValue('')
    this.searchFocus = false;
  }

  hideSelectedMembers(){
    if(this.selectedMembers.length > 0 && !this.searchFocus){
      this.searchFocus = true;
    } else {
      this.searchFocus = false;
    }
  }

  showSelectedMembers(){
    this.openSelectedMembers = !this.openSelectedMembers;
  }

  closeSelectedMembersWindow(): void {
    this.openSelectedMembers = false;
  }
}