import { Component, OnInit } from '@angular/core';
import { ChannelMemberService, Member } from '../../../../services/firebase-services/channel-member.service';
import { ChannelService, Channel } from "../../../../services/firebase-services/channel.service";
import { CommonModule } from '@angular/common';
import { AllMembersComponent } from "../../all-members/all-members.component";
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-new-message',
  standalone: true,
  imports: [CommonModule, AllMembersComponent, FormsModule],
  templateUrl: './new-message.component.html',
  styleUrls: ['./new-message.component.scss', '../../workspace-menu/add-members-to-new-channel/add-members-to-new-channel.component.scss']
})
export class NewMessageComponent implements OnInit {
  selectedMembers: Member[] = [];
  isFocused: boolean = false;
  openSelectedMembers: boolean = false;
  searchQuery: string = '';
  searchFocus: boolean = false;
  selectedOption: boolean = true;
  channels: Channel[] = [];

  constructor(private memberService: ChannelMemberService, private channelService: ChannelService) { }


  /**
   * Fetches the Selected Members
   */
  ngOnInit(): void {
    this.fetchSelectedMembers();
    this.fetchChannels();    
  }


  /**
   * Fetches the selected Members from the Service
   */
  fetchSelectedMembers(){
    this.memberService.selectedMembers$.subscribe((members) => {
      this.selectedMembers = members;
    });
  }


  /**
   * Fetches the current Channels
   */
  fetchChannels(){
    this.channelService.getChannels().subscribe((channels) => {
      this.channels = channels;
    });
  }


  /**
   * Changes styling of the component to fit Design for different purposes
   */
  changeHeaders() {
    document.getElementById('chat-container')?.classList.add('height-normal-header');
    document.getElementById('chat-container')?.classList.remove('height-new-message');
  }


  /* This is not finished? */
  async onSearchInput(event: Event): Promise<void> {
    const input = (event.target as HTMLInputElement).value;
    console.log(input);
    if (input.startsWith('#')) {
      console.log('channels', this.channels);
      this.searchQuery = input;
      const channels = await this.channelService.searchChannels(input);
    } else if (input.startsWith('@')) {
      this.selectedOption = false;
      this.searchQuery = input;
    } else {
      console.log('search All');
      this.selectedOption = true;
    }
  }


  /**
   * Removes a member from the selected Members of the new Message
   * @param member The Member which should be removed from the Array
   */
  removeMember(member: Member): void {
    this.memberService.removeMember(member);
  }


  /**
   * Toggles Visibility of the selected Members Section under the Input Field
   */
  showSelectedMembers() {
    this.openSelectedMembers = !this.openSelectedMembers;
  }


  /**
   * This toggles the Visibility of the selected Members under the Search Input
   * @returns A boolean 
   */
  showSelectedMembersInSearchField(): boolean {
    return !this.isFocused && this.selectedMembers.length > 0;
  }


  /**
   * Clears the Search Field
   */
  clearSearchField() {
    this.searchQuery = '';
    this.searchFocus = false;
  }


  /**
   * Sets Boolean for a Variable to show the selected Members for the new Message
   */
  handleFocus() {
    this.isFocused = true;
  }


  /**
   * Handles Visibility for the Dropdown Menu of the Search Input Field
   */
  handleBlur() {
    this.isFocused = false;

    if (this.selectedMembers.length > 0 && this.searchQuery === '') {
      this.searchFocus = false;
    } else {
      this.searchFocus = true;
    }
  }
}
