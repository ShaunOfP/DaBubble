import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DmReactionsComponent } from './dm-reactions.component';

describe('DmReactionsComponent', () => {
  let component: DmReactionsComponent;
  let fixture: ComponentFixture<DmReactionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DmReactionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DmReactionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
