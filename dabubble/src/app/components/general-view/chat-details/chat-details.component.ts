import { Component, ElementRef, EventEmitter, Output, viewChild, ViewChild } from '@angular/core';

@Component({
  selector: 'app-chat-details',
  standalone: true,
  imports: [],
  templateUrl: './chat-details.component.html',
  styleUrl: './chat-details.component.scss'
})
export class ChatDetailsComponent {
  @Output() callParent: EventEmitter<void> = new EventEmitter();
  @ViewChild('newChannelInputContainer') newInput!: ElementRef;
  @ViewChild('channelNameEditContainer') channelNameContainer! : ElementRef;
  @ViewChild('descpritionContainer') descpritionContainer! : ElementRef;
  @ViewChild('editDescriptionContainer') editDescriptionContainer!: ElementRef;

  closeChatDetails() {
    this.callParent.emit();
  }

  openNewChannelInput(){
    this.newInput.nativeElement.classList.remove('d-none');
    this.closeEditChannelContainer();
  }

  closeEditChannelContainer(){
    this.channelNameContainer.nativeElement.classList.add('d-none');
  }

  saveChanges(){
    this.channelNameContainer.nativeElement.classList.remove('d-none');
    this.newInput.nativeElement.classList.add('d-none');
  }

  openDesciptionEdit(){
    this.descpritionContainer.nativeElement.classList.add('d-none');
    this.editDescriptionContainer.nativeElement.classList.remove('d-none');
  }

  saveDescChanges(){
    this.descpritionContainer.nativeElement.classList.remove('d-none');
    this.editDescriptionContainer.nativeElement.classList.add('d-none');
  }
}