import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllSelectedMembersComponent } from './all-selected-members.component';

describe('AllSelectedMembersComponent', () => {
  let component: AllSelectedMembersComponent;
  let fixture: ComponentFixture<AllSelectedMembersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllSelectedMembersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllSelectedMembersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
