import { Component, OnInit, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService } from '../storage.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { ModalDialogComponent } from 'src/app/storage_modal-dialog/modal-dialog.component';
import { Papa } from 'ngx-papaparse';
import * as XLSX from 'xlsx';
import { StorageItem } from './storage-item.model';
import { QRCodeModule } from 'angularx-qrcode';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-storage-list',
  templateUrl: './storage-list.component.html',
  styleUrls: ['./storage-list.component.css']
})
export class StorageListComponent implements OnInit, AfterViewInit {
  Storage = new MatTableDataSource<any>();
  errorMessage: string = '';
  currentItem: any = null;
  editInvForm: FormGroup;
  editFormVisible: boolean = false;
  displayedColumns: string[] = ['id_storage', 'nama_storage', 'qrcode', 'actions'];

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('fileInput') fileInput!: ElementRef;
  papa: Papa;

  constructor(
    private router: Router,
    private InvServ: StorageService,
    private dialog: MatDialog,
    papa: Papa,
  ) {
    this.papa = papa;
    this.editInvForm = new FormGroup({
      nama_storage: new FormControl('', [Validators.required]),
    });
  }

  ngOnInit() {
    this.getStorage();
  }

  ngAfterViewInit() {
    this.Storage.sort = this.sort;
  }

  getStorage() {
    this.InvServ.getStorage().subscribe(
      (data: any) => {
        if (Array.isArray(data)) {
          this.Storage.data = data.map(item => ({
            id_storage: item.id_storage,
            nama_storage: item.nama_storage,
          }));
        } else if (data && typeof data === 'object') {
          // If data is an object, convert it to an array
          this.Storage.data = Object.keys(data).map(key => ({
            id_storage: key,
            nama_storage: data[key].nama_storage,
          }));
        } else {
          console.error('Data format is not recognized:', data);
        }
      },
      (error) => {
        console.error('Error loading Storage:', error);
      }
    );
  }

  openDialog(action: string, item?: any): void {
    const form = new FormGroup({
      nama_storage: new FormControl(item ? item.nama_storage : '', [Validators.required])
    });
  
    const dialogRef = this.dialog.open(ModalDialogComponent, {
      width: '300px',
      data: { title: action === 'Create' ? 'Create Item' : 'Edit Item', form }
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const nama_storage = result.nama_storage.trim(); // Ensure no leading/trailing whitespace
  
        if (action === 'Create') {
          this.InvServ.createStorage(nama_storage).subscribe(() => {
            this.getStorage();
            Swal.fire('Success!', 'Item created successfully!', 'success');
          });
        } else if (action === 'Edit' && item) {
          this.InvServ.updateStorage(item.id_storage, nama_storage).subscribe(() => {
            this.getStorage();
            Swal.fire('Success!', 'Item updated successfully!', 'success');
          });
        }
      }
    });
  }

  addItem() {
    this.openDialog('Create');
  }

  editItem(item: any) {
    this.openDialog('Edit', item);
  }

  deleteItem(id_storage: number) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this item!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.value) {
        this.InvServ.deleteStorage(id_storage).subscribe(() => {
          this.getStorage();
          Swal.fire('Deleted!', 'Item has been deleted successfully!', 'success');
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire('Cancelled', 'Item is safe!', 'info');
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.Storage.filter = filterValue.trim().toLowerCase();
  }

  importCSV() {
    console.log('importCSV called');
    this.fileInput.nativeElement.click();
  }

  onFileSelected(event: any) {
    console.log('File selected:', event);
    const file = event.target.files[0];
    if (file) {
      const fileType = file.name.split('.').pop().toLowerCase();
      console.log('File type:', fileType);
      if (fileType === 'csv') {
        this.parseCSV(file);
      } else if (fileType === 'xlsx') {
        this.parseXLSX(file);
      } else {
        console.error('Unsupported file type:', fileType);
      }
    }
  }

  parseCSV(file: File) {
    console.log('Parsing CSV file');
    this.papa.parse(file, {
      complete: (result: { data: any; }) => {
        console.log('CSV parsed result:', result.data);
        this.handleParsedData(result.data);
      },
      header: true
    });
  }

  parseXLSX(file: File) {
    console.log('Parsing XLSX file');
    const reader = new FileReader();
    reader.onload = (event) => {
      const data = new Uint8Array(event.target?.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const json = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      console.log('XLSX parsed result:', json);
      this.handleParsedData(json);
    };
    reader.readAsArrayBuffer(file);
  }

  handleParsedData(data: any) {
    console.log('Handling parsed data:', data);
    const parsedStorage: StorageItem[] = data.slice(1).map((item: any, index: number) => {
      const nama_storage = Array.isArray(item) ? item[1] : item['Nama Storage'];
      return { nama_storage } as StorageItem;
    }).filter((item: { nama_storage: any; }) => item.nama_storage);

    this.Storage.data = [...this.Storage.data, ...parsedStorage];

    parsedStorage.forEach(item => {
      this.InvServ.createStorage(item.nama_storage).subscribe({
        next: (res) => console.log('Storage created:', res),
        error: (err) => console.error('Error creating Storage:', err),
        complete: () => {
          // After all categories are created, refresh the Kategori data
          this.getStorage();
  
          // Show SweetAlert after data is refreshed
          Swal.fire('Success!', 'Storage imported successfully!', 'success');
        }
      });
    });
  }

  generateQRData(item: any): string {
    return `${item.id_storage} - ${item.nama_storage}`;
  }
}
