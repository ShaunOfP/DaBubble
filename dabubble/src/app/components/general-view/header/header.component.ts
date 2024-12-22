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

  showProfileInfo: boolean = false;
  showGreyScreen: boolean = false;
  showProfileEdit: boolean = false;

  newNameInput: string = ``;
  newMailInput: string = ``;


  /**
   * Changes bool of variable to display/hide the Profile Info (and open the DropdownMenu)
   */
  toggleProfileInfo(){
    if(this.showProfileInfo){
      this.showProfileInfo = false;
      this.openDropdownMenu();
    } else {
      this.showProfileInfo = !this.showProfileInfo;
    }
  }


  /**
   * Navigating to a specific site via the router using a given route
   * @param route A string containing the chosen route
   */
  navigateTo(route: string) {
    this.router.navigate([route]);
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
   * Changes bool of variable to display/hide the Profile Edit
   */
  toggleProfileEdit(){
    if (this.showProfileEdit){
      this.showProfileEdit = false;
    } else {
      this.showProfileEdit = true;
    }
  }


  /**
   * Adds a class to hide the Edit Form
   */
  closeEditForm() {
    this.showProfileEdit = false;
  }

  
  /**
   * Changes bool of variable to hide/show GreyScreen; also hides all other elements when GreyScreen is hidden
   */
  toggleGreyScreen() {
    if (this.showGreyScreen){
      this.showGreyScreen = false;
      this.showProfileInfo = false;
      this.closeDropdownMenu();
      this.showProfileEdit = false;
    } else {
      this.showGreyScreen = true;
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
