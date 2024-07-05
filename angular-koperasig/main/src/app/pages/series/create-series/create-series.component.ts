import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SeriesService } from '../series.service';

@Component({
  selector: 'app-create-series',
  templateUrl: './create-series.component.html',
})
export class CreateSeriesComponent {
  createInvForm: FormGroup;
  errorMessage: string = '';

  constructor(
    private router: Router,
    private invService: SeriesService
  ) {
    this.createInvForm = new FormGroup({
      nama_series: new FormControl('', [Validators.required]),
    });
  }

  createSeries() {
    if (this.createInvForm.valid) {
      const { nama_series } = this.createInvForm.value;
      this.invService.createSeries(nama_series).subscribe({
        next: (response) => {
          // Check if the response contains a valid token
          if (response.token) {
            localStorage.setItem('token', response.token);
          }
          this.router.navigate(['/series/series-list']);
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
    this.createSeries();
  }

  back(){
    this.router.navigate(['series/series-list']);
  }
}
