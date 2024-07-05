import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router'; // Import Router
import { Series_printService } from '../series_print.service';

@Component({
  selector: 'app-update-series_print',
  templateUrl: './update-series_print.component.html',
})
export class UpdateSeries_printComponent implements OnInit {
  id: string = '';
  nama_series_print: string = '';
  errorMessage: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router, // Inject Router
    private invService: Series_printService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      console.log('Route Params:', params);
      this.id = params['id'];
      console.log('Series_print ID:', this.id);
      this.loadSeries_print(this.id);
    });
  }

  loadSeries_print(id: string) {
    // Call your Series_printService to fetch Series_print details by id
    this.invService.getSeries_printById(id).subscribe(
      (data: any) => {
        this.nama_series_print = data.nama_series_print 
      },
      error => {
        this.errorMessage = 'Failed to load series_print details.';
        console.error(error);
      }
    );
  }

  // Define the updateSeries_print method to handle update logic
  updateSeries_print() {
    // Convert Series_printId to number
    const series_printIdNumber = parseInt(this.id, 10); // Convert string to number

    // Call Series_printService to update the Series_print item
    this.invService.updateSeries_print(series_printIdNumber, this.nama_series_print).subscribe(
      (response: any) => {
        console.log('Series_print updated successfully:', response);
        
        // Redirect to Series_print list upon successful update
        this.router.navigate(['/series_print/series_print-list']);
      },
      error => {
        console.error('Error updating series_print:', error);
        // Handle error or show error message
      }
    );
  }

  back(){
    this.router.navigate(['series_print/series_print-list']);
  }
}
