import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Series_printService } from '../series_print.service';

@Component({
  selector: 'app-create-series_print',
  templateUrl: './create-series_print.component.html',
})
export class CreateSeries_printComponent {
  createInvForm: FormGroup;
  errorMessage: string = '';

  constructor(
    private router: Router,
    private invService: Series_printService
  ) {
    this.createInvForm = new FormGroup({
      nama_series_print: new FormControl('', [Validators.required]),
    });
  }

  createSeries_print() {
    if (this.createInvForm.valid) {
      const { nama_series_print } = this.createInvForm.value;
      this.invService.createSeries_print(nama_series_print).subscribe({
        next: (response) => {
          // Check if the response contains a valid token
          if (response.token) {
            localStorage.setItem('token', response.token);
          }
          this.router.navigate(['/series_print/series_print-list']);
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
    this.createSeries_print();
  }

  back(){
    this.router.navigate(['series_print/series_print-list']);
  }
}
