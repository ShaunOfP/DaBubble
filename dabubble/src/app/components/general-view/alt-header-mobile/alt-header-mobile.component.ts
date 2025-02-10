import { Component } from '@angular/core';

@Component({
  selector: 'app-alt-header-mobile',
  standalone: true,
  imports: [],
  templateUrl: './alt-header-mobile.component.html',
  styleUrl: './alt-header-mobile.component.scss'
})
export class AltHeaderMobileComponent {
  goBackToWorkspaceMenu(){
    this.hideAltHeader();
  }

  hideAltHeader(){
    
  }
}
