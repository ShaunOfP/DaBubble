import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { NavigationService } from '../../services/navigation.service';

@Component({
  selector: 'app-imprint',
  standalone: true,
  imports: [MatCardModule],
  templateUrl: './imprint.component.html',
  styleUrl: './imprint.component.scss'
})
export class ImprintComponent {
  constructor(private navigationService: NavigationService) {}

  navigateTo(route: string) {
    this.navigationService.navigateTo(route);
  }
}
