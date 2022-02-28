import { Component, OnInit } from '@angular/core';
import { AudioService } from 'src/app/@services/audio.service';

@Component({
  selector: 'app-default',
  templateUrl: './default.component.html',
  styleUrls: ['./default.component.css'],
})
export class DefaultComponent implements OnInit {
  myPlaylist: any = document.getElementsByName('my-playlist');
  playlistOpened$ = this.audioSerive.openPlaylist.asObservable();

  constructor(private audioSerive: AudioService) {
    
  }

  ngOnInit(): void {
    this.playlistOpened$.subscribe((isShowed) => {
      if (isShowed) {
          this.myPlaylist[0].classList.add('show-playlist');
          this.myPlaylist[0].classList.remove('close-playlist');
      } else {

          this.myPlaylist[0].classList.add('close-playlist');
          this.myPlaylist[0].classList.remove('show-playlist');
      }
    });
  }
}
