import { Component, OnInit, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { RamService } from '../ram.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { ModalDialogComponent } from 'src/app/ram_modal-dialog/modal-dialog.component';
import { Papa } from 'ngx-papaparse';
import * as XLSX from 'xlsx';
import { RamItem } from './ram-item.model';
import { QRCodeModule } from 'angularx-qrcode';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-ram-list',
  templateUrl: './ram-list.component.html',
  styleUrls: ['./ram-list.component.css']
})
export class RamListComponent implements OnInit, AfterViewInit {
  Ram = new MatTableDataSource<any>();
  errorMessage: string = '';
  currentItem: any = null;
  editInvForm: FormGroup;
  editFormVisible: boolean = false;
  displayedColumns: string[] = ['id_ram', 'nama_ram', 'qrcode', 'actions'];

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('fileInput') fileInput!: ElementRef;
  papa: Papa;

  constructor(
    private router: Router,
    private InvServ: RamService,
    private dialog: MatDialog,
    papa: Papa,
  ) {
    this.papa = papa; 
    this.editInvForm = new FormGroup({
      nama_ram: new FormControl('', [Validators.required]),
    });
  }

  ngOnInit() {
    this.getRam();
  }

  ngAfterViewInit() {
    this.Ram.sort = this.sort;
  }

  getRam() {
    this.InvServ.getRam().subscribe(
      (data: any) => {
        if (Array.isArray(data)) {
          this.Ram.data = data.map(item => ({
            id_ram: item.id_ram,
            nama_ram: item.nama_ram,
          }));
        } else if (data && typeof data === 'object') {
          // If data is an object, convert it to an array
          this.Ram.data = Object.keys(data).map(key => ({
            id_ram: key,
            nama_ram: data[key].nama_ram,
          }));
        } else {
          console.error('Data format is not recognized:', data);
        }
      },
      (error) => {
        console.error('Error loading Ram:', error);
      }
    );
  }

  openDialog(action: string, item?: any): void {
    const form = new FormGroup({
      nama_ram: new FormControl(item ? item.nama_ram : '', [Validators.required])
    });
  
    const dialogRef = this.dialog.open(ModalDialogComponent, {
      width: '300px',
      data: { title: action === 'Create' ? 'Create Item' : 'Edit Item', form }
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const nama_ram = result.nama_ram.trim(); // Ensure no leading/trailing whitespace
  
        if (action === 'Create') {
          this.InvServ.createRam(nama_ram).subscribe(() => {
            this.getRam();
            Swal.fire('Success!', 'Item created successfully!', 'success');
          });
        } else if (action === 'Edit' && item) {
          this.InvServ.updateRam(item.id_ram, nama_ram).subscribe(() => {
            this.getRam();
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

  deleteItem(id_ram: number) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this item!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.value) {
        this.InvServ.deleteRam(id_ram).subscribe(() => {
          this.getRam();
          Swal.fire('Deleted!', 'Item has been deleted successfully!', 'success');
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire('Cancelled', 'Item is safe!', 'info');
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.Ram.filter = filterValue.trim().toLowerCase();
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
    const parsedRam: RamItem[] = data.slice(1).map((item: any, index: number) => {
      const nama_ram = Array.isArray(item) ? item[1] : item['Nama Ram'];
      return { nama_ram } as RamItem;
    }).filter((item: { nama_ram: any; }) => item.nama_ram);

    this.Ram.data = [...this.Ram.data, ...parsedRam];

    parsedRam.forEach(item => {
      this.InvServ.createRam(item.nama_ram).subscribe({
        next: (res) => console.log('Ram created:', res),
        error: (err) => console.error('Error creating Ram:', err),
        complete: () => {
          // After all categories are created, refresh the Kategori data
          this.getRam();
  
          // Show SweetAlert after data is refreshed
          Swal.fire('Success!', 'Ram imported successfully!', 'success');
        }
      });
    });
  }

  generateQRData(item: any): string {
    return `${item.id_ram} - ${item.nama_ram}`;
  }
}
