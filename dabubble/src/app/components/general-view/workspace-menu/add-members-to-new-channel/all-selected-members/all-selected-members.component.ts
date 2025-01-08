import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ChannelMemberService, Member } from '../../../../../services/firebase-services/channel-member.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-all-selected-members',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './all-selected-members.component.html',
  styleUrl: './all-selected-members.component.scss'
})
export class AllSelectedMembersComponent {

  constructor(
    private memberService: ChannelMemberService,){
  }

  @Input() members: Member[] = [];
  @Output() memberRemoved = new EventEmitter<Member>();
  @Output() closeWindow = new EventEmitter();

  removeMember(member: Member){
    this.memberRemoved.emit(member);
    this.memberService.removeMember(member);
  }

  close(): void {
    this.closeWindow.emit();
  }

  // getAvatarWithCacheBuster(avatarUrl: string): string {
  //   const cacheBuster = new Date().getTime(); // Generate a timestamp
  //   return avatarUrl ? `${avatarUrl}?v=${cacheBuster}` : 'default-avatar.png';
  // }

 }
