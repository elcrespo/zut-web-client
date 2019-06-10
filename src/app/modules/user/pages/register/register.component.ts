import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Observable } from 'rxjs';
import { RegisterFacadeService } from './register-facade.service';
import { RegisterFormComponent } from '../../components/register-form/register-form.component';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements AfterViewInit {
  @ViewChild(RegisterFormComponent, { static: false }) registerFormComponent: RegisterFormComponent;
  formIsValid$: Observable<boolean>;
  constructor(public registerFacadeService: RegisterFacadeService) { }
  success$ = this.registerFacadeService.success$;
  error$ = this.registerFacadeService.error$;
  message$ = this.registerFacadeService.message$;
  loading$ = this.registerFacadeService.loading$;

  ngAfterViewInit() {
    this.formIsValid$ = this.registerFormComponent
                          .getRegisterFormGroup()
                          .statusChanges
                          .pipe(
                            map((status => status === 'VALID'))
                          );
  }

  onSubmit() {
    this.registerFacadeService.updateRegisterData(this.registerFormComponent.getData());
  }

}
