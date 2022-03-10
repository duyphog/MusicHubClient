import { Component, OnInit, OnDestroy } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from 'src/app/@services/authentication.service';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AppUserService } from 'src/app/@services/app-user.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit, OnDestroy {
	title = 'Đăng nhập';
  signInFormGroup: FormGroup;

  showLoading: boolean;

  private subscriptions: Subscription[] = [];

  constructor(private formBuilder: FormBuilder, private router: Router, private authenticationService: AuthenticationService, private toastr: ToastrService, private appUserService: AppUserService) { }

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

  onSubmit(user: any): void {
    if (this.signInFormGroup.invalid) {
      this.signInFormGroup.markAllAsTouched();
    } else {
      this.showLoading = true;
      this.subscriptions.push(
        this.authenticationService.login(user)
        .pipe(finalize(() => (this.showLoading = false)))
        .subscribe((response: any) => {
          this.authenticationService.saveToken(response.data.token);
          this.appUserService.getTrackLiked().subscribe((res: any) => {
            this.appUserService.addTrackLikedToLocalCache(res.data);
          });
          this.appUserService.getUserInfo(response.data.userId).subscribe((userInfo: any) => this.authenticationService.addUserInfoToLocalCache(userInfo.data));
          this.router.navigate(['/home']).then(r => this.toastr.success("Login successfully!"));
          
        }, (error) => this.toastr.error(error.error.errorMessage))
      )
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  get username(): AbstractControl {
    return this.signInFormGroup.get('username');
  }

  get password(): AbstractControl {
    return this.signInFormGroup.get('password');
  }

}
