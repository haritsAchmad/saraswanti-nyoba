import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router'; // Import Router
import { KategoriService } from '../kategori.service';

@Component({
  selector: 'app-update-kategori',
  templateUrl: './update-kategori.component.html',
})
export class UpdateKategoriComponent implements OnInit {
  id_kategori: string = '';
  nama_kategori: string = '';
  errorMessage: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router, // Inject Router
    private invService: KategoriService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      console.log('Route Params:', params);
      this.id_kategori = params['id_kategori'];
      console.log('Kategori ID:', this.id_kategori);
      this.loadKategori(this.id_kategori);
    });
  }

  loadKategori(id_kategori: string) {
    // Call your KategoriService to fetch Kategori details by id
    this.invService.getKategoriById(id_kategori).subscribe(
      (data: any) => {
        this.nama_kategori = data.nama_kategori 
      },
      error => {
        this.errorMessage = 'Failed to load kategori details.';
        console.error(error);
      }
    );
  }

  // Define the updateKategori method to handle update logic
  updateKategori() {
    // Convert KategoriId to number
    const kategoriIdNumber = parseInt(this.id_kategori, 10); // Convert string to number

    // Call KategoriService to update the Kategori item
    this.invService.updateKategori(kategoriIdNumber, this.nama_kategori).subscribe(
      (response: any) => {
        console.log('Kategori updated successfully:', response);
        
        // Redirect to Kategori list upon successful update
        this.router.navigate(['/kategori/kategori-list']);
      },
      error => {
        console.error('Error updating kategori:', error);
        // Handle error or show error message
      }
    );
  }

  back(){
    this.router.navigate(['kategori/kategori-list']);
  }
}
