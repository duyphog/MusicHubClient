import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { AuthenticationService } from 'src/app/@services/authentication.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent implements OnInit, OnDestroy {
  title = 'Đăng ký';
  signUpFormGroup: FormGroup;
  private subscriptions: Subscription[] = [];
  showLoading: boolean;


  constructor(
    private formBuilder: FormBuilder,
    private authenticationService: AuthenticationService,
    private  toastr: ToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {
    window.document.title = this.title;
    window.document.body.classList.add('bg-info');
    const root = document.getElementsByTagName('html')[0];
    root.style.backgroundColor = '#4cb6cb';
    root.style.color = '#eaf6f9';

    this.signUpFormGroup = this.formBuilder.group({
      
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

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  onSubmit(user: any): void {
    if (this.signUpFormGroup.invalid) {
      this.signUpFormGroup.markAllAsTouched();
    } else {
      this.showLoading = true;
      this.subscriptions.push(
        this.authenticationService.register(user)
        .pipe(finalize(() => (this.showLoading = false)))
        .subscribe((response: any) => {
          this.router.navigateByUrl('/signin').then(r => this.toastr.success(response.data))
        }, (error) => this.toastr.error(error.error.errorMessage))
      )
    }
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
