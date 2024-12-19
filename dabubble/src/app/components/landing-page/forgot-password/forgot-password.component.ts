import { CommonModule } from '@angular/common';
import { Component} from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../services/firebase-services/auth.service';
import { HeaderSectionComponent } from "../header-section/header-section.component";
import { FooterComponent } from "../footer/footer.component";
@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [
    MatCardModule,
    MatInputModule,
    RouterModule,
    FormsModule,
    CommonModule,
    HeaderSectionComponent,
    FooterComponent,
    ReactiveFormsModule
],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss',
})
export class ForgotPasswordComponent {
  constructor(private authService: AuthService) {}
  emailForm:FormControl = new FormControl('', [
    Validators.required,
    Validators.email,
    Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
  ])

  submitForm: boolean = false;
  sendPassword: boolean = false;
  sendingError: boolean = false
  errorCode:string = ''
  errorMessage: string = ''

  onSubmit() {
    if (this.emailForm.valid) {
      this.authService.resetPasswordLink(this.emailForm.value, () => {
        this.sendPassword = true;
      }, (errorCode: string , errorMessage: string) => {
        this.sendingError = true;
        this.errorCode = errorCode;
        this.errorMessage= errorMessage;
      });
    }
  }
}
