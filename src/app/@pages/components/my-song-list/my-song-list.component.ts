import { Component, OnInit } from '@angular/core';
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
  ) {}

  public ngOnInit(): void {
    this.user = this.authenticationService.getUserInfoFromLocalCache();
    this.playlistService.getPlaylistByUserId(this.user.userId).pipe(debounceTime(500)).subscribe(res => {
      this.listPlaylist = res.data;    
    });
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
  addNewPlaylistFormGroup: FormGroup;
  listPlaylist: Playlist[] = [];

  mySongListComponent: BehaviorSubject<MySongListComponent> = new BehaviorSubject(null);

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
      'description': new FormControl('', []),
      'playlistTypeId': new FormControl('', []),
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
        // window.location.reload();
        this.toastr.success("Thêm playlist thành công");
      }, (error : any) => {
        this.toastr.error(error.error.errorMessage);
      });
      this.dialog.closeAll();
    }

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

}