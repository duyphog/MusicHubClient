import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-music-bar',
  templateUrl: './music-bar.component.html',
  styleUrls: ['./music-bar.component.css']
})
export class MusicBarComponent implements OnInit {
  isPlaying: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

  onClick(): void {
    this.isPlaying = !this.isPlaying;
  }
}
