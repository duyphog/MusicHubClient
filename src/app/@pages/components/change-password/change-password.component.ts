import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AppUserService } from 'src/app/@services/app-user.service';
import { finalize } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {

  refreshing: boolean = false;

  constructor(private userService: AppUserService, private toastr: ToastrService) { }

  ngOnInit(): void {
  }

  onChangePassword(ngForm: NgForm): void {
    this.refreshing = true;
    this.userService.changePassword(ngForm.value)
    .pipe(finalize(() => this.refreshing = false))
    .subscribe((response) => {
      this.toastr.success(`${ngForm.value.username} change password successfully`)
      ngForm.reset();
    }, (error) => {
      this.toastr.error(error.error.errorMessage);
    })
  }
}
