import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  ChannelMemberService,
  Member,
} from '../../../../../services/firebase-services/channel-member.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-all-selected-members',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './all-selected-members.component.html',
  styleUrl: './all-selected-members.component.scss',
})
export class AllSelectedMembersComponent {
  @Input() members: Member[] = [];
  @Output() memberRemoved = new EventEmitter<Member>();
  @Output() closeWindow = new EventEmitter();

  constructor(private memberService: ChannelMemberService) { }


  /**
   * Removes a member and notifies the parent component:
   * - emits the `memberRemoved` event with the provided member's data
   * - calls the `removeMember` method of `memberService
   */
  removeMember(member: Member) {
    this.memberRemoved.emit(member);
    this.memberService.removeMember(member);
  }


  /**
   * Closes the current dialog
   */
  close(): void {
    this.closeWindow.emit();
  }
}
