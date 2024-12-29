// import { CommonModule } from '@angular/common';
// import { Component, OnInit } from '@angular/core';
// import { FormsModule, NgForm } from '@angular/forms';
// import { MatCardModule } from '@angular/material/card';
// import { MatInputModule } from '@angular/material/input';
// import { ActivatedRoute, RouterModule, Router } from '@angular/router';
// import { getAuth, confirmPasswordReset } from 'firebase/auth';
// import { HeaderSectionComponent } from "../header-section/header-section.component";
// import { FooterComponent } from "../footer/footer.component";

// @Component({
//   selector: 'app-reset-password',
//   standalone: true,
//   imports: [
//     CommonModule,
//     FormsModule,
//     MatCardModule,
//     MatInputModule,
//     RouterModule,
//     HeaderSectionComponent,
//     FooterComponent
// ],
//   templateUrl: './reset-password.component.html',
//   styleUrls: ['./reset-password.component.scss'],
// })
// export class ResetPasswordComponent implements OnInit {
//   oobCode: string = '';
//   resetPassword:boolean = false
//   Passwords = {
//     newPassword: '',
//     confirmedPassword: ''
//   };

//   constructor(private route: ActivatedRoute, private router: Router) {}

//   ngOnInit(): void {
//     this.route.queryParams.subscribe((params) => {
//       this.oobCode = params['oobCode'] || '';
      
//       if (!this.oobCode) {
//         alert('Ungültiger oder abgelaufener Link. Bitte fordere einen neuen Link an.');
//       }
//     });
//   }

//   onSubmit(ngForm: NgForm): void {
//     if (this.formValidation(ngForm)) {
//       this.resetUserPassword();
//     } else {
//       alert('Bitte stelle sicher, dass alle Felder korrekt ausgefüllt sind und die Passwörter übereinstimmen.');
//     }
//   }

//   formValidation(ngForm: NgForm) {
//     return (
//       ngForm.valid && 
//       ngForm.submitted && 
//       this.Passwords.newPassword === this.Passwords.confirmedPassword && 
//       this.Passwords.newPassword.length >= 6 
//     );
//   }

//   resetUserPassword(): void {
//     if (!this.oobCode) {
//       alert('Ungültiger oder abgelaufener Link. Bitte fordere einen neuen Link an.');
//       return;
//     }

//     const auth = getAuth();
//     confirmPasswordReset(auth, this.oobCode, this.Passwords.newPassword)
//       .then(() => {
//         this.resetPassword = true
//         setTimeout(() => {
//           this.router.navigate(['/'])
//         }, 1000);
//       })
//       .catch((error) => {
//         alert(`Fehler beim Zurücksetzen des Passworts: ${error.message}`);
//       });
//   }
// }

import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { getAuth, updatePassword } from 'firebase/auth';
import { HeaderSectionComponent } from "../header-section/header-section.component";
import { FooterComponent } from "../footer/footer.component";

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
    FooterComponent
  ],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent implements OnInit {
  oobCode: string = '';
  resetPassword: boolean = false;
  passwordForm: FormGroup;

  constructor(private route: ActivatedRoute, private router: Router, private fb: FormBuilder) {
    this.passwordForm = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmedPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.oobCode = params['oobCode'] || '';
    });
  }

  passwordMatchValidator(group: FormGroup): null {
    const newPassword = group.get('newPassword');
    const confirmedPassword = group.get('confirmedPassword');
    if (!newPassword || !confirmedPassword)  return null;
    else if (newPassword.value !== confirmedPassword.value) {
      confirmedPassword.setErrors({ passwordMismatch: true }); 
    } else {
      confirmedPassword.setErrors(null); 
    }  
    return null; 
  }
  

  onSubmit(): void {
    if (this.passwordForm.valid) {
      this.resetUserPassword();
    } else {
      alert('Bitte stelle sicher, dass alle Felder korrekt ausgefüllt sind und die Passwörter übereinstimmen.');
    }
  }

  resetUserPassword(): void {
    if (!this.oobCode) {
      alert('Ungültiger oder abgelaufener Link. Bitte fordere einen neuen Link an.');
      return;
    }
   }
}
