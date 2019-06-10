import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { User } from './models/user.model';
import { JwtHelperService } from '@auth0/angular-jwt';

export const LOCAL_STORAGE_USER_KEY = 'currentUser';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<User>;
  private readonly LOCAL_STORAGE_USER_KEY = LOCAL_STORAGE_USER_KEY;
  public currentUser$: Observable<User>;

  constructor(private http: HttpClient, public jwtHelper: JwtHelperService) {
      this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem(this.LOCAL_STORAGE_USER_KEY)));
      this.currentUser$ = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User {
      return this.currentUserSubject.value;
  }

  login(username: string, password: string) {
      return this.http.post<any>(`user/authenticate`, { username, password })
          .pipe(tap(user => {
              // login successful if there's a jwt token in the response
              if (user && user.token) {
                  // store user details and jwt token in local storage to keep user logged in between page refreshes
                  this.setLoggedUserInfo(user, this.LOCAL_STORAGE_USER_KEY);
                  this.currentUserSubject.next(user);
              }
          }));
  }

  logout() {
      // remove user from local storage to log user out
      this.removeLoggedUserInfo(this.LOCAL_STORAGE_USER_KEY);
      this.currentUserSubject.next(null);
  }

  public get isLoggedIn(): boolean {
    const userObject = this.getLoggedUserInfo(this.LOCAL_STORAGE_USER_KEY);
  
    if(!userObject || !userObject.token) {
      return false;
    }

    if(this.jwtHelper.isTokenExpired()) {
      return false;
    }

    return true;
  }

  private getLoggedUserInfo(key: string) {
    return JSON.parse(localStorage.getItem(key));
  }

  private setLoggedUserInfo(user: User, key: string) {
    localStorage.setItem(key, JSON.stringify(user));
  }

  private removeLoggedUserInfo(key: string) {
    localStorage.removeItem(key);
  }
}
