import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/firebase-services/auth.service';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterModule, CommonModule, MatCardModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  animationPlayed: boolean = false;
  newGuest: boolean = false;
  guestId: string = '';

  constructor(
    private router: Router,
    private authService: AuthService,
    private form: FormBuilder
  ) {
    const animation = sessionStorage.getItem('animation');
    this.animationPlayed = animation === 'true';

    this.loginForm = this.form.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  async ngOnInit(): Promise<void> {
    this.guestId = localStorage.getItem('guest-id') as string;
    sessionStorage.setItem('animation', 'true');
    console.log(this.guestId);
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
  }

  async logIn(): Promise<void> {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;

      try {
        await this.authService.signInWithEmail(email, password);
        console.log('Login erfolgreich!');
        /* this.router.navigate(['/general/', this.authService.currentUser?.uid]); */
      } catch (error) {
        console.error('Fehler beim Login:', error);
      }
    } else {
      console.error('Formular ist ungültig!');
    }
  }

  async guestLogIn() {
    try {
      if (this.guestId == null) {
        await this.authService.guestSignIn();
        const newGuestId = this.authService.currentUser?.uid as string;
        localStorage.setItem('guest-id', newGuestId);
      } else {
        /* this.router.navigate(['/general/', this.authService.currentUser?.uid]); */
      }
    } catch (error) {
      console.error('Fehler beim Gast log in:', error);
    }
  }
}
