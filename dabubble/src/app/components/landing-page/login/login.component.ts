import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/firebase-services/auth.service';
import { UserDatas } from '../../../models/user.class';
import { UserDatasService } from '../../../services/firebase-services/user-datas.service';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    MatCardModule,
    ReactiveFormsModule,
    FooterComponent,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  animationPlayed: boolean = false;
  newGuest: boolean = false;
  user: UserDatas = new UserDatas();
  guestId: string = '';

  constructor(
    private router: Router,
    private authService: AuthService,
    private userService: UserDatasService,
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
    sessionStorage.setItem('animation', 'true');
    console.log(this.guestId);
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
  }

  async logIn(): Promise<void> {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      console.log(this.loginForm.value.mail);

      try {
        await this.authService.signInWithEmail(email, password);
        console.log('Login erfolgreich!');
        /* this.router.navigate(['/general/', this.authService.currentUser?.uid]); */
      } catch (error) {
        console.error('Fehler beim Login:', error);
      }
    } else {
      console.error('Formular ist ungültig!');
      this.loginForm.markAllAsTouched();
    }
  }

  async guestLogIn() {
    try {
      await this.authService.guestSignIn();
      const guestUser = this.authService.currentUser;
      if (guestUser) {
        /* await this.userService.saveUser('Gast', '', guestUser.uid); */
      }
      /* this.router.navigate(['/general/', this.authService.currentUser?.uid]); */
    } catch (error) {
      console.error('Fehler beim Gast log in:', error);
    }
  }

  async googleLogIn() {
    try {
      await this.authService.googleSignIn();
      console.log('Erfolgreich mit Google eingelogt');
      /* this.router.navigate(['create-avatar']); */
      const googleUser = this.authService.currentUser;
      console.log(this.user);
      if (googleUser) {
        const newUser: UserDatas = new UserDatas({
          name: googleUser.displayName ?? '',
          mail: googleUser.email ?? '',
          password: '', 
          accountImg: googleUser.photoURL ?? 'default-avatar',
          channels: ['ER84UOYc0F2jptDjWxFo'], 
          privateChats: [], 
          online: false
        });
        await this.userService.saveUser(newUser, googleUser.uid);
      }
    } catch (error) {
      console.error('Google Log In fehlgeschlagen.', error);
    }
  }

  get email() {
    return this.loginForm.get('email')!;
  }

  get password() {
    return this.loginForm.get('password')!;
  }
}
