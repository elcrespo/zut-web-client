import { TestBed } from '@angular/core/testing';

import { LoginFacadeService } from './login-facade.service';

describe('LoginFacadeService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LoginFacadeService = TestBed.get(LoginFacadeService);
    expect(service).toBeTruthy();
  });
});
