import { Component, OnInit, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { Series_printService } from '../series_print.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { ModalDialogComponent } from 'src/app/series_print_modal-dialog/modal-dialog.component';
import { Papa } from 'ngx-papaparse';
import * as XLSX from 'xlsx';
import { Series_printItem } from './series_print-item.model';
import { QRCodeModule } from 'angularx-qrcode';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-series_print-list',
  templateUrl: './series_print-list.component.html',
  styleUrls: ['./series_print-list.component.css']
})
export class Series_printListComponent implements OnInit, AfterViewInit {
  Series_print = new MatTableDataSource<any>();
  errorMessage: string = '';
  currentItem: any = null;
  editInvForm: FormGroup;
  editFormVisible: boolean = false;
  displayedColumns: string[] = ['id', 'nama_series_print', 'qrcode', 'actions'];

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('fileInput') fileInput!: ElementRef;
  papa: Papa;

  constructor(
    private router: Router,
    private InvServ: Series_printService,
    private dialog: MatDialog,
    papa: Papa,
  ) {
    this.papa = papa; 
    this.editInvForm = new FormGroup({
      nama_series_print: new FormControl('', [Validators.required]),
    });
  }

  ngOnInit() {
    this.getSeries_print();
  }

  ngAfterViewInit() {
    this.Series_print.sort = this.sort;
  }

  getSeries_print() {
    this.InvServ.getSeries_print().subscribe(
      (data: any) => {
        if (Array.isArray(data)) {
          this.Series_print.data = data.map(item => ({
            id: item.id,
            nama_series_print: item.nama_series_print,
          }));
        } else if (data && typeof data === 'object') {
          // If data is an object, convert it to an array
          this.Series_print.data = Object.keys(data).map(key => ({
            id: key,
            nama_series_print: data[key].nama_series_print,
          }));
        } else {
          console.error('Data format is not recognized:', data);
        }
      },
      (error) => {
        console.error('Error loading Series_print:', error);
      }
    );
  }

  openDialog(action: string, item?: any): void {
    const form = new FormGroup({
      nama_series_print: new FormControl(item ? item.nama_series_print : '', [Validators.required])
    });
  
    const dialogRef = this.dialog.open(ModalDialogComponent, {
      width: '300px',
      data: { title: action === 'Create' ? 'Create Item' : 'Edit Item', form }
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const nama_series_print = result.nama_series_print.trim(); // Ensure no leading/trailing whitespace
  
        if (action === 'Create') {
          this.InvServ.createSeries_print(nama_series_print).subscribe(() => {
            this.getSeries_print();
            Swal.fire('Success!', 'Item created successfully!', 'success');
          });
        } else if (action === 'Edit' && item) {
          this.InvServ.updateSeries_print(item.id, nama_series_print).subscribe(() => {
            this.getSeries_print();
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

  deleteItem(id: number) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this item!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.value) {
        this.InvServ.deleteSeries_print(id).subscribe(() => {
          this.getSeries_print();
          Swal.fire('Deleted!', 'Item has been deleted successfully!', 'success');
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire('Cancelled', 'Item is safe!', 'info');
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.Series_print.filter = filterValue.trim().toLowerCase();
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
    const parsedSeries_print: Series_printItem[] = data.slice(1).map((item: any, index: number) => {
      const nama_series_print = Array.isArray(item) ? item[1] : item['Nama Series Print'];
      return { nama_series_print } as Series_printItem;
    }).filter((item: { nama_series_print: any; }) => item.nama_series_print);

    this.Series_print.data = [...this.Series_print.data, ...parsedSeries_print];

    parsedSeries_print.forEach(item => {
      this.InvServ.createSeries_print(item.nama_series_print).subscribe({
        next: (res) => console.log('Series_print created:', res),
        error: (err) => console.error('Error creating Series_print:', err),
        complete: () => {
          // After all categories are created, refresh the Kategori data
          this.getSeries_print();
  
          // Show SweetAlert after data is refreshed
          Swal.fire('Success!', 'Series Print imported successfully!', 'success');
        }
      });
    });
  }

  generateQRData(item: any): string {
    return `${item.id} - ${item.nama_series_print}`;
  }
}
