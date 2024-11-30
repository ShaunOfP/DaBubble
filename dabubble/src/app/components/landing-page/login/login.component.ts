import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  constructor(private router: Router) {}
  logIn(route: string) {
    switch (route) {
      case 'public-chat':
        this.router.navigate(['/general/public-chat']);
        break;
      case 'imprint':
        this.router.navigate(['/imprint']);
        break;
    }
  }

  signIn(){
    this.router.navigate(['/sign-in']);
  }

  forgotPassword(){
    this.router.navigate(['/forgot-password'])
  }
}
