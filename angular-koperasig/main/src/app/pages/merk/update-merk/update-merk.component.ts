import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router'; // Import Router
import { MerkService } from '../merk.service';

@Component({
  selector: 'app-update-merk',
  templateUrl: './update-merk.component.html',
})
export class UpdateMerkComponent implements OnInit {
  id_merk: string = '';
  nama_merk: string = '';
  errorMessage: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router, // Inject Router
    private invService: MerkService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      console.log('Route Params:', params);
      this.id_merk = params['id_merk'];
      console.log('Merk ID:', this.id_merk);
      this.loadMerk(this.id_merk);
    });
  }

  loadMerk(id_merk: string) {
    // Call your MerkService to fetch Merk details by id
    this.invService.getMerkById(id_merk).subscribe(
      (data: any) => {
        this.nama_merk = data.nama_merk 
      },
      error => {
        this.errorMessage = 'Failed to load merk details.';
        console.error(error);
      }
    );
  }

  // Define the updateMerk method to handle update logic
  updateMerk() {
    // Convert MerkId to number
    const merkIdNumber = parseInt(this.id_merk, 10); // Convert string to number

    // Call MerkService to update the Merk item
    this.invService.updateMerk(merkIdNumber, this.nama_merk).subscribe(
      (response: any) => {
        console.log('Merk updated successfully:', response);
        
        // Redirect to Merk list upon successful update
        this.router.navigate(['/merk/merk-list']);
      },
      error => {
        console.error('Error updating merk:', error);
        // Handle error or show error message
      }
    );
  }

  back(){
    this.router.navigate(['merk/merk-list']);
  }
}
