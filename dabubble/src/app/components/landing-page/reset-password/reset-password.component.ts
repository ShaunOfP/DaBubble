import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/firebase-services/auth.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatInputModule,
    RouterModule,
  ],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss',
})
export class ResetPasswordComponent {
  id: string = '';
  constructor(
    private authService: AuthService,
    private route: ActivatedRoute
  ) {}

  Passwords = {
    newPassword: '',
    confirmedPassword: '',
  };
  onSubmit(ngForm: NgForm) {
    if (this.formValidation(ngForm)) {
      this.route.params.subscribe((params) => {
        this.id = params['id'];
      });
      this.authService.changeUserPassword(this.Passwords.newPassword);
    }
  }

  formValidation(ngForm: NgForm) {
    return (
      ngForm.valid &&
      ngForm.submitted &&
      this.Passwords.newPassword === this.Passwords.confirmedPassword
    );
  }
}
