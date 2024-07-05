import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../auth.service';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
})
export class AppSideLogoutComponent {
  username: string = '';
  password: string = '';
  errorMessage: string = '';




  constructor(private router: Router,
    private AuthServ: AuthService
  ) {
    this.errorMessage = 'Invalid username or password';
  }

  logout() {
    this.AuthServ.logout().subscribe(e => {
      localStorage.setItem('token', e.token);
      this.router.navigate(['/']);
      
    })

  }
}