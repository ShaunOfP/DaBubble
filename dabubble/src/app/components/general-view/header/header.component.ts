import { Component, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatMenu, MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { Router, RouterModule } from '@angular/router';
import { NgForm, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatButtonModule, MatMenuModule, RouterModule, FormsModule, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  constructor(private router: Router) { }

  @ViewChild('menu') menu!: MatMenu;
  @ViewChild('menuTrigger') menuTrigger!: MatMenuTrigger;

  newNameInput: string = ``;
  newMailInput: string = ``;

  /**
   * Navigating to a specific site via the router using a given route
   * @param route A string containing the chosen route
   */
  navigateTo(route: string) {
    this.router.navigate([route]);
  }

  /**
   * Closes the Info Container and calls the function to open the Dropdown Menu
   */
  closeProfileInfo() {
    document.getElementById('profile-info-container')?.classList.add('d-none');
    this.openDropdownMenu();
  }

  /**
   * Opens the Dropdown Menu
   */
  openDropdownMenu() {
    this.menuTrigger.openMenu();
  }

  /**
   * Closes the Dropdown Menu and also closes the Profile Info Container if it is still open
   */
  closeDropdownMenu() {
    let profileInfoContainer = document.getElementById('profile-info-container');

    this.menuTrigger.closeMenu();
    if (!profileInfoContainer?.classList.contains('d-none')) {
      profileInfoContainer?.classList.add('d-none');
    }
  }


  /**
   * Removes a class to show the Edit Form
   */
  openEditForm() {
    document.getElementById('edit-profile-container')?.classList.remove('d-none');
  }


  /**
   * Adds a class to hide the Edit Form
   */
  closeEditForm() {
    document.getElementById('edit-profile-container')?.classList.add('d-none');
  }


  /**
   * Closes the DropdownMenu and shows the Profile Info
   */
  showProfileInfo() {
    this.closeDropdownMenu();
    document.getElementById('profile-info-container')?.classList.remove('d-none');
  }

  /**
   * Toggles the grey screen for the dropdown menu, also closes the menu if the greyScreen is no longer displayed
   */
  toggleGreyScreen() {
    let element = document.getElementById('grey-screen');

    element?.classList.toggle('d-none');

    if (element?.classList.contains('d-none')) {
      this.closeDropdownMenu();
      this.closeEditForm();
    }
  }

  submitForm(form: NgForm) {
    console.log("hey");
    if (form.touched && form.valid) {
      console.log("valid");
    } else {
      console.log("invalid");
    }
  }
}
