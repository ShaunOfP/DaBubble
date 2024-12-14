import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm} from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { Router, RouterModule } from '@angular/router';
import { UserDatas } from '../../../../models/user.class';
import { AuthService } from '../../../../services/firebase-services/auth.service';
import { HeaderSectionComponent } from "../../header-section/header-section.component";
import { FooterComponent } from "../../footer/footer.component";


@Component({
  selector: 'app-avatar',
  standalone: true,
  imports: [CommonModule, FormsModule, MatCardModule, MatCheckboxModule, RouterModule, HeaderSectionComponent, FooterComponent],
  templateUrl: './avatar.component.html',
  styleUrl: './avatar.component.scss'
})
export class AvatarComponent /* implements OnInit */ {
/*   selectedAvatar: string | null = null; */
 /*  selectedAvatar: string = 'default-avatar'; */
  avatarCreated: boolean = false;

  public accountData!: UserDatas;

  constructor(private router: Router, private authService : AuthService) {
    const navigation = this.router.getCurrentNavigation();
    this.accountData = navigation?.extras?.state?.['accountData'];
    console.log('User in AvatarComponent:', this.accountData);
    this.checkInput()
  }
  
  avatarList: Array<string> = ['avatar1','avatar2','avatar3','avatar4','avatar5','avatar6']

  selectAvatar(avatar: string, event: Event): void {
    event.preventDefault();
    this.accountData.accountImg = avatar;
  }

  createUser(ngForm:NgForm){
    if(ngForm.valid && ngForm.submitted){
      this.authService.createUserWithEmail(this.accountData)
     
      console.log(this.accountData);
      setTimeout(() => {
        this.avatarCreated = true;
      }, 1000);
    }
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
  }

  checkInput(){
    if(this.accountData.name == undefined) this.navigateTo('sign-in')
    return
  }
}


 /*  constructor(private router: Router, private userService: UserDatasService,) {} */
/*   avatarList = [
    {
      name: 'avatar1',
      img: '/img/general-view/create-avatar/avatar1.svg'
    },
    {
      name: 'avatar2',
      img: '/img/general-view/create-avatar/avatar2.svg'
    },
    {
      name: 'avatar3',
      img: '/img/general-view/create-avatar/avatar3.svg'
    },
    {
      name: 'avatar4',
      img: '/img/general-view/create-avatar/avatar4.svg'
    },
    {
      name: 'avatar5',
      img: '/img/general-view/create-avatar/avatar5.svg'
    },
    {
      name: 'avatar6',
      img: '/img/general-view/create-avatar/avatar6.svg'
    },
  ] */

 /*  ngOnInit(){
    this.userService.user$.subscribe(user => {
      if (user) {
        this.user = user;
      } else {
        this.userService.getUserFromStorage();
      }
    });
  }
 */


  
 /*  createAvatar(){
    if (this.selectedAvatar) {
      this.userService.updateUserAvatar(this.user.id, this.selectedAvatarImg);
      this.avatarCreated = true;
      setTimeout(() => {
        this.navigateTo('');
        this.avatarCreated = false;
        localStorage.removeItem('user')
      }, 1300);
    }
  }
 */