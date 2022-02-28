import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-genre-detail',
  templateUrl: './genre-detail.component.html',
  styleUrls: ['./genre-detail.component.css']
})
export class GenreDetailComponent implements OnInit {

  songList: any[] = [
    {
      srcImg:
        'https://photo-resize-zmp3.zadn.vn/w94_r1x1_webp/avatars/6/7/67d14814930023cf3b56146571cd8d72_1399966280.jpg',
      name: 'Ai Ai Ai',
      artist: 'La Thăng New',
    },
    {
      srcImg:
        'https://photo-resize-zmp3.zadn.vn/w94_r1x1_webp/avatars/6/7/67d14814930023cf3b56146571cd8d72_1399966280.jpg',
      name: 'Ai Ai Ai',
      artist: 'La Thăng New',
    },
    
    {
      srcImg:
        'https://photo-resize-zmp3.zadn.vn/w94_r1x1_webp/avatars/6/7/67d14814930023cf3b56146571cd8d72_1399966280.jpg',
      name: 'Ai Ai Ai',
      artist: 'La Thăng New',
    },
    
    {
      srcImg:
        'https://photo-resize-zmp3.zadn.vn/w94_r1x1_webp/avatars/6/7/67d14814930023cf3b56146571cd8d72_1399966280.jpg',
      name: 'Ai Ai Ai',
      artist: 'La Thăng New',
    },
  ];

  constructor() { }

  ngOnInit(): void {
  }

}
