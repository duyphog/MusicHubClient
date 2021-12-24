import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent implements OnInit {
  title = 'Đăng ký';
  signUpFormGroup: FormGroup;

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    window.document.title = this.title;
    window.document.body.classList.add('bg-info');
    const root = document.getElementsByTagName('html')[0];
    root.style.backgroundColor = '#4cb6cb';
    root.style.color = '#eaf6f9';

    this.signUpFormGroup = this.formBuilder.group({
      firstName: new FormControl('', [
        Validators.required,
        Validators.minLength(2),
      ]),
      lastName: new FormControl('', [
        Validators.required,
        Validators.minLength(2),
      ]),
      username: new FormControl('', [
        Validators.required,
        Validators.minLength(2),
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(2),
      ]),
      email: new FormControl('', [Validators.required, Validators.email]),
    });
  }

  onSubmit(): void {
    if (this.signUpFormGroup.invalid) {
      this.signUpFormGroup.markAllAsTouched();
      return;
    }
  }

  get firstName(): AbstractControl {
    return this.signUpFormGroup.get('firstName');
  }

  get lastName(): AbstractControl {
    return this.signUpFormGroup.get('lastName');
  }

  get email(): AbstractControl {
    return this.signUpFormGroup.get('email');
  }

  get username(): AbstractControl {
    return this.signUpFormGroup.get('username');
  }

  get password(): AbstractControl {
    return this.signUpFormGroup.get('password');
  }
}
