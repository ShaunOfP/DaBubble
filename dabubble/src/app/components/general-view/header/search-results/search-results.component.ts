import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FilterService } from '../../../../services/component-services/filter.service';

@Component({
  selector: 'app-search-results',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './search-results.component.html',
  styleUrl: './search-results.component.scss',
})
export class SearchResultsComponent {
  constructor(private filterService: FilterService) {}
}
