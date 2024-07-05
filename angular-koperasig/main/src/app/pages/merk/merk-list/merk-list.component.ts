import { Component, OnInit, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { MerkService } from '../merk.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { ModalDialogComponent } from 'src/app/merk_modal-dialog/modal-dialog.component';
import { Papa } from 'ngx-papaparse';
import * as XLSX from 'xlsx';
import { MerkItem } from './merk-item.model';
import { QRCodeModule } from 'angularx-qrcode';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-merk-list',
  templateUrl: './merk-list.component.html',
  styleUrls: ['./merk-list.component.css']
})
export class MerkListComponent implements OnInit, AfterViewInit {
  Merk = new MatTableDataSource<any>();
  errorMessage: string = '';
  currentItem: any = null;
  editInvForm: FormGroup; // Declare FormGroup here
  editFormVisible: boolean = false;
  displayedColumns: string[] = ['id_merk', 'nama_merk', 'qrcode','actions'];

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('fileInput') fileInput!: ElementRef;
  papa: Papa;

  constructor(
    private router: Router,
    private InvServ: MerkService,
    private dialog: MatDialog,
    papa: Papa 
  ) {
    this.papa = papa; 
    this.editInvForm = new FormGroup({
      nama_merk: new FormControl('', [Validators.required]),
    });
  }

  ngOnInit() {
    this.getMerk();
  }

  ngAfterViewInit() {
    this.Merk.sort = this.sort;
  }

  getMerk() {
    this.InvServ.getMerk().subscribe(
      (data: any) => {
        if (Array.isArray(data)) {
          this.Merk.data = data.map(item => ({
            id_merk: item.id_merk,
            nama_merk: item.nama_merk,
          }));
        } else if (data && typeof data === 'object') {
          // If data is an object, convert it to an array
          this.Merk.data = Object.keys(data).map(key => ({
            id_merk: key,
            nama_merk: data[key].nama_merk,
          }));
        } else {
          console.error('Data format is not recognized:', data);
        }
      },
      (error) => {
        console.error('Error loading Merk:', error);
      }
    );
  }

  openDialog(action: string, item?: any): void {
    const form = new FormGroup({
      nama_merk: new FormControl(item ? item.nama_merk : '', [Validators.required])
    });
  
    const dialogRef = this.dialog.open(ModalDialogComponent, {
      width: '300px',
      data: { title: action === 'Create' ? 'Create Item' : 'Edit Item', form }
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const nama_merk = result.nama_merk.trim(); // Ensure no leading/trailing whitespace
  
        if (action === 'Create') {
          this.InvServ.createMerk(nama_merk).subscribe(() => {
            this.getMerk();
            Swal.fire('Success!', 'Item created successfully!', 'success');
          });
        } else if (action === 'Edit' && item) {
          this.InvServ.updateMerk(item.id_merk, nama_merk).subscribe(() => {
            this.getMerk();
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

  deleteItem(id_merk: number) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this item!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.value) {
        this.InvServ.deleteMerk(id_merk).subscribe(() => {
          this.getMerk();
          Swal.fire('Deleted!', 'Item has been deleted successfully!', 'success');
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire('Cancelled', 'Item is safe!', 'info');
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.Merk.filter = filterValue.trim().toLowerCase();
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
    const parsedMerk: MerkItem[] = data.slice(1).map((item: any, index: number) => {
      const nama_merk = Array.isArray(item) ? item[1] : item['Nama Merk'];
      return { nama_merk } as MerkItem;
    }).filter((item: { nama_merk: any; }) => item.nama_merk);

    this.Merk.data = [...this.Merk.data, ...parsedMerk];

    parsedMerk.forEach(item => {
      this.InvServ.createMerk(item.nama_merk).subscribe({
        next: (res) => console.log('Merk created:', res),
        error: (err) => console.error('Error creating Merk:', err),
        complete: () => {
          // After all categories are created, refresh the Kategori data
          this.getMerk();
  
          // Show SweetAlert after data is refreshed
          Swal.fire('Success!', 'Merk imported successfully!', 'success');
        }
      });
    });
  }

  generateQRData(item: any): string {
    return `${item.id_merk} - ${item.nama_merk}`;
  }
}
