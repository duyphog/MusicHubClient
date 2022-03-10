import {
  Component,
  OnInit,
  OnDestroy,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { AudioService } from './../../../@services/audio.service';
import * as $ from 'jquery';
import { Subscription, Observable, BehaviorSubject } from 'rxjs';
import { AppUtilService } from 'src/app/@services/app-util.service';
import { TrackService } from 'src/app/@services/track.service';
import { Playlist } from 'src/app/@model/playlist.model';
import { PlaylistService } from './../../../@services/playlist.service';
import { Track } from 'src/app/@model/track.model';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-music-bar',
  templateUrl: './music-bar.component.html',
  styleUrls: ['./music-bar.component.css'],
})
export class MusicBarComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];

  isPlaying: boolean = false;
  isMuted: boolean = false;
  isShuffle: boolean = false;
  isLoop: boolean = false;
  playlistOpened: BehaviorSubject<boolean> = new BehaviorSubject(false);
  playlistOpened$ = this.playlistOpened.asObservable();

  buttonPlaylist = document.getElementsByName('btn-playlist');

  currentIndex: number = 0;

  timeElapsed: string = '00:00';
  duration: string = '00:00';

  percentElapsed: number = 0;
  percentVolume: number = 50;

  public playerStatus: string;

  currentPlaylist: Playlist;
  currentTrack: Track;

  imageSongPlaying(): string {
    let imageUrl;
    imageUrl = this.currentTrack?.album === undefined || this.currentTrack?.album === null
      ? '/assets/images/my-logo.png'
      : this.currentTrack.album.imgUrl;

    return imageUrl;
  }

  constructor(
    public audioService: AudioService,
    public trackService: TrackService,
    public appUtilService: AppUtilService,
    public playlistService: PlaylistService
  ) {}

  ngOnInit(): void {
    this.getPlayerStatus();

    this.playlistService.getCurrentPlaylist().subscribe((playlist) => {
      this.currentPlaylist = playlist;
      this.trackService.getCurrentTrack().subscribe((track) => {
        this.currentTrack = track;
        this.currentIndex = this.trackService.getIndexOfTrack(track, playlist);
      });
    });

    this.trackService.getCurrentTrack().subscribe((track) => {
      if (track.id === 0) {
        let trackUrl = track.trackUrl.substring(this.appUtilService.getIndexOfAssets(track.trackUrl));
        let audioUrl = this.audioService.audio.src.substring(this.appUtilService.getIndexOfAssets(this.audioService.audio.src));
        if (trackUrl !== audioUrl) this.audioService.setAudio(track.trackUrl);
      } else {
        if (track.trackUrl !== this.audioService.audio.src) this.audioService.setAudio(track.trackUrl);
      }
      if (track.id !== 0) this.trackService.listenedTrack(track.id).subscribe((res) => { });
      if (this.isPlaying)
        this.audioService.playAudio() 
      else 
        this.audioService.pauseAudio();
    });


    this.audioService.setAudio(this.setTrack(this.currentIndex).trackUrl);

    this.onVolumeSlider(this.percentVolume / 100);

    this.subscriptions.push(
      this.audioService.getPercentElapsed().subscribe((percent) => {
        this.percentElapsed = percent;
      })
    );

    this.subscriptions.push(
      this.audioService.getTimeElapsed().subscribe(
        (time: any) => {
          let percent = this.convertTime(time) / this.convertTime(this.duration);
          if (this.timeElapsed === this.duration) {
            this.timeElapsed = '00:00';
            this.duration = '00:00';
            percent = 0;
            this.onNextSong();
          } else {
            this.timeElapsed = time;
            this.onSongSlider(percent);
          }
        },
        (err) => {
          console.log(err);
        }
      )
    );

    this.subscriptions.push(
      this.audioService.getTimeDuration().subscribe((duration) => {
        this.duration = duration;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  onPlaySong(): void {
    this.isPlaying = !this.isPlaying;
    this.isPlaying
      ? this.audioService.playAudio()
      : this.audioService.pauseAudio();
  }

  onMuted(): void {
    this.isMuted = !this.isMuted;
    this.audioService.muteAudio(this.isMuted);
  }

  onNextSong(): void {
    if (!this.isLoop)
      this.currentIndex = !this.isShuffle
        ? (this.currentIndex === this.currentPlaylist.playlistDetails.length - 1
          ? 0
          : this.currentIndex + 1)
        : Math.floor(
            Math.random() * this.currentPlaylist.playlistDetails.length
          );
    this.setCurrentTrack(this.currentIndex);
    this.audioService.setAudio(this.setTrack(this.currentIndex).trackUrl);
    if (this.isPlaying)
      this.audioService.playAudio() 
    else 
      this.audioService.pauseAudio();
  }

  onPreviousSong(): void {
    if (!this.isLoop)
      this.currentIndex = !this.isShuffle
        ? (this.currentIndex === 0
          ? this.currentPlaylist.playlistDetails.length - 1
          : this.currentIndex - 1)
        : Math.floor(
            Math.random() * this.currentPlaylist.playlistDetails.length
          );
    this.setCurrentTrack(this.currentIndex);
    this.audioService.setAudio(this.setTrack(this.currentIndex).trackUrl);
    if (this.isPlaying)
      this.audioService.playAudio() 
    else 
      this.audioService.pauseAudio();
  }

  onSeekAudio(event): void {
    let position = (event.value * this.audioService.audio.duration) / 100;
    this.audioService.seekAudio(position);
  }

  onVolumeChange(event): void {
    this.percentVolume = event.value;
    this.audioService.setVolume(event.value / 100);
    this.onVolumeSlider(event.value / 100);
  }

  onVolumeSlider(percent): void {
    $('#volume-progressbar').css(
      'background',
      '-webkit-gradient(linear, left top, right top, ' +
        'color-stop(' +
        0 +
        ', #fff), ' +
        'color-stop(' +
        percent +
        ', #fff), ' +
        'color-stop(' +
        percent +
        ', hsla(0,0%,100%,0.3))' +
        ')'
    );
  }

  onSongSlider(percent): void {
    $('#music-progressbar').css(
      'background',
      '-webkit-gradient(linear, left top, right top, ' +
        'color-stop(' +
        0 +
        ', #fff), ' +
        'color-stop(' +
        percent +
        ', #fff), ' +
        'color-stop(' +
        percent +
        ', hsla(0,0%,100%,0.3))' +
        ')'
    );
  }

  public getPlayerStatus() {
    this.audioService
      .getPlayerStatus()
      .pipe(debounceTime(100))
      .subscribe((status) => (this.playerStatus = status));
  }

  public toggleAudio() {
    this.audioService.toggleAudio();
    return false;
  }

  onOpenPlaylist(): void {
    if (this.audioService.openPlaylist.value) {
      this.buttonPlaylist[0].classList.remove('active');
    } else {
      this.buttonPlaylist[0].classList.add('active');
    }
    this.audioService.openPlaylist.next(!this.audioService.openPlaylist.value);
  }

  onOpenShuffle(): void {
    this.isShuffle = !this.isShuffle;
  }

  onOpenLoop(): void {
    this.isLoop = !this.isLoop;
  }

  setCurrentTrack(currentIndex) {
    this.trackService.setCurrentTrack(this.setTrack(currentIndex));
  }

  setTrack(currentIndex): Track {
    return this.playlistService.getTrackFromCurrentIndex(
      this.currentPlaylist,
      currentIndex
    );
  }

  public convertTime(time: string): number {
    let timeArray = time.split(':'),
      minutes = parseInt(timeArray[0], 10),
      seconds = parseInt(timeArray[1], 10);
    return minutes * 60 + seconds;
  }
}
