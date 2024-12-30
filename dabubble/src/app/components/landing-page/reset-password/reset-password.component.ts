import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { HeaderSectionComponent } from '../header-section/header-section.component';
import { FooterComponent } from '../footer/footer.component';
import { AuthService } from '../../../services/firebase-services/auth.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatInputModule,
    RouterModule,
    HeaderSectionComponent,
    FooterComponent,
  ],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent implements OnInit {
  oobCode: string = '';
  resetPassword: boolean = false;
  errorPassword: boolean = false;
  showMessage: boolean = false;
  passwordForm: FormGroup;
  email: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private authService: AuthService
  ) {
    this.passwordForm = this.fb.group(
      {
        newPassword: ['', [Validators.required, Validators.minLength(6)]],
        confirmedPassword: ['', Validators.required],
      },
      { validators: this.passwordMatchValidator }
    );
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.oobCode = params['oobCode'] || '';
    });
  }

  passwordMatchValidator(group: FormGroup): null {
    const newPassword = group.get('newPassword');
    const confirmedPassword = group.get('confirmedPassword');
    if (!newPassword || !confirmedPassword) return null;
    else if (newPassword.value !== confirmedPassword.value) {
      confirmedPassword.setErrors({ passwordMismatch: true });
    } else {
      confirmedPassword.setErrors(null);
    }
    return null;
  }

  onSubmit(): void {
    if (!this.passwordForm.valid) {
      return;
    }
    if (!this.oobCode) {
      this.showMessage = true
      this.errorPassword = true
      return;
    }
    const newPassword = this.passwordForm.get('newPassword')?.value;
    this.authService
      .verifyCode(this.oobCode)
      .then((email) => {
        this.email = email;
        this.showMessage = true
        this.resetPassword = true;
        return this.authService.resetPassword(this.oobCode, newPassword);
      })
      .then(() => {
          setTimeout(() => {
            this.router.navigate(['/']);
          }, 1000);
       
      })
      .catch(() => {
        this.showMessage = true
        this.errorPassword = true;
      });
  }
}
