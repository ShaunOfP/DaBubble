import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FilterService {

  constructor() { }

  private filterTextSource = new BehaviorSubject<string>('');
  filterText$ = this.filterTextSource.asObservable();

  updateFilter(text: string) {
    this.filterTextSource.next(text);
  }
}
