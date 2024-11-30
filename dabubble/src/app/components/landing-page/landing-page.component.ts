import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss'
})
export class LandingPageComponent {
  constructor(private router: Router) { }

  ngOnInit(): void {
    // Umleitung zur 'log-in'-Route beim Laden der Landing Page
    this.router.navigate(['log-in']);
  }
}