import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { RouterModule } from '@angular/router';
import { HeaderSectionComponent } from "../landing-page/header-section/header-section.component";
import { FooterComponent } from "../landing-page/footer/footer.component";

@Component({
  selector: 'app-privacy-policy',
  standalone: true,
  imports: [MatCardModule, RouterModule, HeaderSectionComponent, FooterComponent],
  templateUrl: './privacy-policy.component.html',
  styleUrl: './privacy-policy.component.scss'
})
export class PrivacyPolicyComponent {
  constructor() {}

}
