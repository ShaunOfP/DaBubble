import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { getAuth, confirmPasswordReset } from 'firebase/auth';
import { HeaderSectionComponent } from "../header-section/header-section.component";
import { FooterComponent } from "../footer/footer.component";

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatInputModule,
    RouterModule,
    HeaderSectionComponent,
    FooterComponent
],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent implements OnInit {
  oobCode: string = '';
  Passwords = {
    newPassword: '',
    confirmedPassword: ''
  };

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.oobCode = params['oobCode'] || '';
      
      if (!this.oobCode) {
        alert('Ungültiger oder abgelaufener Link. Bitte fordere einen neuen Link an.');
      }
    });
  }

  onSubmit(ngForm: NgForm): void {
    if (this.formValidation(ngForm)) {
      this.resetUserPassword();
    } else {
      alert('Bitte stelle sicher, dass alle Felder korrekt ausgefüllt sind und die Passwörter übereinstimmen.');
    }
  }

  formValidation(ngForm: NgForm) {
    return (
      ngForm.valid && 
      ngForm.submitted && 
      this.Passwords.newPassword === this.Passwords.confirmedPassword && 
      this.Passwords.newPassword.length >= 6 
    );
  }

  resetUserPassword(): void {
    if (!this.oobCode) {
      alert('Ungültiger oder abgelaufener Link. Bitte fordere einen neuen Link an.');
      return;
    }

    const auth = getAuth();
    confirmPasswordReset(auth, this.oobCode, this.Passwords.newPassword)
      .then(() => {
        alert('Dein Passwort wurde erfolgreich zurückgesetzt. Du kannst dich jetzt mit deinem neuen Passwort anmelden.');
      })
      .catch((error) => {
        alert(`Fehler beim Zurücksetzen des Passworts: ${error.message}`);
      });
  }
}