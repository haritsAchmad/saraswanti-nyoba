import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { KategoriService } from '../kategori.service';

@Component({
  selector: 'app-create-kategori',
  templateUrl: './create-kategori.component.html',
})
export class CreateKategoriComponent {
  createInvForm: FormGroup;
  errorMessage: string = '';

  constructor(
    private router: Router,
    private invService: KategoriService
  ) {
    this.createInvForm = new FormGroup({
      nama_kategori: new FormControl('', [Validators.required]),
    });
  }

  createKategori() {
    if (this.createInvForm.valid) {
      const { nama_kategori } = this.createInvForm.value;
      this.invService.createKategori(nama_kategori).subscribe({
        next: (response) => {
          // Check if the response contains a valid token
          if (response.token) {
            localStorage.setItem('token', response.token);
          }
          this.router.navigate(['/kategori/kategori-list']);
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
    this.createKategori();
  }

  back(){
    this.router.navigate(['inventory/inventory-list']);
  }
}
