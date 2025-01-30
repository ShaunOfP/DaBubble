import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkspaceStateToggleButtonComponent } from './workspace-state-toggle-button.component';

describe('WorkspaceStateToggleButtonComponent', () => {
  let component: WorkspaceStateToggleButtonComponent;
  let fixture: ComponentFixture<WorkspaceStateToggleButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkspaceStateToggleButtonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkspaceStateToggleButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
