import { Component, OnInit, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { SeriesService } from '../series.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { ModalDialogComponent } from 'src/app/series_modal-dialog/modal-dialog.component';
import { Papa } from 'ngx-papaparse';
import * as XLSX from 'xlsx';
import { SeriesItem } from './series-item.model';
import { QRCodeModule } from 'angularx-qrcode';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-series-list',
  templateUrl: './series-list.component.html',
  styleUrls: ['./series-list.component.css']
})
export class SeriesListComponent implements OnInit, AfterViewInit {
  Series = new MatTableDataSource<any>();
  errorMessage: string = '';
  currentItem: any = null;
  editInvForm: FormGroup;
  editFormVisible: boolean = false;
  displayedColumns: string[] = ['id_series', 'nama_series', 'qrcode', 'actions'];

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('fileInput') fileInput!: ElementRef;
  papa: Papa;

  constructor(
    private router: Router,
    private InvServ: SeriesService,
    private dialog: MatDialog,
    papa: Papa,
  ) {
    this.papa = papa; 
    this.editInvForm = new FormGroup({
      nama_series: new FormControl('', [Validators.required]),
    });
  }

  ngOnInit() {
    this.getSeries();
  }

  ngAfterViewInit() {
    this.Series.sort = this.sort;
  }

  getSeries() {
    this.InvServ.getSeries().subscribe(
      (data: any) => {
        if (Array.isArray(data)) {
          this.Series.data = data.map(item => ({
            id_series: item.id_series,
            nama_series: item.nama_series,
          }));
        } else if (data && typeof data === 'object') {
          // If data is an object, convert it to an array
          this.Series.data = Object.keys(data).map(key => ({
            id_series: key,
            nama_series: data[key].nama_series,
          }));
        } else {
          console.error('Data format is not recognized:', data);
        }
      },
      (error) => {
        console.error('Error loading Series:', error);
      }
    );
  }

  openDialog(action: string, item?: any): void {
    const form = new FormGroup({
      nama_series: new FormControl(item ? item.nama_series : '', [Validators.required])
    });
  
    const dialogRef = this.dialog.open(ModalDialogComponent, {
      width: '300px',
      data: { title: action === 'Create' ? 'Create Item' : 'Edit Item', form }
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const nama_series = result.nama_series.trim(); // Ensure no leading/trailing whitespace
  
        if (action === 'Create') {
          this.InvServ.createSeries(nama_series).subscribe(() => {
            this.getSeries();
            Swal.fire('Success!', 'Item created successfully!', 'success');
          });
        } else if (action === 'Edit' && item) {
          this.InvServ.updateSeries(item.id_series, nama_series).subscribe(() => {
            this.getSeries();
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

  deleteItem(id_series: number) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this item!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.value) {
        this.InvServ.deleteSeries(id_series).subscribe(() => {
          this.getSeries();
          Swal.fire('Deleted!', 'Item has been deleted successfully!', 'success');
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire('Cancelled', 'Item is safe!', 'info');
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.Series.filter = filterValue.trim().toLowerCase();
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
    const parsedSeries: SeriesItem[] = data.slice(1).map((item: any, index: number) => {
      const nama_series = Array.isArray(item) ? item[1] : item['Nama Series'];
      return { nama_series } as SeriesItem;
    }).filter((item: { nama_series: any; }) => item.nama_series);

    this.Series.data = [...this.Series.data, ...parsedSeries];

    parsedSeries.forEach(item => {
      this.InvServ.createSeries(item.nama_series).subscribe({
        next: (res) => console.log('Series created:', res),
        error: (err) => console.error('Error creating Series:', err),
        complete: () => {
          // After all categories are created, refresh the Kategori data
          this.getSeries();
  
          // Show SweetAlert after data is refreshed
          Swal.fire('Success!', 'Series imported successfully!', 'success');
        }
      });
    });
  }

  generateQRData(item: any): string {
    return `${item.id_series} - ${item.nama_series}`;
  }
}
