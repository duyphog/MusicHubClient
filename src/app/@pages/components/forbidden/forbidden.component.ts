import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-forbidden',
  templateUrl: './forbidden.component.html',
  styleUrls: ['./forbidden.component.css']
})
export class ForbiddenComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    const root = document.getElementsByTagName('html')[0];
    root.style.backgroundColor = "#4cb6cb";
		root.style.color = "#eaf6f9";
  }

}
