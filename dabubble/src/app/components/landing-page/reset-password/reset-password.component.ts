import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgForm} from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, FormsModule, MatCardModule, MatInputModule, RouterModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss'
})
export class ResetPasswordComponent {
  confirmPassword = {
    newPassword: "",
    confirmedPassword: "",
  }
  onSubmit(ngForm: NgForm){
    if(ngForm.valid && ngForm.submitted){ console.log('neues Passwort:' , this.confirmPassword.newPassword);}
   
    
  }
}
