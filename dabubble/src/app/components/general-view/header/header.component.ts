import { Component, ViewChild, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatMenu, MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { NgForm, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { User } from '@angular/fire/auth';
import { AuthService } from '../../../services/firebase-services/auth.service';
import { UserDatasService } from '../../../services/firebase-services/user-datas.service';
import { UserDatas } from '../../../models/user.class';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatButtonModule, MatMenuModule, RouterModule, FormsModule, CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  user: User | null = null;
  userData: UserDatas | null = null;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public userDatasService: UserDatasService
  ) {}

  @ViewChild('menu') menu!: MatMenu;
  @ViewChild('menuTrigger') menuTrigger!: MatMenuTrigger;

  showProfileInfo: boolean = false;
  showGreyScreen: boolean = false;
  showProfileEdit: boolean = false;

  newNameInput: string = ``;
  newMailInput: string = ``;

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const userID = params['userID'];
      if (userID) {
        this.fetchUserData(userID);
      }
      else {
        console.error('No user ID provided');
      }
    });
  }

  async fetchUserData(userID: string): Promise<void> {
    try {
      const userData = await this.userDatasService.getUserDataById(userID);
      this.userData = userData || null;
      console.log('Fetched user data:', this.userData);
      if (this.userData) {
        console.log('Mail:', this.userData.mail);
        console.log('Name:', this.userData.username); // Correctly log the name    
        console.log('Account Image:', this.userData.avatar); // Correctly log the account image
      } else {
        console.log('User data is null or undefined');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  }

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
   * Changes the bool of a variable to hide the Profile Edit
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

  /**
   * 
   * @param form 
   */
  submitForm(form: NgForm) {
    console.log("hey");
    if (form.touched && form.valid) {
      console.log("valid");
    } else {
      console.log("invalid");
    }
  }
}