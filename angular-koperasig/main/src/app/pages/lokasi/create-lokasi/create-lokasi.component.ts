import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LokasiService } from '../lokasi.service';

@Component({
  selector: 'app-create-lokasi',
  templateUrl: './create-lokasi.component.html',
})
export class CreateLokasiComponent {
  createInvForm: FormGroup;
  errorMessage: string = '';

  constructor(
    private router: Router,
    private invService: LokasiService
  ) {
    this.createInvForm = new FormGroup({
      nama_lokasi: new FormControl('', [Validators.required]),
    });
  }

  createLokasi() {
    if (this.createInvForm.valid) {
      const { nama_lokasi } = this.createInvForm.value;
      this.invService.createLokasi(nama_lokasi).subscribe({
        next: (response) => {
          // Check if the response contains a valid token
          if (response.token) {
            localStorage.setItem('token', response.token);
          }
          this.router.navigate(['/lokasi/lokasi-list']);
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
    this.createLokasi();
  }

  back(){
    this.router.navigate(['lokasi/lokasi-list']);
  }
}
