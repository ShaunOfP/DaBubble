import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { Router, RouterModule } from '@angular/router';

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
  imports: [CommonModule ,MatCardModule, FormsModule, MatCheckboxModule, RouterModule],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.scss'
})
export class SignInComponent {
  constructor(private router: Router) {}

  navigateTo(route: string) {
    this.router.navigate([route]);
  }

  accountData = {
    name: "",
    mail: "",
    password: "",
  }

  nameFocused: boolean = false;
  mailFocused: boolean = false;
  passwordFocused: boolean = false;

  onFocus(currentState: boolean, field: string){
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

  onSubmit(ngForm: NgForm){
    if(ngForm.valid && ngForm.submitted){
      console.log(this.accountData)
    }
  }

}

