import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router'; // Import Router
import { ProsesorService } from '../prosesor.service';

@Component({
  selector: 'app-update-prosesor',
  templateUrl: './update-prosesor.component.html',
})
export class UpdateProsesorComponent implements OnInit {
  id_prosesor: string = '';
  nama_prosesor: string = '';
  errorMessage: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router, // Inject Router
    private invService: ProsesorService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      console.log('Route Params:', params);
      this.id_prosesor = params['id_prosesor'];
      console.log('Prosesor ID:', this.id_prosesor);
      this.loadProsesor(this.id_prosesor);
    });
  }

  loadProsesor(id_prosesor: string) {
    // Call your ProsesorService to fetch Prosesor details by id
    this.invService.getProsesorById(id_prosesor).subscribe(
      (data: any) => {
        this.nama_prosesor = data.nama_prosesor 
      },
      error => {
        this.errorMessage = 'Failed to load prosesor details.';
        console.error(error);
      }
    );
  }

  // Define the updateProsesor method to handle update logic
  updateProsesor() {
    // Convert ProsesorId to number
    const prosesorIdNumber = parseInt(this.id_prosesor, 10); // Convert string to number

    // Call ProsesorService to update the Prosesor item
    this.invService.updateProsesor(prosesorIdNumber, this.nama_prosesor).subscribe(
      (response: any) => {
        console.log('Prosesor updated successfully:', response);
        
        // Redirect to Prosesor list upon successful update
        this.router.navigate(['/prosesor/prosesor-list']);
      },
      error => {
        console.error('Error updating prosesor:', error);
        // Handle error or show error message
      }
    );
  }

  back(){
    this.router.navigate(['prosesor/prosesor-list']);
  }
}
