import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { UserDatasService } from '../../../services/firebase-services/user-datas.service';

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
    private userService: UserDatasService,
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
      this.userService.updateUserPassword(this.id, this.Passwords.newPassword);
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
