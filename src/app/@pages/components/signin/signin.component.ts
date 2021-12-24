import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {
	title = 'Đăng nhập';
  signInFormGroup: FormGroup;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit(): void {
		window.document.title = this.title;
		window.document.body.classList.add('bg-info');
		const root = document.getElementsByTagName('html')[0];
		root.style.backgroundColor = "#4cb6cb";
		root.style.color = "#eaf6f9";

    this.signInFormGroup = this.formBuilder.group({
      username: new FormControl('', [
        Validators.required
      ]),
      password: new FormControl('', [
        Validators.required
      ])
    });
  }

  onSubmit(): void {
    if (this.signInFormGroup.invalid) {
      this.signInFormGroup.markAllAsTouched();
      return;
    }
  }

  get username(): AbstractControl {
    return this.signInFormGroup.get('username');
  }

  get password(): AbstractControl {
    return this.signInFormGroup.get('password');
  }

}
