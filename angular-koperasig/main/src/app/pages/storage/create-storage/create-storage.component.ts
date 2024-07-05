import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { StorageService } from '../storage.service';

@Component({
  selector: 'app-create-storage',
  templateUrl: './create-storage.component.html',
})
export class CreateStorageComponent {
  createInvForm: FormGroup;
  errorMessage: string = '';

  constructor(
    private router: Router,
    private invService: StorageService
  ) {
    this.createInvForm = new FormGroup({
      nama_storage: new FormControl('', [Validators.required]),
    });
  }

  createStorage() {
    if (this.createInvForm.valid) {
      const { nama_storage } = this.createInvForm.value;
      this.invService.createStorage(nama_storage).subscribe({
        next: (response) => {
          // Check if the response contains a valid token
          if (response.token) {
            localStorage.setItem('token', response.token);
          }
          this.router.navigate(['/storage/storage-list']);
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
    this.createStorage();
  }

  back(){
    this.router.navigate(['storage/storage-list']);
  }
}
