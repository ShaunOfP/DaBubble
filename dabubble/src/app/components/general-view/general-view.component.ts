import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { WorkspaceMenuComponent } from "./workspace-menu/workspace-menu.component";
import { WorkspaceMenuCloseButtonComponent } from "./workspace-menu-close-button/workspace-menu-close-button.component";
@Component({
  selector: 'app-general-view',
  standalone: true,
  imports: [RouterOutlet, RouterModule, WorkspaceMenuComponent, WorkspaceMenuCloseButtonComponent],
  templateUrl: './general-view.component.html',
  styleUrl: './general-view.component.scss'
})
export class GeneralViewComponent {

}
