import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../auth.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class AppSideLoginComponent {
  username: string = '';
  password: string = '';
  errorMessage: string = '';




  constructor(private router: Router,
    private AuthServ: AuthService
  ) {
    this.errorMessage = 'Invalid username or password';
  }

  login() {
    this.AuthServ.login(this.username, this.password).subscribe(e => {
      localStorage.setItem('token', e.token);
      this.router.navigate(['/dashboard']);
      
    })
  }
  onSubmit() {
    console.log('Masuk');
  }
}