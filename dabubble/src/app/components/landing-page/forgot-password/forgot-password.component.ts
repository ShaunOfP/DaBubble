import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../services/firebase-services/auth.service';
@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [
    MatCardModule,
    MatInputModule,
    RouterModule,
    FormsModule,
    CommonModule,
  ],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss',
})
export class ForgotPasswordComponent {
  constructor(private authService: AuthService) {}

  email: string = '';
  submitForm: boolean = false;
  sendPassword: boolean = false;
  sendingError: boolean = false
  errorCode:string = ''
  errorMessage: string = ''

  onSubmit(ngForm: NgForm) {
    if (ngForm.submitted && ngForm.form.valid) {
      this.authService.resetPasswordLink(this.email, () => {
        this.sendPassword = true;
      }, (errorCode: string , errorMessage: string) => {
        this.sendingError = true;
        this.errorCode = errorCode;
        this.errorMessage= errorMessage;
      });
    }
  }
}
