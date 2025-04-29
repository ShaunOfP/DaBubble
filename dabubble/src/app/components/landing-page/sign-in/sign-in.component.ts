import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { Router, RouterModule } from '@angular/router';
import { UserDatas } from '../../../models/user.class';
import { HeaderSectionComponent } from "../header-section/header-section.component";
import { FooterComponent } from "../footer/footer.component";

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    FormsModule,
    MatCheckboxModule,
    RouterModule,
    HeaderSectionComponent,
    FooterComponent
  ],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.scss',
})
export class SignInComponent {
  accountData: UserDatas = new UserDatas();
  acceptTerms: boolean = false;
  nameFocused: boolean = false;
  mailFocused: boolean = false;
  passwordFocused: boolean = false;

  constructor(private router: Router) { }

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


  /**
   * Checks if a string starts with a blankspace
   * @param string name or password
   * @returns Boolean, true or false
   */
  checkForBlankFirst(string: string) {
    if (string != null) {
      if (string.charAt(0) === " ") {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }
  

  isEmpty(string: string){
    if (string == null || string == ""){
      return true;
    } else {
      return false;
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