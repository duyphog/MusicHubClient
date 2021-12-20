import {AfterViewInit, Component, ElementRef, OnInit} from '@angular/core';
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css'],
	/*styles: [
		'body { background-color: #4cb6cb !important; color: #eaf6f9; }'
	]*/
})
export class SigninComponent implements OnInit, AfterViewInit {
	title = 'Đăng nhập';

  constructor(private route: ActivatedRoute, private elementRef: ElementRef) { }

  ngOnInit(): void {
		window.document.title = this.title;
  }

	ngAfterViewInit() {
		//window.document.body.style.backgroundColor = '#4cb6cb !important';
	}

}
