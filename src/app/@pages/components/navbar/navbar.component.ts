import { Component, ElementRef, OnInit, QueryList, Renderer2, ViewChild, ViewChildren } from '@angular/core';
import { CommonService } from './../../../@services/common.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  menuList: any[] = [];
  menuListItem: any[] = [];

  enteredButton = false;
  isMatMenuOpen = false;
  prevButtonTrigger;

  constructor(private commonService: CommonService, private ren: Renderer2) { }

  ngOnInit(): void {
    this.commonService.listCategory().subscribe((response: any) => {
      this.menuList = response.data;
    });
    this.commonService.listGenre().subscribe((response: any) => {
      this.menuListItem = response.data;
    });
  }

  menuEnter() {
    this.isMatMenuOpen = true;
  }

  menuLeave(trigger, button) {
    setTimeout(() => {
      if (!this.enteredButton) {
        this.isMatMenuOpen = false;
        trigger.closeMenu();
        this.ren.removeClass(button['_elementRef'].nativeElement, 'cdk-focused');
        this.ren.removeClass(button['_elementRef'].nativeElement, 'cdk-program-focused');
      } else {
        this.isMatMenuOpen = false;
      }
    }, 80)
  }

  buttonEnter(trigger) {

    setTimeout(() => {
      if(this.prevButtonTrigger && this.prevButtonTrigger != trigger){
        this.prevButtonTrigger.closeMenu();
        this.prevButtonTrigger = trigger;
        this.isMatMenuOpen = false;
        trigger.openMenu();
        // this.ren.removeClass(trigger.menu.items.first['_elementRef'].nativeElement, 'cdk-focused');
        // this.ren.removeClass(trigger.menu.items.first['_elementRef'].nativeElement, 'cdk-program-focused');
      }
      else if (!this.isMatMenuOpen) {
        this.enteredButton = true;
        this.prevButtonTrigger = trigger
        trigger.openMenu();
        // this.ren.removeClass(trigger.menu.items.first['_elementRef'].nativeElement, 'cdk-focused');
        // this.ren.removeClass(trigger.menu.items.first['_elementRef'].nativeElement, 'cdk-program-focused');
      }
      else {
        this.enteredButton = true;
        this.prevButtonTrigger = trigger
      }
    })
  }

  buttonLeave(trigger, button) {
    setTimeout(() => {
      if (this.enteredButton && !this.isMatMenuOpen) {
        trigger.closeMenu();
        // this.ren.removeClass(button['_elementRef'].nativeElement, 'cdk-focused');
        // this.ren.removeClass(button['_elementRef'].nativeElement, 'cdk-program-focused');
      } if (!this.isMatMenuOpen) {
        trigger.closeMenu();
        // this.ren.removeClass(button['_elementRef'].nativeElement, 'cdk-focused');
        // this.ren.removeClass(button['_elementRef'].nativeElement, 'cdk-program-focused');
      } else {
        this.enteredButton = false;
      }
    }, 100)
  }


}
