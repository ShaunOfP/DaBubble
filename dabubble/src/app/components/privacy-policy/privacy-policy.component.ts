import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { RouterModule } from '@angular/router';
import { HeaderSectionComponent } from "../landing-page/header-section/header-section.component";

@Component({
  selector: 'app-privacy-policy',
  standalone: true,
  imports: [MatCardModule, RouterModule, HeaderSectionComponent],
  templateUrl: './privacy-policy.component.html',
  styleUrl: './privacy-policy.component.scss'
})
export class PrivacyPolicyComponent {
  constructor() {}

}
