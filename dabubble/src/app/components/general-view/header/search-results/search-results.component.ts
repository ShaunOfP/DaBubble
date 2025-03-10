import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FilterService } from '../../../../services/component-services/filter.service';

@Component({
  selector: 'app-search-results',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './search-results.component.html',
  styleUrl: './search-results.component.scss',
})
export class SearchResultsComponent implements OnInit {
  @Input() inputSearch!: string;
  @Output() closeClicked = new EventEmitter<void>();

  channelResults: any[] = [];
  memberResults: any[] = [];

  constructor(private filterService: FilterService) {}

  ngOnInit(): void {
    this.filterService.channelMatch$.subscribe((channels) => {
      this.channelResults = channels;
    });
    this.filterService.memberMatch$.subscribe((members) => {
      this.memberResults = members;
    });
  }

  onCloseClick() {
    this.closeClicked.emit();
    this.filterService.resetSearchResults();
  }
}
