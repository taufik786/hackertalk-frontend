import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  loggedUser = false;
  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.authService.user.subscribe(res => {
      if (res) {
        this.loggedUser = true;
      } else {
        this.loggedUser = false;
      }
    })
  }

  logout() {
    this.authService.Logout();
  }

}
