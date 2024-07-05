import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router'; // Import Router
import { LokasiService } from '../lokasi.service';

@Component({
  selector: 'app-update-lokasi',
  templateUrl: './update-lokasi.component.html',
})
export class UpdateLokasiComponent implements OnInit {
  id_lokasi: string = '';
  nama_lokasi: string = '';
  errorMessage: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router, // Inject Router
    private invService: LokasiService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      console.log('Route Params:', params);
      this.id_lokasi = params['id_lokasi'];
      console.log('Lokasi ID:', this.id_lokasi);
      this.loadLokasi(this.id_lokasi);
    });
  }

  loadLokasi(id_lokasi: string) {
    // Call your LokasiService to fetch Lokasi details by id
    this.invService.getLokasiById(id_lokasi).subscribe(
      (data: any) => {
        this.nama_lokasi = data.nama_lokasi 
      },
      error => {
        this.errorMessage = 'Failed to load lokasi details.';
        console.error(error);
      }
    );
  }

  // Define the updateLokasi method to handle update logic
  updateLokasi() {
    // Convert LokasiId to number
    const lokasiIdNumber = parseInt(this.id_lokasi, 10); // Convert string to number

    // Call LokasiService to update the Lokasi item
    this.invService.updateLokasi(lokasiIdNumber, this.nama_lokasi).subscribe(
      (response: any) => {
        console.log('Lokasi updated successfully:', response);
        
        // Redirect to Lokasi list upon successful update
        this.router.navigate(['/lokasi/lokasi-list']);
      },
      error => {
        console.error('Error updating lokasi:', error);
        // Handle error or show error message
      }
    );
  }

  back(){
    this.router.navigate(['lokasi/lokasi-list']);
  }
}
