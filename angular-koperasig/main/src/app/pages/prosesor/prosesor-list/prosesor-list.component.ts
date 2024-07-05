import { Component, OnInit, ViewChild, AfterViewInit,ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { ProsesorService } from '../prosesor.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { ModalDialogComponent } from 'src/app/prosesor_modal-dialog/modal-dialog.component';
import { Papa } from 'ngx-papaparse';
import * as XLSX from 'xlsx';
import { ProsesorItem } from './prosesor-item.model';
import { QRCodeModule } from 'angularx-qrcode';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-prosesor-list',
  templateUrl: './prosesor-list.component.html',
  styleUrls: ['./prosesor-list.component.css']
})
export class ProsesorListComponent implements OnInit, AfterViewInit {
  Prosesor = new MatTableDataSource<any>();
  errorMessage: string = '';
  currentItem: any = null;
  editInvForm: FormGroup;
  editFormVisible: boolean = false;
  displayedColumns: string[] = ['id_prosesor', 'nama_prosesor', 'qrcode', 'actions'];

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('fileInput') fileInput!: ElementRef;
  papa: Papa;

  constructor(
    private router: Router,
    private InvServ: ProsesorService,
    private dialog: MatDialog,
    papa: Papa 
  ) {
    this.papa = papa; 
    this.editInvForm = new FormGroup({
      nama_prosesor: new FormControl('', [Validators.required]),
    });
  }

  ngOnInit() {
    this.getProsesor();
  }

  ngAfterViewInit() {
    this.Prosesor.sort = this.sort;
  }

  getProsesor() {
    this.InvServ.getProsesor().subscribe(
      (data: any) => {
        if (Array.isArray(data)) {
          this.Prosesor.data = data.map(item => ({
            id_prosesor: item.id_prosesor,
            nama_prosesor: item.nama_prosesor,
          }));
        } else if (data && typeof data === 'object') {
          // If data is an object, convert it to an array
          this.Prosesor.data = Object.keys(data).map(key => ({
            id_prosesor: key,
            nama_prosesor: data[key].nama_prosesor,
          }));
        } else {
          console.error('Data format is not recognized:', data);
        }
      },
      (error) => {
        console.error('Error loading Prosesor:', error);
      }
    );
  }

  openDialog(action: string, item?: any): void {
    const form = new FormGroup({
      nama_prosesor: new FormControl(item ? item.nama_prosesor : '', [Validators.required])
    });
  
    const dialogRef = this.dialog.open(ModalDialogComponent, {
      width: '300px',
      data: { title: action === 'Create' ? 'Create Item' : 'Edit Item', form }
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const nama_prosesor = result.nama_prosesor.trim(); // Ensure no leading/trailing whitespace
  
        if (action === 'Create') {
          this.InvServ.createProsesor(nama_prosesor).subscribe(() => {
            this.getProsesor();
            Swal.fire('Success!', 'Item created successfully!', 'success');
          });
        } else if (action === 'Edit' && item) {
          this.InvServ.updateProsesor(item.id_prosesor, nama_prosesor).subscribe(() => {
            this.getProsesor();
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

  deleteItem(id_prosesor: number) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this item!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.value) {
        this.InvServ.deleteProsesor(id_prosesor).subscribe(() => {
          this.getProsesor();
          Swal.fire('Deleted!', 'Item has been deleted successfully!', 'success');
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire('Cancelled', 'Item is safe!', 'info');
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.Prosesor.filter = filterValue.trim().toLowerCase();
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
    const parsedProsesor: ProsesorItem[] = data.slice(1).map((item: any, index: number) => {
      const nama_prosesor = Array.isArray(item) ? item[1] : item['Nama Prosesor'];
      return { nama_prosesor } as ProsesorItem;
    }).filter((item: { nama_prosesor: any; }) => item.nama_prosesor);

    this.Prosesor.data = [...this.Prosesor.data, ...parsedProsesor];

    parsedProsesor.forEach(item => {
      this.InvServ.createProsesor(item.nama_prosesor).subscribe({
        next: (res) => console.log('Prosesor created:', res),
        error: (err) => console.error('Error creating Prosesor:', err),
        complete: () => {
          // After all categories are created, refresh the Kategori data
          this.getProsesor();
  
          // Show SweetAlert after data is refreshed
          Swal.fire('Success!', 'Prosesor imported successfully!', 'success');
        }
      });
    });
  }

  generateQRData(item: any): string {
    return `${item.id_prosesor} - ${item.nama_prosesor}`;
  }
}
