import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ProsesorService } from '../prosesor.service';

@Component({
  selector: 'app-create-prosesor',
  templateUrl: './create-prosesor.component.html',
})
export class CreateProsesorComponent {
  createInvForm: FormGroup;
  errorMessage: string = '';

  constructor(
    private router: Router,
    private invService: ProsesorService
  ) {
    this.createInvForm = new FormGroup({
      nama_prosesor: new FormControl('', [Validators.required]),
    });
  }

  createProsesor() {
    if (this.createInvForm.valid) {
      const { nama_prosesor } = this.createInvForm.value;
      this.invService.createProsesor(nama_prosesor).subscribe({
        next: (response) => {
          // Check if the response contains a valid token
          if (response.token) {
            localStorage.setItem('token', response.token);
          }
          this.router.navigate(['/prosesor/prosesor-list']);
        },
        error: (error) => {
          console.error('Create failed:', error);
          this.errorMessage = 'Create failed';
        }
      });
    } else {
      this.errorMessage = 'Please fill out the form correctly';
    }
  }

  onSubmit() {
    this.createProsesor();
  }

  back(){
    this.router.navigate(['prosesor/prosesor-list']);
  }
}
