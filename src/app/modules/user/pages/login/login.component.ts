import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { Observable } from 'rxjs';
import { LoginFormComponent } from '../../components/login-form/login-form.component';
import { map } from 'rxjs/operators';
import { LoginFacadeService, LoginState } from './login-facade.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements AfterViewInit  {
  formIsValid$: Observable<boolean>;
  vm$: Observable<LoginState> = this.loginFacade.vm$;

  @ViewChild(LoginFormComponent, { static: false }) loginFormComponent: LoginFormComponent;

  constructor(private loginFacade: LoginFacadeService) { }

  ngAfterViewInit() {
    this.formIsValid$ = this.loginFormComponent
                          .getLoginFormGroup()
                          .statusChanges
                          .pipe(
                            map((status => status === 'VALID'))
                          );
  }

  onSubmit() {
    this.loginFacade.updateLoginData(this.loginFormComponent.getData())
  }

}
