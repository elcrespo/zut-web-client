import { TestBed } from '@angular/core/testing';

import { MarriageStatusService } from './marriage-status.service';

describe('MarriageStatusService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MarriageStatusService = TestBed.get(MarriageStatusService);
    expect(service).toBeTruthy();
  });
});
