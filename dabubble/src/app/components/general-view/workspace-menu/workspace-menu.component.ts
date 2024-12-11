import { Component, Output, EventEmitter } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';

@Component({
  selector: 'app-workspace-menu',
  standalone: true,
  imports: [MatSidenavModule],
  templateUrl: './workspace-menu.component.html',
  styleUrl: './workspace-menu.component.scss'
})
export class WorkspaceMenuComponent {
  @Output() callParent: EventEmitter<void> = new EventEmitter();

  openCreateChannelOverlay() {
    this.callParent.emit();
  }
}
