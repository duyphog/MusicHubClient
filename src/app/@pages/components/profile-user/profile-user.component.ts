import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AppUserService } from 'src/app/@services/app-user.service';
import { AuthenticationService } from './../../../@services/authentication.service';
import { finalize } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { HttpEvent, HttpEventType } from '@angular/common/http';
import { UserInfo } from 'src/app/@model/user-info.model';
import { AppUtilService } from './../../../@services/app-util.service';

@Component({
  selector: 'app-profile-user',
  templateUrl: './profile-user.component.html',
  styleUrls: ['./profile-user.component.css']
})
export class ProfileUserComponent implements OnInit, OnDestroy {
  
  private subscriptions: Subscription[] = [];

  user: any;
  activeEdit: boolean = false;
  refreshing: boolean;
  fileStatus: any;
  progress: number;
  profileImage: File;
  
  constructor(private authenticationService: AuthenticationService, private userService: AppUserService, private toastr: ToastrService, private appUtilService: AppUtilService) { }

  ngOnInit(): void {
    this.user = this.authenticationService.getUserInfoFromLocalCache();
  }

  onActiveEdit(): void {
    this.activeEdit = true;
  }

  onCancelEdit(): void {
    this.activeEdit = false;
  }

  updateProfileImage(): void {
    document.getElementById("profile-image-input").click();
  }

  onEditUser(ngForm: NgForm): void {
    this.refreshing = true;
    const formData = this.userService.createUserFormData(this.user.userId, this.authenticationService.getLoggedInUsername(), ngForm.value);
    let userUpdate = this.appUtilService.convertFormDataToJSON((formData));
    userUpdate['userId'] = +userUpdate['userId'];
    this.subscriptions.push(this.userService.updateUser(userUpdate)
    .pipe(finalize(() => { this.refreshing = false; }))
    .subscribe(
      (response: any) => {
        userUpdate['avatarImg'] = this.user.avatarImg;
        this.authenticationService.addUserInfoToLocalCache(userUpdate);
        this.toastr.success(`${userUpdate.username} has been updated successfully`)
        this.activeEdit = false;
      }, (error: any) => {
        this.toastr.error(error.error.errorMessage);
      }
    ));
  }

  onProfileImageChange(event: any): void {
    this.profileImage = event.target.files[0];
  }

  onUpdateProfileImage(): void {
    const formData = new FormData();
    this.progress = 0;
    formData.append('profileImage', this.profileImage);

    this.subscriptions.push(this.userService.updateProfileImage(formData)
        .pipe(finalize(() => {this.refreshing = false; this.profileImage = null; }))
        .subscribe(
          (event: any) => {
                if (event.type === HttpEventType.UploadProgress) {
                  this.progress = Math.round(100 * event.loaded / event.total);
                } else if (event.type === HttpEventType.Response) {
                  if (event.status === 200) {
                    this.user.avatarImg = `${event.body.data}?time=${new Date().getTime()}`;
                    this.appUtilService.addToLocalCache("user", this.user);
                    this.toastr.success('Image has been updated successfully');
                  } else {
                    this.toastr.error(`Unable to upload profile image. Please try again`);
                  }
                }
              }, error => this.toastr.error(error.error.errorMessage)
    ));
  }


  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

}
