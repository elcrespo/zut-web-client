import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { JwtModule } from '@auth0/angular-jwt';
import { FlexLayoutModule } from '@angular/flex-layout';
import { StorageModule } from '@ngx-pwa/local-storage';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { UserModule } from './modules/user/user.module';
import { AppConfigService } from './core/services/app-config.service';
import { httpInterceptorProviders } from "./interceptors";
import { LOCAL_STORAGE_USER_KEY } from './core/auth.service';

export function tokenGetter() {
  const currentUserInfo = JSON.parse(localStorage.getItem(LOCAL_STORAGE_USER_KEY));
  return currentUserInfo ? currentUserInfo.token: null;
}

export function initializeApp(appConfig: AppConfigService ) {
  return () => appConfig.load();
}

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent
  ],
  imports: [
    StorageModule.forRoot({
      IDBNoWrap: true,
    }),
    BrowserModule,
    AppRoutingModule,
    FlexLayoutModule,
    HttpClientModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter
      }
    }),
    UserModule
  ],
  providers: [
    AppConfigService,
    { provide: APP_INITIALIZER,
      useFactory: initializeApp,
      deps: [AppConfigService], multi: true 
    },
    httpInterceptorProviders
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
