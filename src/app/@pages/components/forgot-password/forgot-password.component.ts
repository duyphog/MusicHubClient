import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { AppUserService } from 'src/app/@services/app-user.service';
import { AuthenticationService } from 'src/app/@services/authentication.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {
  
  title = 'Quên mật khẩu';
  forgotPasswordFormGroup: FormGroup;

  showLoading: boolean;

  private subscriptions: Subscription[] = [];

  constructor(private formBuilder: FormBuilder, private router: Router, private authenticationService: AuthenticationService, private toastr: ToastrService, private appUserService: AppUserService) { }

  ngOnInit(): void {
		window.document.title = this.title;
		window.document.body.classList.add('bg-info');
		const root = document.getElementsByTagName('html')[0];
		root.style.backgroundColor = "#4cb6cb";
		root.style.color = "#eaf6f9";

    this.forgotPasswordFormGroup = this.formBuilder.group({
      email: new FormControl('', [
        Validators.required, Validators.email
      ])
    });
  }

  onSubmit(user: any): void {
    if (this.forgotPasswordFormGroup.invalid) {
      this.forgotPasswordFormGroup.markAllAsTouched();
    } else {
      this.showLoading = true;
      this.subscriptions.push(
        this.authenticationService.resetPassword(user.email)
        .pipe(finalize(() => (this.showLoading = false)))
        .subscribe((response: any) => {
          this.router.navigate(['/signin']).then(r => this.toastr.success(response.data));
          
        }, (error) =>  { 
          // console.log(error);
          this.toastr.error(error.error.errorMessage)
        })
      )
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  get email(): AbstractControl {
    return this.forgotPasswordFormGroup.get('email');
  }
}
