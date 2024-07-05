import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router'; // Import Router
import { RamService } from '../ram.service';

@Component({
  selector: 'app-update-ram',
  templateUrl: './update-ram.component.html',
})
export class UpdateRamComponent implements OnInit {
  id_ram: string = '';
  nama_ram: string = '';
  errorMessage: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router, // Inject Router
    private invService: RamService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      console.log('Route Params:', params);
      this.id_ram = params['id_ram'];
      console.log('Ram ID:', this.id_ram);
      this.loadRam(this.id_ram);
    });
  }

  loadRam(id_ram: string) {
    // Call your RamService to fetch Ram details by id
    this.invService.getRamById(id_ram).subscribe(
      (data: any) => {
        this.nama_ram = data.nama_ram 
      },
      error => {
        this.errorMessage = 'Failed to load ram details.';
        console.error(error);
      }
    );
  }

  // Define the updateRam method to handle update logic
  updateRam() {
    // Convert RamId to number
    const ramIdNumber = parseInt(this.id_ram, 10); // Convert string to number

    // Call RamService to update the Ram item
    this.invService.updateRam(ramIdNumber, this.nama_ram).subscribe(
      (response: any) => {
        console.log('Ram updated successfully:', response);
        
        // Redirect to Ram list upon successful update
        this.router.navigate(['/ram/ram-list']);
      },
      error => {
        console.error('Error updating ram:', error);
        // Handle error or show error message
      }
    );
  }

  back(){
    this.router.navigate(['ram/ram-list']);
  }
}
