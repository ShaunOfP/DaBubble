import { Component, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatMenu, MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatButtonModule, MatMenuModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  constructor(private router: Router) {

  }

  @ViewChild('menu') menu!: MatMenu;
  @ViewChild('menuTrigger') menuTrigger!: MatMenuTrigger;


  /**
   * Navigating to a specific site via the router using a given route
   * @param route A string containing the chosen route
   */
  navigateTo(route: string) {
    this.router.navigate([route]);
  }


  /**
   * Toggles the grey screen for the dropdown menu, also closes the menu if the greyScreen is no longer displayed
   */
  toggleGreyScreen() {
    let element = document.getElementById('grey-screen');

    element?.classList.toggle('d-none');

    if (element?.classList.contains('d-none')) {
      this.menuTrigger.closeMenu();
    }
  }
}
