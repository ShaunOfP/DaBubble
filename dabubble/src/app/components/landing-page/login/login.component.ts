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

  navigateTo(route: string) {
    switch (route) {
      case 'public-chat':
        this.router.navigate(['/general/public-chat']);
        break;
      case 'imprint':
        this.router.navigate(['/imprint']);
        break;
      case 'sign-in':
        this.router.navigate(['/sign-in']);
        break;
      case 'forgot-password':
        this.router.navigate(['/forgot-password']);
        break;
    }
  }
}
