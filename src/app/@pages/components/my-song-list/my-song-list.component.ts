import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AuthenticationService } from 'src/app/@services/authentication.service';
import { PlaylistService } from './../../../@services/playlist.service';
import { CommonService } from './../../../@services/common.service';
import { Category } from 'src/app/@model/category.model';
import { Genre } from 'src/app/@model/genre.model';
import { Playlist } from './../../../@model/playlist.model';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormControl, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { AppUserService } from 'src/app/@services/app-user.service';
import { debounceTime } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';
import { PlaylistType } from './../../../@model/playlist-type.model';

@Component({
  selector: 'app-my-song-list',
  templateUrl: './my-song-list.component.html',
  styleUrls: ['./my-song-list.component.css'],
})
export class MySongListComponent implements OnInit {
  user: any;
  selectAll: boolean = false;
  chooseOption: boolean = false;
  chooseOptionPlaylist: boolean = false;
  chooseOptionSong: boolean[] = [];
  chooseOptionAlbum: boolean = false;
  listPlaylist: Playlist[] = [];

  songList: any[] = [
    {
      srcImg: "https://photo-resize-zmp3.zadn.vn/w94_r1x1_webp/avatars/6/7/67d14814930023cf3b56146571cd8d72_1399966280.jpg",
      name: "Ai Ai Ai",
      artist: "La Thăng New"
    },
    {
      srcImg: "https://photo-resize-zmp3.zadn.vn/w94_r1x1_webp/avatars/6/7/67d14814930023cf3b56146571cd8d72_1399966280.jpg",
      name: "Ai Ai Ai",
      artist: "La Thăng New"
    }
  ];
  songSelected: any[] = [];

  constructor(
    private authenticationService: AuthenticationService,
    public dialog: MatDialog,
    private playlistService: PlaylistService,
    private toastr: ToastrService,
    private appUserService: AppUserService
  ) {}

  ngOnInit(): void {
    this.user = this.authenticationService.getUserInfoFromLocalCache();
    this.listPlaylistByUser();
    this.playlistService.listPlaylist$.subscribe(res => {
      this.listPlaylist = res;
    });
  }

  listPlaylistByUser(): void {
    this.playlistService.getPlaylistByUserId(this.user.userId).subscribe(res => {
      this.playlistService.listPlaylist.next(res.data);
    });
  }

  likedTrack(id: number) {
    if (this.appUserService.checkExistTrackInTrackLikedList(id)) {
      this.appUserService.updateWhiteList({ trackId: id, isAdd: false }).subscribe((response: any) => {
        this.appUserService.updateTrackLikedFromLocalCache({ trackId: id, isAdd: false });
        this.toastr.success('Đã xóa khỏi danh sách yêu thích');
      });  
    } else {
      this.appUserService.updateWhiteList({ trackId: id, isAdd: true }).subscribe((response: any) => {
        this.appUserService.updateTrackLikedFromLocalCache({ trackId: id, isAdd: true });
        this.toastr.success('Đã thêm vào danh sách yêu thích');
      });
    }
 }

  openAddNewPlaylist() {
    this.dialog.open(AddNewPlaylist);
  }

  openChooseOption(): void {
    this.chooseOption = !this.chooseOption;
  }

  openChooseOptionPlaylist(): void {
    this.chooseOptionPlaylist = !this.chooseOptionPlaylist;
  }

  openChooseOptionSong(index): void {
    this.chooseOptionSong[index] = !this.chooseOptionSong[index];
  }
  
  openChooseOptionAlbum(): void {
    this.chooseOptionAlbum = !this.chooseOptionAlbum;
  }

  selectedSong(item: any, index): void {

    if (item.className.includes("select-item")) {
      if (item.className.includes("is-selected")){
        item.classList.remove("is-selected");
        this.songSelected.splice(this.songSelected.indexOf(item.id), 1);
      } else {
        this.songSelected.push(item.id);
        item.classList.add("is-selected");
      }
    }
  }

