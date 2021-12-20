import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {
	title = 'Đăng nhập';

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
		window.document.title = this.title;
		window.document.body.classList.add('bg-info');
		const root = document.getElementsByTagName('html')[0];
		root.style.backgroundColor = "#4cb6cb";
		root.style.color = "#eaf6f9";
  }

}
