import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router'; // Import Router
import { SeriesService } from '../series.service';

@Component({
  selector: 'app-update-series',
  templateUrl: './update-series.component.html',
})
export class UpdateSeriesComponent implements OnInit {
  id_series: string = '';
  nama_series: string = '';
  errorMessage: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router, // Inject Router
    private invService: SeriesService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      console.log('Route Params:', params);
      this.id_series = params['id_series'];
      console.log('Series ID:', this.id_series);
      this.loadSeries(this.id_series);
    });
  }

  loadSeries(id_series: string) {
    // Call your SeriesService to fetch Series details by id
    this.invService.getSeriesById(id_series).subscribe(
      (data: any) => {
        this.nama_series = data.nama_series 
      },
      error => {
        this.errorMessage = 'Failed to load series details.';
        console.error(error);
      }
    );
  }

  // Define the updateSeries method to handle update logic
  updateSeries() {
    // Convert SeriesId to number
    const seriesIdNumber = parseInt(this.id_series, 10); // Convert string to number

    // Call SeriesService to update the Series item
    this.invService.updateSeries(seriesIdNumber, this.nama_series).subscribe(
      (response: any) => {
        console.log('Series updated successfully:', response);
        
        // Redirect to Series list upon successful update
        this.router.navigate(['/series/series-list']);
      },
      error => {
        console.error('Error updating series:', error);
        // Handle error or show error message
      }
    );
  }

  back(){
    this.router.navigate(['series/series-list']);
  }
}
