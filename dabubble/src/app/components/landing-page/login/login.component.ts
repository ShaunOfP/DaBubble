import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [],
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
}
