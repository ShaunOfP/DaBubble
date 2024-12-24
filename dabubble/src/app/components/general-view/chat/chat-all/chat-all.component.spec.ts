import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatAllComponent } from './chat-all.component';

describe('ChatAllComponent', () => {
  let component: ChatAllComponent;
  let fixture: ComponentFixture<ChatAllComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatAllComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChatAllComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
