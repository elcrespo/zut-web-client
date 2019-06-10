import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { map, distinctUntilChanged, filter, tap, switchMap, catchError, skip } from 'rxjs/operators';
import { Observable, combineLatest, of } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/auth.service';
import { MarriageStatusService } from 'src/app/core/services/marriage-status/marriage-status.service';
import { UserService } from 'src/app/core/services/user/user.service';
import { User } from 'src/app/core/models/user.model';

export interface RegisterState {
  loading: boolean;
  error: boolean;
  success: boolean;
  registerData: User;
  message: String
}

let _state: RegisterState = {
  loading: true,
  success: false,
  error: false,
  message: '',
  registerData: {
    username: '',
    password: '',
    marrieageStatus: '',
    birthdate: ''
  }
}

@Injectable({
  providedIn: 'root'
})
export class RegisterFacadeService {
  private store  = new BehaviorSubject<RegisterState>(_state);
  private state$ = this.store.asObservable();

  loading$ = this.state$.pipe(map(state => state.loading), distinctUntilChanged());
  registerData$ = this.state$.pipe(map(state => state.registerData), distinctUntilChanged());
  error$ = this.state$.pipe(map(state => state.error));
  success$ = this.state$.pipe(map(state => state.success));
  message$ = this.state$.pipe(map(state => state.message));
  marriageStatuses$: Observable<any>;

  vm$: Observable<RegisterState> = combineLatest(
    this.registerData$,
    this.error$,
    this.loading$,
    this.success$,
    this.message$
  ).pipe(
    map(([registerData, error, loading, success, message]) => {
      return {registerData, error, loading, success, message}
    })
  )

  constructor(
    private authService: AuthService,
    private router: Router,
    public marriageStatusService: MarriageStatusService,
    private userService: UserService
  ) {
    this.authService.currentUser$.pipe(
      filter(Boolean)
    ).subscribe(() => {
      this.router.navigate(['/']);
    });

    this.registerData$.pipe(
      skip(1),
      switchMap(data => this.register(data))
    ).subscribe((response: any) => {
      if(response.error) { return;}
      this.updateState({
        ..._state,
        loading: false,
        error: false,
        success: true,
        message: 'Registration successful'
      });
      this.router.navigate(['/user/login']);
    })

    this.marriageStatuses$ = this.marriageStatusService.getAll();



  }

  updateRegisterData(registerData: User) {
    this.updateState({..._state, registerData, loading: true, error: false, success: false})
  }

  private register(data: User) {
    return this.userService.create(data).pipe(
      catchError(error => {
        this.updateState({
          ..._state,
          loading: false,
          error: true,
          success: false,
          message: error.error.message
        })
        return of({error: error.error});
      })
    );
  }
  private updateState(state: RegisterState) {
    this.store.next(_state = state); 
  }
}
