import { Component, OnInit, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { LokasiService } from '../lokasi.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { ModalDialogComponent } from 'src/app/lokasi_modal-dialog/modal-dialog.component';
import { Papa } from 'ngx-papaparse';
import * as XLSX from 'xlsx';
import { LokasiItem } from './lokasi-item.model';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { QRCodeModule } from 'angularx-qrcode';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-lokasi-list',
  templateUrl: './lokasi-list.component.html',
  styleUrls: ['./lokasi-list.component.css']
})
export class LokasiListComponent implements OnInit, AfterViewInit {
  Lokasi = new MatTableDataSource<any>();
  errorMessage: string = '';
  currentItem: any = null;
  editInvForm: FormGroup;
  editFormVisible: boolean = false;
  displayedColumns: string[] = ['id_lokasi', 'nama_lokasi', 'qrcode', 'actions'];

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('fileInput') fileInput!: ElementRef;
  papa: Papa;

  constructor(
    private router: Router,
    private InvServ: LokasiService,
    private dialog: MatDialog,
    papa: Papa,
  ) {
    this.papa = papa;
    this.editInvForm = new FormGroup({
      nama_lokasi: new FormControl('', [Validators.required]),
    });
  }

  ngOnInit() {
    this.getLokasi();
  }

  ngAfterViewInit() {
    this.Lokasi.sort = this.sort;
  }

  getLokasi() {
    this.InvServ.getLokasi().subscribe(
      (data: any) => {
        if (Array.isArray(data)) {
          this.Lokasi.data = data.map(item => ({
            id_lokasi: item.id_lokasi,
            nama_lokasi: item.nama_lokasi,
          }));
        } else if (data && typeof data === 'object') {
          // If data is an object, convert it to an array
          this.Lokasi.data = Object.keys(data).map(key => ({
            id_lokasi: key,
            nama_lokasi: data[key].nama_lokasi,
          }));
        } else {
          console.error('Data format is not recognized:', data);
        }
      },
      (error) => {
        console.error('Error loading Lokasi:', error);
      }
    );
  }

  openDialog(action: string, item?: any): void {
    const form = new FormGroup({
      nama_lokasi: new FormControl(item ? item.nama_lokasi : '', [Validators.required])
    });
  
    const dialogRef = this.dialog.open(ModalDialogComponent, {
      width: '300px',
      data: { title: action === 'Create' ? 'Create Item' : 'Edit Item', form }
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const nama_lokasi = result.nama_lokasi.trim(); // Ensure no leading/trailing whitespace
  
        if (action === 'Create') {
          this.InvServ.createLokasi(nama_lokasi).subscribe(() => {
            this.getLokasi();
            Swal.fire('Success!', 'Item created successfully!', 'success');
          });
        } else if (action === 'Edit' && item) {
          this.InvServ.updateLokasi(item.id_lokasi, nama_lokasi).subscribe(() => {
            this.getLokasi();
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

  deleteItem(id_lokasi: number) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this item!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.value) {
        this.InvServ.deleteLokasi(id_lokasi).subscribe(() => {
          this.getLokasi();
          Swal.fire('Deleted!', 'Item has been deleted successfully!', 'success');
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire('Cancelled', 'Item is safe!', 'info');
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.Lokasi.filter = filterValue.trim().toLowerCase();
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
    const parsedLokasi: LokasiItem[] = data.slice(1).map((item: any, index: number) => {
      const nama_lokasi = Array.isArray(item) ? item[1] : item['Nama Lokasi'];
      return { nama_lokasi } as LokasiItem;
    }).filter((item: { nama_lokasi: any; }) => item.nama_lokasi);

    this.Lokasi.data = [...this.Lokasi.data, ...parsedLokasi];

    parsedLokasi.forEach(item => {
      this.InvServ.createLokasi(item.nama_lokasi).subscribe({
        next: (res) => console.log('Category created:', res),
        error: (err) => console.error('Error creating category:', err),
        complete: () => {
          // After all categories are created, refresh the Kategori data
          this.getLokasi();
  
          // Show SweetAlert after data is refreshed
          Swal.fire('Success!', 'Lokasi imported successfully!', 'success');
        }
      });
    });
  }

  generateQRData(item: any): string {
    return `${item.id_lokasi} - ${item.nama_lokasi}`;
  }
}
