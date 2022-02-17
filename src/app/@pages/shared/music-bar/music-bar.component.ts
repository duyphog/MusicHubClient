import { Component, OnInit, OnDestroy } from '@angular/core';
import { AudioService } from './../../../@services/audio.service';
import * as $ from "jquery";
import { Subscription } from 'rxjs';
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

  currentIndex: number = 0;
  
  timeElapsed: string = '00:00';
  duration: string = '00:00';
  
  percentElapsed: number = 0;
  percentVolume: number = 50;
  
  songList: string[] = [
    'assets/audio/[MV] end of a life - Calliope Mori (Original Song).mp3',
    'assets/audio/【AZKi x IRyS】いのち(Inochi)【REMIX】.mp3',
    'assets/audio/【Hololive x Nijsanji 】Mashup cover Kataomoi (カタオモイ) Aimer - Miyu Ottavia & Matsuri.mp3',
    'assets/audio/【Hoshimachi Suisei x IRyS】GHOST - 星街すいせい【MV MASHUP】.mp3',
  ];

  constructor(public audioService: AudioService) {}

  ngOnInit(): void {

    this.audioService.setAudio(this.songList[this.currentIndex]);

    this.onVolumeSlider(this.percentVolume / 100);
    
    this.subscriptions.push(this.audioService.getPercentElapsed().subscribe((percent) => {
      this.percentElapsed = percent;
    }));

    this.subscriptions.push(this.audioService.getTimeElapsed().subscribe((time: any) => {
        let percent = this.convertTime(time) / this.convertTime(this.duration);
        if (this.timeElapsed === this.duration) {
          this.duration = '00:00';
          percent = 0;
          this.onNextSong();
        } else {
          this.timeElapsed = time;
          this.onSongSlider(percent);
        }
      })
    );
   
    this.subscriptions.push(
      this.audioService.getTimeDuration().subscribe((duration) => {
        this.duration = duration;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  onPlaySong(): void {
    this.isPlaying = !this.isPlaying;
    this.isPlaying ? this.audioService.playAudio() : this.audioService.pauseAudio();
  }

  onMuted(): void {
    this.isMuted = !this.isMuted;
    this.audioService.muteAudio(this.isMuted);
  }

  onNextSong(): void {
    this.currentIndex = this.currentIndex === this.songList.length - 1 ? 0 : this.currentIndex + 1;
    this.audioService.setAudio(this.songList[this.currentIndex]);
    this.isPlaying === false ? this.audioService.pauseAudio() : this.audioService.playAudio();
  }

  onPreviousSong(): void {
    this.currentIndex = this.currentIndex === 0 ? this.songList.length - 1 : this.currentIndex - 1;
    this.audioService.setAudio(this.songList[this.currentIndex]);
    this.isPlaying === false ? this.audioService.pauseAudio() : this.audioService.playAudio();
  }

  onSeekAudio(event): void {
    let position = event.value * this.audioService.audio.duration / 100;
    this.audioService.seekAudio(position);
  }

  onVolumeChange(event): void {
    this.percentVolume = event.value;
    this.audioService.setVolume(event.value / 100);
    this.onVolumeSlider(event.value / 100);
  }

  onVolumeSlider(percent): void {
    $('#volume-progressbar').css('background',
      '-webkit-gradient(linear, left top, right top, '
      + 'color-stop(' + 0 + ', #fff), '
      + 'color-stop(' + percent + ', #fff), '
      + 'color-stop(' + percent + ', hsla(0,0%,100%,0.3))'
      + ')'
    );
  }

  onSongSlider(percent): void {
    $('#music-progressbar').css('background',
      '-webkit-gradient(linear, left top, right top, '
      + 'color-stop(' + 0 + ', #fff), '
      + 'color-stop(' + percent + ', #fff), '
      + 'color-stop(' + percent + ', hsla(0,0%,100%,0.3))'
      + ')'
    );
  }

  public convertTime(time: string): number {
    let timeArray = time.split(':'),
      minutes = parseInt(timeArray[0], 10),
      seconds = parseInt(timeArray[1], 10);
    return (minutes * 60) + seconds;
  }
 
}
