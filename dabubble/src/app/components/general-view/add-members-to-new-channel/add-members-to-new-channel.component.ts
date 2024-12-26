import { Component, ElementRef, EventEmitter, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AllMembersComponent } from '../all-members/all-members.component';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ChannelMemberService, Member} from '../../../services/firebase-services/channel-member.service';


@Component({
  selector: 'app-add-members-to-new-channel',
  standalone: true,
  imports: [CommonModule, AllMembersComponent, ReactiveFormsModule],
  templateUrl: './add-members-to-new-channel.component.html',
  styleUrl: './add-members-to-new-channel.component.scss'
})
export class AddMembersToNewChannelComponent implements OnChanges, OnInit{
  @ViewChild('nameInput') nameInputField!: ElementRef;
  @Output() closeAll: EventEmitter<void> = new EventEmitter();

  firstSelected: boolean = true;
  currentlySelectedMembers: string[] = []; //eventuell kein string
  isMemberArrayEmpty = true;
  searchControl = new FormControl('');
  selectedMembers: Member[] = [];
  searchFocus: boolean = false;

  constructor(
    private memberService: ChannelMemberService,){
  }

  toggleStatus() {
    let inputFieldOne = document.getElementById('input-one') as HTMLInputElement;
    let inputFieldTwo = document.getElementById('input-two') as HTMLInputElement;

    if (inputFieldOne.checked) {
      this.firstSelected = true;
      this.nameInputField.nativeElement.classList.add('d-none');
    }

    if (inputFieldTwo.checked) {
      this.firstSelected = false;
      this.nameInputField.nativeElement.classList.remove('d-none');
    }
  }

  close(): void {
    this.closeAll.emit();
  }

  ngOnInit(): void {
    this.memberService.selectedMembers$.subscribe(members => {
      this.selectedMembers = members;
    });
  }

  ngOnChanges(): void {
    this.isMemberArrayEmpty = this.currentlySelectedMembers.length === 0;

    if (!this.isMemberArrayEmpty){
      document.getElementById('submit-btn')?.classList.remove('btn-primary--disable');
      document.getElementById('submit-btn')?.classList.add('btn-primary--default');
    }
  }

  removeMember(member: Member): void{
    this.memberService.removeMember(member);
  }

  addMembersToChannel(){
    //Do as name says
  }

  clearSearchField(){
    this.searchControl.setValue('')
    this.searchFocus = false;
  }

  hideSelectedMembers(){
    if(this.selectedMembers.length > 0){
      this.searchFocus = true;
    }
  }
}