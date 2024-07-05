import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router'; // Import Router
import { StorageService } from '../storage.service';

@Component({
  selector: 'app-update-storage',
  templateUrl: './update-storage.component.html',
})
export class UpdateStorageComponent implements OnInit {
  id_storage: string = '';
  nama_storage: string = '';
  errorMessage: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router, // Inject Router
    private invService: StorageService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      console.log('Route Params:', params);
      this.id_storage = params['id_storage'];
      console.log('Storage ID:', this.id_storage);
      this.loadStorage(this.id_storage);
    });
  }

  loadStorage(id_storage: string) {
    // Call your StorageService to fetch Storage details by id
    this.invService.getStorageById(id_storage).subscribe(
      (data: any) => {
        this.nama_storage = data.nama_storage 
      },
      error => {
        this.errorMessage = 'Failed to load storage details.';
        console.error(error);
      }
    );
  }

  // Define the updateStorage method to handle update logic
  updateStorage() {
    // Convert StorageId to number
    const StorageIdNumber = parseInt(this.id_storage, 10); // Convert string to number

    // Call StorageService to update the Storage item
    this.invService.updateStorage(StorageIdNumber, this.nama_storage).subscribe(
      (response: any) => {
        console.log('Storage updated successfully:', response);
        
        // Redirect to Storage list upon successful update
        this.router.navigate(['/storage/storage-list']);
      },
      error => {
        console.error('Error updating storage:', error);
        // Handle error or show error message
      }
    );
  }

  back(){
    this.router.navigate(['storage/storage-list']);
  }
}
