import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkspaceMenuCloseButtonComponent } from './workspace-menu-close-button.component';

describe('WorkspaceMenuCloseButtonComponent', () => {
  let component: WorkspaceMenuCloseButtonComponent;
  let fixture: ComponentFixture<WorkspaceMenuCloseButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkspaceMenuCloseButtonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkspaceMenuCloseButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
