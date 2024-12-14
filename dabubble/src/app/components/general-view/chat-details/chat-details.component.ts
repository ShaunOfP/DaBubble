import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { NgForm, FormsModule } from '@angular/forms';

@Component({
  selector: 'app-chat-details',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './chat-details.component.html',
  styleUrl: './chat-details.component.scss'
})
export class ChatDetailsComponent {
  @Output() callParent: EventEmitter<void> = new EventEmitter();
  @ViewChild('newChannelInputContainer') newInput!: ElementRef;
  @ViewChild('channelNameEditContainer') channelNameContainer!: ElementRef;
  @ViewChild('descpritionContainer') descpritionContainer!: ElementRef;
  @ViewChild('editDescriptionContainer') editDescriptionContainer!: ElementRef;

  newDescriptionInput: string = '';
  newChannelNameInput: string = '';

  closeChatDetails() {
    this.callParent.emit();
  }

  openNewChannelInput() {
    this.showChannelInputContainer();
    this.hideChannelNameContainer();
  }

  saveChanges() {
    //save changes
    this.hideChannelInputContainer();
    this.showChannelNameContainer();
  }

  openDesciptionEdit() {
    this.hideDescriptionContainer();
    this.showDescriptionInputContainer();
  }

  saveDescChanges() {
    //save changes
    this.hideDescriptionInputContainer();
    this.showDescriptionContainer();
  }

  showChannelNameContainer() {
    this.channelNameContainer.nativeElement.classList.remove('d-none');
  }

  hideChannelNameContainer() {
    this.channelNameContainer.nativeElement.classList.add('d-none');
  }

  showChannelInputContainer() {
    this.newInput.nativeElement.classList.remove('d-none');
  }

  hideChannelInputContainer() {
    this.newInput.nativeElement.classList.add('d-none');
  }

  showDescriptionContainer() {
    this.descpritionContainer.nativeElement.classList.remove('d-none');
  }

  hideDescriptionContainer() {
    this.descpritionContainer.nativeElement.classList.add('d-none');
  }

  showDescriptionInputContainer() {
    this.editDescriptionContainer.nativeElement.classList.remove('d-none');
  }

  hideDescriptionInputContainer() {
    this.editDescriptionContainer.nativeElement.classList.add('d-none');
  }

  submitNewName(ngForm: NgForm) {

  }

  submitNewDescription(ngForm: NgForm) {

  }
}