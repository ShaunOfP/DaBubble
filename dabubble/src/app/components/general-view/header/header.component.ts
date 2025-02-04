import { Component, ViewChild, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatMenu, MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { NgForm, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { User } from '@angular/fire/auth';
import { AuthService } from '../../../services/firebase-services/auth.service';
import { UserDatasService, UserObserver } from '../../../services/firebase-services/user-datas.service';
import { UserDatas } from '../../../models/user.class';
import { map, Observable, take } from 'rxjs';
import { PublicChatComponent } from '../chat/public-chat/public-chat.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatButtonModule, MatMenuModule, RouterModule, FormsModule, CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  user: User | null = null;
  currentUserData!: UserObserver | null;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public userDatasService: UserDatasService,
    private publicChatComponent: PublicChatComponent
  ) { }

  @ViewChild('menu') menu!: MatMenu;
  @ViewChild('menuTrigger') menuTrigger!: MatMenuTrigger;

  showProfileInfo: boolean = false;
  showGreyScreen: boolean = false;
  showProfileEdit: boolean = false;

  newNameInput: string = ``;
  newMailInput: string = ``;

  inputSearch:string=''

  async ngOnInit(): Promise<void> {
    await this.userDatasService.getUserDataById(); 
    await this.userDatasService.getCurrentChannelId() 
    this.userDatasService.currentUserData$.subscribe((userData) => {
    this.currentUserData = userData
  })
    // if(this.userData === undefined){
    //   const user = setInterval(() => {
    //     this.userData = this.userDatasService.currentUserData
    //     if(this.userData !== undefined){
    //       clearInterval(user)
    //       console.log(this.userData);
    //     }
    //   }, 100);
    // }
    
    
    //  this.userDatasService.userIds$.pipe(
    //   map((ids) => console.log(ids))
    // )
    // .subscribe();
  }
  
  // async getUserDatas(): Promise<void> {
  //   this.route.queryParams.pipe(take(1)).subscribe(async (params) => {
  //     const userID = params['userID'];
  //     if (userID) {
  //       this.userData = await this.userDatasService.getUserDataById(userID);
  //       console.log('User Data:', this.userData);
  //     }
  //   });
  // }
  
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
   * 
   * @param form 
   */
  submitForm(form: NgForm) {
    if (form.touched && form.valid) {
      // this.userDatasService.updateUserData(this.userId, this.newMailInput, this.newNameInput);
      console.log("successful");
    } else {
      console.log("invalid");
    }
  }

  searchInDevspace(){
    console.log(this.inputSearch);
    this.publicChatComponent.updateFilter(this.inputSearch)
    // this.publicChatComponent.updateFilter(this.inputSearch)
  }
}