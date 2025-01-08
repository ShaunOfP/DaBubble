import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMembersToNewChannelComponent } from './add-members-to-new-channel.component';

describe('AddMembersToNewChannelComponent', () => {
  let component: AddMembersToNewChannelComponent;
  let fixture: ComponentFixture<AddMembersToNewChannelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddMembersToNewChannelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddMembersToNewChannelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
