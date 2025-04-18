import { Component, ViewChild, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatMenu, MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { Router, RouterModule } from '@angular/router';
import { NgForm, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { User } from '@angular/fire/auth';
import {
  UserDatasService,
  UserObserver,
} from '../../../services/firebase-services/user-datas.service';
import { FilterService } from '../../../services/component-services/filter.service';
import { SearchResultsComponent } from './search-results/search-results.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    MatButtonModule,
    MatMenuModule,
    RouterModule,
    FormsModule,
    CommonModule,
    SearchResultsComponent,
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  @ViewChild('menu') menu!: MatMenu;
  @ViewChild('menuTrigger') menuTrigger!: MatMenuTrigger;
  showProfileInfo: boolean = false;
  showGreyScreen: boolean = false;
  showProfileEdit: boolean = false;
  newNameInput: string = ``;
  inputSearch: string = '';
  searchFocused: boolean = false;
  user: User | null = null;
  currentUserData!: UserObserver | null;

  constructor(
    private router: Router,
    public userDatasService: UserDatasService,
    private filterService: FilterService
  ) { }


  async ngOnInit(): Promise<void> {
    await this.userDatasService.getUserDataById();
    this.userDatasService.getCurrentUserId();
    this.subscribeToCurrentUserData();
  }


  /**
   * Subscribes to the current user data
   */
  subscribeToCurrentUserData() {
    this.userDatasService.currentUserData$.subscribe((userData) => {
      this.currentUserData = userData;
    });
  }


  /**
   * Takes boolean as input to decide wether the menu should be open or not
   */
  toggleProfileInfo(state: boolean) {
    if (state) {
      this.showProfileInfo = true;
    }
    if (!state) {
      this.showProfileInfo = false;
      this.openDropdownMenu();
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
    this.menuTrigger.closeMenu();
  }


  /**
   * Changes bool of variable to display/hide the Profile Edit
   */
  toggleProfileEdit() {
    if (this.showProfileEdit) {
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
    if (this.showGreyScreen) {
      this.showGreyScreen = false;
      this.showProfileInfo = false;
      this.closeDropdownMenu();
      this.showProfileEdit = false;
    } else {
      this.showGreyScreen = true;
    }
  }

  /**
   * If guest is not logged in and the form is valid it Updates the Username in the database
   * @param form for form validation
   */
  submitForm(form: NgForm) {
    if (this.userDatasService.checkIfGuestIsLoggedIn()) {
      console.warn('Log in to change your Name');
    } else {
      if (form.touched && form.valid) {
        this.userDatasService.updateUserData(this.userDatasService.currentUserId, this.newNameInput);
        console.log('successful');
        this.closeEditForm();
        this.showProfileInfo = true;
      } else {
        console.log('invalid');
      }
    }
  }


  /**
   * Resets the search results and updates the Filter with the current search input
   */
  searchInDevspace() {
    this.filterService.resetSearchResults();
    this.filterService.updateFilter(this.inputSearch);
  }


  /**
   * Opens the search-results component
   */
  searchFocus() {
    this.searchFocused = true;
  }


  /**
   * Hides the search-results component and clears the input field
   */
  closeSearch() {
    this.searchFocused = false;
    this.inputSearch = '';
  }
}
