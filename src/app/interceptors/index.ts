import { ApiBaseUrlInterceptor } from './api-base-url.interceptor';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

export const httpInterceptorProviders = [
    { provide: HTTP_INTERCEPTORS, useClass: ApiBaseUrlInterceptor, multi: true }
  ];