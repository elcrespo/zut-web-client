import { TestBed } from '@angular/core/testing';

import { RulingService } from './ruling.service';

describe('RulingService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RulingService = TestBed.get(RulingService);
    expect(service).toBeTruthy();
  });
});
