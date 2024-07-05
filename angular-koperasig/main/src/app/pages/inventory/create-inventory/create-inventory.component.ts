import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { InventoryService } from '../inventory.service';

@Component({
  selector: 'app-create-inventory',
  templateUrl: './create-inventory.component.html',
})
export class CreateInventoryComponent {
  createInvForm: FormGroup;
  errorMessage: string = '';

  constructor(
    private router: Router,
    private invService: InventoryService
  ) {
    this.createInvForm = new FormGroup({
      nama_komputer: new FormControl('', [Validators.required]),
    });
  }

  createInventory() {
    if (this.createInvForm.valid) {
      const { nama_komputer } = this.createInvForm.value;
      this.invService.createInventory(nama_komputer).subscribe({
        next: (response) => {
          // Check if the response contains a valid token
          if (response.token) {
            localStorage.setItem('token', response.token);
          }
          this.router.navigate(['/inventory/inventory-list']);
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
    this.createInventory();
  }

  back(){
    this.router.navigate(['inventory/inventory-list']);
  }
}
