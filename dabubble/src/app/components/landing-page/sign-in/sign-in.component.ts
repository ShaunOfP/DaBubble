import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { Router, RouterModule } from '@angular/router';
import { UserDatas } from '../../../models/user.class';
import { HeaderSectionComponent } from "../header-section/header-section.component";

interface InputField {
  placeholder: string;
  icon: string;
  value: string;
  focused: boolean;
  type: string;
  name: string;
}

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    FormsModule,
    MatCheckboxModule,
    RouterModule,
    HeaderSectionComponent
],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.scss',
})
export class SignInComponent {
  accountData: UserDatas = new UserDatas();
  acceptTerms: boolean = false;

  constructor(private router: Router) {}
 
  nameFocused: boolean = false;
  mailFocused: boolean = false;
  passwordFocused: boolean = false;

  onFocus(currentState: boolean, field: string) {
    switch (field) {
      case 'name':
        this.nameFocused = currentState;
        break;
      case 'mail':
        this.mailFocused = currentState;
        break;
      case 'password':
        this.passwordFocused = currentState;
        break;
    }
  }

  onSubmit(ngForm: NgForm) {
    if (ngForm.valid && ngForm.submitted) {
       this.navigateTo('create-avatar');
    }
  }

  navigateTo(route: string) {
    this.router.navigate([route], {
      state: { accountData: this.accountData },
    });
  } 
}

/*   navigateTo(route: string) {
    this.router.navigate([route]);
  } */

    /*this.userService.saveUser(this.accountData); */