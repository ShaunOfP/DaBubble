import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchResultWorkspaceComponent } from './search-result-workspace.component';

describe('SearchResultWorkspaceComponent', () => {
  let component: SearchResultWorkspaceComponent;
  let fixture: ComponentFixture<SearchResultWorkspaceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchResultWorkspaceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchResultWorkspaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
