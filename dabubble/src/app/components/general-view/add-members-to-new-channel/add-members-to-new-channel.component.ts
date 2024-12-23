import { Component, ElementRef, EventEmitter, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AllMembersComponent } from '../all-members/all-members.component';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { UserDatasService } from '../../../services/firebase-services/user-datas.service';
import { Member} from '../../../models/member';


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

  constructor(
    private userService: UserDatasService,){
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

  close() {
    this.closeAll.emit();
  }

  ngOnInit(): void {
    this.userService.selectedMembers$.subscribe(members => {
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
    this.userService.removeMember(member);
  }

  addMembersToChannel(){
    //Do as name says
  }
}