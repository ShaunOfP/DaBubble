import { Component, ElementRef, EventEmitter, OnChanges, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-members-to-new-channel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './add-members-to-new-channel.component.html',
  styleUrl: './add-members-to-new-channel.component.scss'
})
export class AddMembersToNewChannelComponent implements OnChanges{
  @ViewChild('nameInput') nameInputField!: ElementRef;
  @Output() closeAll: EventEmitter<void> = new EventEmitter();

  firstSelected: boolean = true;
  currentlySelectedMembers: string[] = []; //eventuell kein string
  isMemberArrayEmpty = true;

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

  ngOnChanges(): void {
    this.isMemberArrayEmpty = this.currentlySelectedMembers.length === 0;

    if (!this.isMemberArrayEmpty){
      document.getElementById('submit-btn')?.classList.remove('btn-primary--disable');
      document.getElementById('submit-btn')?.classList.add('btn-primary--default');
    }
  }

  addMembersToChannel(){
    //Do as name says
  }
}