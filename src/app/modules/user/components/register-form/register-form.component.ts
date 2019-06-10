import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { MarriageStatus } from 'src/app/core/models/marriage-status.model';
import { User } from 'src/app/core/models/user.model';

@Component({
  selector: 'app-register-form',
  templateUrl: './register-form.component.html',
  styleUrls: ['./register-form.component.scss']
})
export class RegisterFormComponent implements OnInit {
  @Input() marriageStatuses: MarriageStatus[] 
  registerForm: FormGroup;
  get f(): {[key: string]: AbstractControl} { return this.registerForm.controls; }
  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.initFormGroup();
  }

  initFormGroup() {
    this.registerForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      birthdate: ['', Validators.required],
      marrieageStatus: ['', Validators.required]
    });
  }

  getRegisterFormGroup(): FormGroup {
    return this.registerForm;
  }

  getData(): User {
    return {
      username: this.registerForm.controls.username.value,
      password: this.registerForm.controls.password.value,
      birthdate: this.registerForm.controls.birthdate.value,
      marrieageStatus: this.registerForm.controls.marrieageStatus.value,
    }
  }

}
