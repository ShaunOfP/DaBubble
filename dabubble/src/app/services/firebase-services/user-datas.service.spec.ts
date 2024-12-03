import { TestBed } from '@angular/core/testing';

import { UserDatasService } from './user-datas.service';

describe('UserDatasService', () => {
  let service: UserDatasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserDatasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
