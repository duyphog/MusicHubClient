import { Component, OnInit } from '@angular/core';
import { CommonService } from './../../../@services/common.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  menuList: any[] = [];
  menuListItem: any[] = [];

  constructor(private commonService: CommonService) { }

  ngOnInit(): void {
    this.commonService.listCategory().subscribe((response: any) => {
      this.menuList = response.data;
    });
    this.commonService.listGenre().subscribe((response: any) => {
      this.menuListItem = response.data;
    });
  }
}