  selectAllSong(): void {
    this.selectAll = !this.selectAll;
    var element = document.getElementsByName("select-song");
    var inputCheckbox: any = document.getElementsByName("checkbox-song");

    if (this.selectAll) {
      element.forEach(item => item.classList.add("is-selected"));
      inputCheckbox.forEach(item => item.checked = true);
      this.songList.forEach(song => this.songSelected.push(song.id));
    } else {
      element.forEach(item => item.classList.remove("is-selected"));
      inputCheckbox.forEach(item => item.checked = false);
      this.songSelected = [];
    }
  }
 
}

@Component({
  selector: 'add-new-playlist',
  templateUrl: 'add-new-playlist.html',
  styleUrls: ['./my-song-list.component.css'],
})

export class AddNewPlaylist implements OnInit{

  allowAdd: boolean = false;
  user: any;
  listGenre: Genre[] = [];
  listCategory: Category[] = [];
  listPlaylistType: PlaylistType[] = [
    { id: 1, name: "Romance" },
    { id: 2, name: "Sleep" },
    { id: 3, name: "Gym" },
    { id: 4, name: "Dance" },
    { id: 5, name: "Work" },
    { id: 6, name: "Coffee" },
    { id: 7, name: "Game" },
  ];
  addNewPlaylistFormGroup: FormGroup;
  // listPlaylist: Playlist[] = [];

  @ViewChild('listPlaylist') listPlaylist: Playlist[];

  constructor(
    public dialog: MatDialog,
    private playlistService: PlaylistService,
    private commonService: CommonService,
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
    private authenticationService: AuthenticationService,
  ) {

    this.addNewPlaylistFormGroup = this.formBuilder.group({
      'name': new FormControl('', [
        Validators.required,
      ]),
      'categoryId': new FormControl(0, [
        Validators.required,
        Validators.min(1)
      ]),
      'genreId': new FormControl(0, [
        Validators.required,
        Validators.min(1)
      ]),
      'playlistTypeId': new FormControl(0, [
        Validators.required,
        Validators.min(1)
      ]),
      'description': new FormControl('', []),
      'imgFile': new FormControl('', []),
    });
  }

  ngOnInit(): void {
    this.commonService.listGenre().subscribe((res: any) => {
      this.listGenre = res.data;
    });

    this.commonService.listCategory().subscribe((res: any) => {
      this.listCategory = res.data;
    });

    this.user = this.authenticationService.getUserInfoFromLocalCache();

  }

  closeAddNewPlaylist() {
    this.dialog.closeAll();
  }

  onAddNewPlaylist(playlistCreate: any) {

    const data = {
      name: playlistCreate.name,
      genreId: playlistCreate.genreId,
      categoryId: playlistCreate.categoryId,
      description: playlistCreate.description,
      playlistTypeId: playlistCreate.playlistTypeId,
      imgFile: playlistCreate.imgFile
    }

    if (this.addNewPlaylistFormGroup.invalid) {
      this.addNewPlaylistFormGroup.markAllAsTouched();
    } else {      
      const formData = this.playlistService.createPlaylistFormData(data);
      this.playlistService.createPlaylist(formData).subscribe((response: any) => {
        this.listPlaylistByUser();
        this.toastr.success("Thêm playlist thành công");
      }, (error : any) => {
        this.toastr.error(error.error.errorMessage);
      });
      this.dialog.closeAll();
    }
  }

  listPlaylistByUser(): void {
    this.playlistService.getPlaylistByUserId(this.user.userId).subscribe(res => {
      this.playlistService.listPlaylist.next(res.data);
    });
  }

  get name(): AbstractControl {
    return this.addNewPlaylistFormGroup.get('name');
  }

  get categoryIdPlaylist(): AbstractControl {
    return this.addNewPlaylistFormGroup.get('categoryId');
  }

  get genreIdPlaylist(): AbstractControl {
    return this.addNewPlaylistFormGroup.get('genreId');
  }

  get playlistTypeId(): AbstractControl {
    return this.addNewPlaylistFormGroup.get('playlistTypeId');
  }

}