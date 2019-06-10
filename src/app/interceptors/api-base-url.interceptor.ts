import { Injectable } from "@angular/core";
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest
} from "@angular/common/http";

import { Observable, of } from "rxjs";
import { AppConfigService } from '../core/services/app-config.service';

@Injectable()
export class ApiBaseUrlInterceptor implements HttpInterceptor {
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {   
    console.warn("HttpsInterceptor");
    // return next.handle(req);
    if (req.url.includes("assets/config/config")) {
        return next.handle(req);
      }
    const httpsReq = req.clone({ 
        url: AppConfigService.settings.apiServer.baseUrl + req.url 
      });
    /* const httpsReq = req.clone({
      url: req.url.replace("http://", "https://")
    }); */

    return next.handle(httpsReq);
  }
}