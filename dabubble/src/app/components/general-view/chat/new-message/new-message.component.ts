import { Component, OnInit } from '@angular/core';
import { UserDatas } from '../../../../models/user.class';
import { ChannelMemberService, Member } from '../../../../services/firebase-services/channel-member.service';
import { CommonModule } from '@angular/common';
import { AllMembersComponent } from "../../all-members/all-members.component";
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-new-message',
  standalone: true,
  imports: [CommonModule, AllMembersComponent, FormsModule],
  templateUrl: './new-message.component.html',
  styleUrls: ['./new-message.component.scss']
})
export class NewMessageComponent implements OnInit {
  selectedMembers: Member[] = [];
  isFocused: boolean = false;
  openSelectedMembers: boolean = false;
  searchQuery: string = '';
  searchFocus: boolean = false;
  selectedOption: boolean = true;
  
  constructor(private memberService: ChannelMemberService) { }

  ngOnInit(): void {
    this.memberService.selectedMembers$.subscribe((members) => {
      this.selectedMembers = members;
    });
  }
  
  //Called when search is finished
  changeHeaders(){
    document.getElementById('chat-container')?.classList.add('height-normal-header');
    document.getElementById('chat-container')?.classList.remove('height-new-message');
  }

  onSearchInput(event: Event): void {
    const input = (event.target as HTMLInputElement).value;
    console.log(input);
    if (input.startsWith('#')) {
      
    } else if (input.startsWith('@')) {
      this.selectedOption = false;  
      this.searchQuery = input;
    } else {
      console.log('search All');
    }
  }

  removeMember(member: Member): void {
    this.memberService.removeMember(member);
  }

  showSelectedMembers() {
    this.openSelectedMembers = !this.openSelectedMembers;
  }

  showSelectedMembersInSearchField(): boolean {
    return !this.isFocused && this.selectedMembers.length > 0;
  }

  clearSearchField() {
    this.searchQuery = '';
    this.searchFocus = false;
  }

  handleFocus() {
    this.isFocused = true;
  }

  handleBlur() {
    this.isFocused = false;

    if (this.selectedMembers.length > 0 && this.searchQuery === '') {
      this.searchFocus = false;
    } else {
      this.searchFocus = true;
    }
  }
}
