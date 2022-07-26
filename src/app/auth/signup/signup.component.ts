import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnInit {
  form = true;
  signupForm: any = FormGroup;
  submitted = false;
  error = false;
  alertMsg: any;
  errorType: any;
  otp: any = '';
  timer = true;
  timerAlert: any;
  timerLength: any;

  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.signupForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  ngOnInit(): void { }

  editEmail() {
    this.form = true;
    this.error = false;
    this.timerLength = 0;
    this.timer = true;
  }
  createAccount() {
    this.submitted = true;
    if (!this.signupForm.valid) {
      return;
    }
    this.authService.Register(this.signupForm.value).subscribe(
      (res) => {
        console.log(res);
        this.form = false;
        this.error = true;
        this.alertMsg = res.message;
        this.errorType = res.errType;
        this.timerOTP()
        this.timerLength = 30;
      },
      (err) => {
        this.error = true;
        this.alertMsg = err.error.message;
        this.errorType = err.error.errType;

        setTimeout(() => {
          this.error = false;
        }, 3000);
      }
    );
  }

  verifyOTP() {
    this.otp = this.otp.trim();
    if (this.otp == '') {
      this.error = true;
      this.alertMsg = '<strong>Error : </strong>Please Enter One Time Password';
      this.errorType = 'danger';
      return;
    }
    const body = {
      otp: this.otp,
      email: this.signupForm.value.email,
    };

    this.authService.VerifyOTP(body).subscribe(
      (res) => {
        console.log(res);
      },
      (err) => {
        this.error = true;
        this.alertMsg = err.error.message;
        this.errorType = err.error.errType;
      }
    );
  }

  resendOTP() {
    this.timerLength = 30;
    this.authService.Register(this.signupForm.value).subscribe(res => {
      this.timerOTP()
    }, err => {
      console.log(err)
    })
  }

  timerOTP() {
    this.timer = true;
    let clearTimer = setInterval(() => {
      if (this.timerLength <= 0) {
        clearInterval(clearTimer)
        this.timer = false;
      }
      if (this.timerLength < 10) {
        this.timerAlert = '0:' + this.timerLength;
      } else {
        this.timerAlert = '00:' + this.timerLength;
      }
      this.timerAlert;
      this.timerLength--;
    }, 1000)
  }
}
