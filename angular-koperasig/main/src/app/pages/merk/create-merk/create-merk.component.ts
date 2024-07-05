import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MerkService } from '../merk.service';

@Component({
  selector: 'app-create-merk',
  templateUrl: './create-merk.component.html',
})
export class CreateMerkComponent {
  createInvForm: FormGroup;
  errorMessage: string = '';

  constructor(
    private router: Router,
    private invService: MerkService
  ) {
    this.createInvForm = new FormGroup({
      nama_merk: new FormControl('', [Validators.required]),
    });
  }

  createMerk() {
    if (this.createInvForm.valid) {
      const { nama_merk } = this.createInvForm.value;
      this.invService.createMerk(nama_merk).subscribe({
        next: (response) => {
          // Check if the response contains a valid token
          if (response.token) {
            localStorage.setItem('token', response.token);
          }
          this.router.navigate(['/merk/merk-list']);
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
    this.createMerk();
  }

  back(){
    this.router.navigate(['merk/merk-list']);
  }
}
