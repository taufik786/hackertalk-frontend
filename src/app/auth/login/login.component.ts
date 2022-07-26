import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm: any = FormGroup;
  error = false;
  errorType = '';
  alertMsg = '';
  submitted = false;

  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    })
  }

  ngOnInit(): void {
  }

  Login() {
    this.submitted = true;
    if (this.loginForm.invalid) {
      return;
    }
    setTimeout(() => {
      this.error = false;
    }, 3000);
    this.authService.login(this.loginForm.value).subscribe(res => {
      // console.log(res)
    }, err => {
      console.log(err)
      this.error = true;
      this.alertMsg = err.error.message;
      this.errorType = err.error.errType;
    })
  }


}
