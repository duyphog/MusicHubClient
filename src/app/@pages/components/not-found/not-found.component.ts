import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.css']
})
export class NotFoundComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    const root = document.getElementsByTagName('html')[0];
    root.style.backgroundColor = "#4cb6cb";
		root.style.color = "#eaf6f9";
  }

}
