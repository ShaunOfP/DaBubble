import { Component, Output, EventEmitter } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { ChangeDetectionStrategy, signal } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';

@Component({
  selector: 'app-workspace-menu',
  standalone: true,
  imports: [MatSidenavModule, MatExpansionModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './workspace-menu.component.html',
  styleUrl: './workspace-menu.component.scss'
})
export class WorkspaceMenuComponent {
  @Output() callParent: EventEmitter<void> = new EventEmitter();
  @Output() newMessage: EventEmitter<void> = new EventEmitter();

  openCreateChannelOverlay() {
    this.callParent.emit();
  }

  openNewMessage() {
    this.newMessage.emit();
  }

  readonly channelOpenState = signal(false);
  readonly messagesOpenState = signal(false);
}
