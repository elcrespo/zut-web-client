import { TestBed } from '@angular/core/testing';

import { HomeFacadeService } from './home-facade.service';

describe('HomeFacadeService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: HomeFacadeService = TestBed.get(HomeFacadeService);
    expect(service).toBeTruthy();
  });
});
