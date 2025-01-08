import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import { CommonModule } from '@angular/common';
import { AllMembersComponent } from '../../all-members/all-members.component';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChannelMemberService, Member} from '../../../../services/firebase-services/channel-member.service';

import { firstValueFrom } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { AllSelectedMembersComponent } from './all-selected-members/all-selected-members.component';


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
  searchQuery: string = '';
  selectedMembers: Member[] = [];
  allMembers: Member[] = [];
  openSelectedMembers: boolean = false;
  userID!: string;
  channelCreated: boolean = false;
  searchFocus: boolean = false;
  isFocused: boolean = false;


  constructor(
    private memberService: ChannelMemberService, private route: ActivatedRoute){
  }

  onSubmit() {
    if (this.selectedOption) {
      this.addAllMembersToChannel();
    } else if(this.selectedMembers.length > 0) {
      this.addSelectedMembersToChannel();
    } else {
      return;
    }
    this.channelCreated = true;
    setTimeout(() => {
      this.close();
    }, 2000);
  }  

  close(): void {
    this.clearSearchField();
    this.selectedMembers.forEach(member => this.removeMember(member))
    this.searchFocus = false;
    this.selectedOption = true;
    this.channelCreated = false;
    this.closeAll.emit();
  }

  ngOnInit(): void {
    this.memberService.selectedMembers$.subscribe(members => {
      this.selectedMembers = members;
    });
    this.route.queryParams.subscribe(params => {
      this.userID = params['userID'];
    });
  }

  removeMember(member: Member): void{
    this.memberService.removeMember(member);
  }

  async addAllMembersToChannel(): Promise<void> {
    await this.memberService.selectAllMembers();
    this.allMembers = await firstValueFrom(this.memberService.allMembersSubject$);
    const filteredMembers = this.allMembers.filter(member => member.id !== this.userID);
    this.memberService.createNewChannel(filteredMembers, this.userID);
  }

  addSelectedMembersToChannel(){
    this.memberService.createNewChannel(this.selectedMembers, this.userID);
  }

  clearSearchField(){
    this.searchQuery = '';
    this.searchFocus = false;
  }

  handleFocus(){
    this.isFocused = true;
  }

  handleBlur(){
    this.isFocused = false;

    if (this.selectedMembers.length > 0 && this.searchQuery === '') {
      this.searchFocus = false;
    } else {
      this.searchFocus = true;
    }
  }

  showSelectedMembersInSearchField(): boolean {
    return !this.isFocused && this.selectedMembers.length > 0;
  }

  // hideSelectedMembers(){
  //   if(this.selectedMembers.length > 0 && this.searchQuery === ''){
  //     this.searchFocus = true;
  //   } else {
  //     this.searchFocus = false;
  //   }
  // }

  showSelectedMembers(){
    this.openSelectedMembers = !this.openSelectedMembers;
  }

  closeSelectedMembersWindow(): void {
    this.openSelectedMembers = false;
  }
}