import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/firebase-services/auth.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

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

  private userCount: number | undefined;
  private guestLogin: string | null | undefined;


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
    this.guestLogin = localStorage.getItem('guestLogin');
    sessionStorage.setItem('animation', 'true');
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
        const uid = this.authService.getUid();
        console.log(uid);
      } catch (error) {
        console.error('Fehler beim Login:', error);
      }
    } else {
      console.error('Formular ist ungültig!');
    }
  }

/*   logInGuest() {
    if (this.guestLogin === 'true') {
      console.log('log in as guest');
    } else {
      this.createGuestUser();
    }
  } */

/*   async createGuestUser() {
    this.userCount = Math.floor(Math.random() * 1000000) + 1;
    console.log(this.userCount);
    try {
      const guestUser = {
        name: `Gast${this.userCount}`,
        mail: `guest_${this.userCount}@example.com`,
        password: `guestUser${this.userCount}`,
      };
      this.checkGuestUser(guestUser);
    } catch (err) {
      console.error('Fehler beim Gast-Login:', err);
      throw err;
    }
  } */

/*   async checkGuestUser(guestUser: {
    name: string;
    mail: string;
    password: string;
  }) {
    if (await this.checkExistingGuest(guestUser)) {
      await this.userService.saveUser(guestUser);
      localStorage.setItem('mail', guestUser.mail);
      localStorage.setItem('password', guestUser.password);
      localStorage.setItem('guestLogin', 'true');
    } else {
      this.createGuestUser();
    }
  } */

/*   async checkExistingGuest(userData: {
    name?: string;
    mail: string;
    password?: string;
  }): Promise<boolean> {
  

    try {
      const user = this.users.find((u) => u.mail === userData.mail);
      return !user;
    } catch (error) {
      console.error('Fehler bei der Gastbenutzerüberprüfung:', error);
      throw error;
    }
  } */
}
