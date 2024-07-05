import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
})
export class AppSideRegisterComponent {
  registerForm: FormGroup;
  errorMessage: string = '';

  constructor(
    private router: Router,
    private AuthServ: AuthService
  ) {
    this.registerForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(8)]),
      password_confirmation: new FormControl('', [Validators.required])
    });
    this.errorMessage = 'Datanya gak masuk';
  }

  register() {
    if (this.registerForm.valid) {
      const { name, email, password, password_confirmation } = this.registerForm.value;
      this.AuthServ.register(name, email, password, password_confirmation).subscribe({
        next: (response) => {
          localStorage.setItem('token', response.token);
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          this.errorMessage = 'Registration failed';
        }
      });
    } else {
      this.errorMessage = 'Please fill out the form correctly';
    }
  }

  onSubmit() {
    this.register();
  }
}
