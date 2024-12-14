import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { RouterModule } from '@angular/router';
import { HeaderSectionComponent } from "../landing-page/header-section/header-section.component";

@Component({
  selector: 'app-imprint',
  standalone: true,
  imports: [MatCardModule, RouterModule, HeaderSectionComponent],
  templateUrl: './imprint.component.html',
  styleUrl: './imprint.component.scss',
})

export class ImprintComponent {
  constructor() {}
}
