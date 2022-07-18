import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  form = true;
  signupForm:any = FormGroup;
  submitted = false;

  constructor(private fb: FormBuilder) {
    this.signupForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    })
  }

  ngOnInit(): void {
  }

  editEmail(){
    this.form = true;
  }
  createAccount(){
    this.submitted = true;
    // if(!this.signupForm.valid){
    //   return
    // }
    console.log(this.signupForm.value)
    return
    this.form = false;
  }

}
