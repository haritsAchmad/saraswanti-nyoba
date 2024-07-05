import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { KategoriService } from '../kategori.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { ModalDialogComponent } from 'src/app/kategori_modal-dialog/modal-dialog.component';
import { Papa } from 'ngx-papaparse';
import * as XLSX from 'xlsx';
import { KategoriItem } from './kategori-item.model';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { QRCodeModule } from 'angularx-qrcode';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-kategori-list',
  templateUrl: './kategori-list.component.html',
  styleUrls: ['./kategori-list.component.css']
})
export class KategoriListComponent implements OnInit, AfterViewInit {
  kategori = new MatTableDataSource<any>();
  errorMessage: string = '';
  currentItem: any = null;
  editInvForm: FormGroup;
  editFormVisible: boolean = false;
  displayedColumns: string[] = ['id_kategori', 'nama_kategori', 'qrcode', 'actions'];

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('fileInput') fileInput!: ElementRef;
  papa: Papa;

  constructor(
    private router: Router,
    private InvServ: KategoriService,
    private dialog: MatDialog,
    papa: Papa
  ) {
    this.papa = papa;
    this.editInvForm = new FormGroup({
      nama_kategori: new FormControl('', [Validators.required]),
    });
  }

  ngOnInit() {
    this.getKategori();
  }

  ngAfterViewInit() {
    this.kategori.sort = this.sort;
  }

  getKategori() {
    this.InvServ.getKategori().subscribe(
      (data: any) => {
        if (Array.isArray(data)) {
          this.kategori.data = data.map(item => ({
            id_kategori: item.id_kategori,
            nama_kategori: item.nama_kategori,
          }));
        } else if (data && typeof data === 'object') {
          this.kategori.data = Object.keys(data).map(key => ({
            id_kategori: key,
            nama_kategori: data[key].nama_kategori,
          }));
        } else {
          console.error('Data format is not recognized:', data);
        }
      },
      (error) => {
        console.error('Error loading kategori:', error);
      }
    );
  }

  openDialog(action: string, item?: any): void {
    const form = new FormGroup({
      nama_kategori: new FormControl(item ? item.nama_kategori : '', [Validators.required])
    });

    const dialogRef = this.dialog.open(ModalDialogComponent, {
      width: '300px',
      data: { title: action === 'Create' ? 'Create Item' : 'Edit Item', form }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const nama_kategori = result.nama_kategori.trim(); // Ensure no leading/trailing whitespace
  
        if (action === 'Create') {
          this.InvServ.createKategori(nama_kategori).subscribe(() => {
            this.getKategori();
            Swal.fire('Success!', 'Item created successfully!', 'success');
          });
        } else if (action === 'Edit' && item) {
          this.InvServ.updateKategori(item.id_kategori, nama_kategori).subscribe(() => {
            this.getKategori();
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

  deleteItem(id_kategori: number) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this item!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.value) {
        this.InvServ.deleteKategori(id_kategori).subscribe(() => {
          this.getKategori();
          Swal.fire('Deleted!', 'Item has been deleted successfully!', 'success');
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire('Cancelled', 'Item is safe!', 'info');
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.kategori.filter = filterValue.trim().toLowerCase();
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
  
    const parsedKategori: KategoriItem[] = data.slice(1).map((item: any) => {
      const nama_kategori = Array.isArray(item) ? item[1] : item['Nama Kategori'];
      return { nama_kategori } as KategoriItem;
    }).filter((item: { nama_kategori: any; }) => item.nama_kategori);
  
    // Update the data source with parsed categories
    this.kategori.data = [...this.kategori.data, ...parsedKategori];
  
    // Create each category asynchronously
    parsedKategori.forEach(item => {
      this.InvServ.createKategori(item.nama_kategori).subscribe({
        next: (res) => {
          console.log('Kategori created:', res);
        },
        error: (err) => {
          console.error('Error creating category:', err);
        },
        complete: () => {
          // After all categories are created, refresh the Kategori data
          this.getKategori();
  
          // Show SweetAlert after data is refreshed
          Swal.fire('Success!', 'Kategori imported successfully!', 'success');
        }
      });
    });
  }

  generateQRData(item: any): string {
    return `${item.id_kategori} - ${item.nama_kategori}`;
  }
}
