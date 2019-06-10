import { Injectable } from '@angular/core';
import { AuthService } from 'src/app/core/auth.service';
import { Observable, of, BehaviorSubject, combineLatest } from 'rxjs';
import { catchError, map, distinctUntilChanged, filter, switchMap } from 'rxjs/operators';
import { User } from 'src/app/core/models/user.model';
import { Router } from '@angular/router';

export interface LoginData {
  username: string;
  password: string;
}

export interface LoginState {
  loading: boolean;
  error: boolean;
  user: User;
  loginData: {
    username: string;
    password: string;
  }
}

let _state: LoginState = {
  loading: false,
  error: false,
  user: {
    username: '',
    marrieageStatus: '',
    birthdate: '',
    token: ''
  },
  loginData: {
    username: '',
    password: ''
  }
}

@Injectable({
  providedIn: 'root'
})
export class LoginFacadeService {
  private store  = new BehaviorSubject<LoginState>(_state);
  private state$ = this.store.asObservable();

  user$ = this.state$.pipe(map(state => state.user), distinctUntilChanged());
  token$ = this.user$.pipe(map(user => user.token), distinctUntilChanged());
  loading$ = this.state$.pipe(map(state => state.loading), distinctUntilChanged());
  loginData$ = this.state$.pipe(map(state => state.loginData), distinctUntilChanged());
  error$ = this.state$.pipe(map(state => state.error));

  vm$: Observable<LoginState> = combineLatest(
    this.user$,
    this.loginData$,
    this.error$,
    this.loading$
  ).pipe(
    map(([user, loginData, error, loading]) => {
      return {user, loginData, error, loading}
    })
  )

  constructor(
    private authService: AuthService,
    private router: Router
    ) {
    this.loginData$.pipe(
      filter(data => {
        return data.password.length > 0 && data.username.length > 0;
      }),
      switchMap(data => this.login(data))
    ).subscribe(userData => {
      this.updateState({..._state, user: userData, loading: false})
    });

    this.authService.currentUser$.pipe(
      filter(Boolean)
    ).subscribe(() => {
      this.router.navigate(['/']);
    });
  }

  updateLoginData(loginData: LoginData) {
    this.updateState({..._state, loginData, loading: true, error: false})
  }

  private login(data: LoginData): Observable<any> {
    return this.authService.login(data.username, data.password)
    .pipe(
      catchError(error => {
        this.updateState({..._state, loading: false, error: true})
        return of({});
      })
    )
  }

  private updateState(state: LoginState) {
    this.store.next(_state = state); 
  }
}
