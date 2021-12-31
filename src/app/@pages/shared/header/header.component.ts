import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthenticationService } from 'src/app/@services/authentication.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  
  
  constructor(public authenticationService: AuthenticationService, private router: Router, private toastr: ToastrService ) { }

  ngOnInit(): void {
  }

  logout(): void {
    this.authenticationService.logOut();
    this.router.navigateByUrl('/signin').then(r => this.toastr.info('You have logged out successfully'));
  }

}
