import { TestBed } from '@angular/core/testing';

import { RegisterFacadeService } from './register-facade.service';

describe('RegisterFacadeService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RegisterFacadeService = TestBed.get(RegisterFacadeService);
    expect(service).toBeTruthy();
  });
});
