import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AltHeaderMobileComponent } from './alt-header-mobile.component';

describe('AltHeaderMobileComponent', () => {
  let component: AltHeaderMobileComponent;
  let fixture: ComponentFixture<AltHeaderMobileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AltHeaderMobileComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AltHeaderMobileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
