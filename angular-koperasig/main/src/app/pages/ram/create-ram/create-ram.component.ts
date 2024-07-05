import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RamService } from '../ram.service';

@Component({
  selector: 'app-create-ram',
  templateUrl: './create-ram.component.html',
})
export class CreateRamComponent {
  createInvForm: FormGroup;
  errorMessage: string = '';

  constructor(
    private router: Router,
    private invService: RamService
  ) {
    this.createInvForm = new FormGroup({
      nama_ram: new FormControl('', [Validators.required]),
    });
  }

  createRam() {
    if (this.createInvForm.valid) {
      const { nama_ram } = this.createInvForm.value;
      this.invService.createRam(nama_ram).subscribe({
        next: (response) => {
          // Check if the response contains a valid token
          if (response.token) {
            localStorage.setItem('token', response.token);
          }
          this.router.navigate(['/ram/ram-list']);
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
    this.createRam();
  }

  back(){
    this.router.navigate(['ram/ram-list']);
  }
}
