import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';

export interface DataLogin {
  username: string;
  password: string;
}

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss']
})
export class LoginFormComponent implements OnInit {
  loginForm: FormGroup;
  // convenience getter for easy access to form fields
  get f(): {[key: string]: AbstractControl} { return this.loginForm.controls; }
  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.initFormGroup();
  }

  initFormGroup() {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  getLoginFormGroup(): FormGroup {
    return this.loginForm;
  }

  getData() {
    return {
      username: this.loginForm.controls.username.value,
      password: this.loginForm.controls.password.value
    }
  }
}
