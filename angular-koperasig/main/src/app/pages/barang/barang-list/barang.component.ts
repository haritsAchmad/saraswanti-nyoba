import { Component, OnInit, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { BarangService } from '../barang.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ModalDialogComponent } from 'src/app/inventory_modal-dialog/modal-dialog.component';
import { Papa } from 'ngx-papaparse';
import * as XLSX from 'xlsx';
import Swal from 'sweetalert2';
import { MerkService } from '../../merk/merk.service';
//import { InventoryQrCodeModalComponent } from 'src/app/inventory-qr-code-modal/inventory-qr-code-modal.component';
import { IpInfoModalComponent } from 'src/app/ip-info-modal/ip-info-modal.component';
import { SerialInfoModalComponent } from 'src/app/serial-info-modal/serial-info-modal.component';


@Component({
  selector: 'app-barang',
  templateUrl: './barang.component.html',
  styleUrl: './barang.component.scss'
})
export class BarangComponent implements OnInit, AfterViewInit {
  barang = new MatTableDataSource<any>();
  //merk: any[] = [];
  errorMessage: string = '';
  currentItem: any = null;
  editFormVisible: boolean = false;
  displayedColumns: string[] = ['id_barang', 'kode_barang', 'nama_barang', 'id_kategori_barang', 'size', 'actions', ];

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('fileInput') fileInput!: ElementRef;

  constructor(
    private router: Router,
    private barServ: BarangService,
    private dialog: MatDialog,
    private papa: Papa,
    private merkService: MerkService,
  ) {}

  ngOnInit() {
    this.getBarang();
  }

  ngAfterViewInit() {
    this.barang.sort = this.sort;
  }

  /*
  showQrCode(item: any): void {
    const dialogRef = this.dialog.open(InventoryQrCodeModalComponent, {
      width: '500px',
      data: { qrCodeData: this.generateQRData(item) }
    });
  
    dialogRef.afterClosed().subscribe(result => {
      // handle the result if needed
    });
  }
    */

  getBarang() {
    this.barServ.getBarang().subscribe(
      (data: any) => {
        if (Array.isArray(data)) {
          this.barang.data = data;
        } else if (data && typeof data === 'object') {
          this.barang.data = Object.keys(data).map(key => ({
            id_barang: key,
            nama_barang: data[key].nama_barang,
            kode_barang: data[key].kode_barang,
            size: data[key].size,
            total_stok: data[key].total_stok,
            harga: data[key].harga,
            id_kategori_barang: data[key].id_kategori_barang,
            id_merk_barang: data[key].id_merk_barang,
            keterangan: data[key].keterangan,
            dihapus: data[key].dihapus,
            modal: data[key].modal,
          }));
        } else {
          console.error('Data format is not recognized:', data);
        }
      },
      (error) => {
        console.error('Error loading inventory:', error);
      }
    );
  }

  openDialog(action: string, item?: any): void {
    const form = new FormGroup({
      nama_barang: new FormControl(item ? item.nama_barang : '', [Validators.required]),
      size: new FormControl(item ? item.size : '', [Validators.required]),
      total_stok: new FormControl(item ? item.total_stok : '', [Validators.required]),
      harga: new FormControl(item ? item.harga : '', [Validators.required]),
      id_kategori_barang: new FormControl(item ? item.id_kategori_barang : '', [Validators.required]),
      id_merk_barang: new FormControl(item ? item.id_merk_barang : '', [Validators.required]),
      keterangan: new FormControl(item ? item.keterangan : '', [Validators.required]),
      dihapus: new FormControl(item ? item.dihapus : '', [Validators.required]),
      modal: new FormControl(item ? item.modal : '', [Validators.required]),
    });

    const dialogRef = this.dialog.open(ModalDialogComponent, {
      width: '1000px',
      data: { title: action === 'Create' ? 'Create Item' : 'Edit Item', form }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const { nama_barang, size, total_stok, harga, id_kategori_barang, id_merk_barang, keterangan, dihapus, modal } = result;
        if (action === 'Create') {
          this.barServ.createBarang({
            nama_barang: nama_barang.trim(),
            size: size,
            total_stok: total_stok,
            harga: harga,
            id_kategori_barang: id_kategori_barang,
            id_merk_barang: id_merk_barang,
            keterangan: keterangan,
            dihapus: dihapus,
            modal: modal,
          }).subscribe(() => {
            this.getBarang();
            Swal.fire('Success!', 'Item created successfully!', 'success');
          }, error => {
            console.error('Error creating item:', error);
            Swal.fire('Error', 'Failed to create item.', 'error');
          });
        } else if (action === 'Edit' && item) {
          this.barServ.updateBarang(item.id_barang, {
            nama_barang: nama_barang.trim(),
            size: size,
            total_stok: total_stok,
            harga: harga,
            id_kategori_barang: id_kategori_barang,
            id_merk_barang: id_merk_barang,
            keterangan: keterangan,
            dihapus: dihapus,
            modal: modal,
          }).subscribe(() => {
            this.getBarang();
            Swal.fire('Success!', 'Item updated successfully!', 'success');
          }, error => {
            console.error('Error updating item:', error);
            Swal.fire('Error', 'Failed to update item.', 'error');
          });
        }
      }
    });
  }

  showIpInfo(item: any): void {
    const dialogRef = this.dialog.open(IpInfoModalComponent, {
      width: '300px',
      data: {
        ipDhcp: item.ip_dhcp,
        ipStatic: item.ip_static,
        macAddress: item.mac_addres
      }
    });
  
    dialogRef.afterClosed().subscribe(result => {
      // handle the result if needed
    });
  }

  showSerial(item: any): void {
    const dialogRef = this.dialog.open(SerialInfoModalComponent, {
      width: '300px',
      data: {
        ram: item.nama_ram,
        storage: item.nama_storage,
        serial_number: item.serial_number,
        serial_key_windows: item.serial_key_windows,
      }
    });
  
    dialogRef.afterClosed().subscribe(result => {
      // handle the result if needed
    });
  }
  

  addItem() {
    this.openDialog('Create');
  }

  editItem(item: any) {
    this.openDialog('Edit', item);
  }

  deleteItem(id_barang: number) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this item!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.value) {
        this.barServ.deleteBarang(id_barang).subscribe(() => {
          this.getBarang();
          Swal.fire('Deleted!', 'Item has been deleted successfully!', 'success');
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire('Cancelled', 'Item is safe!', 'info');
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.barang.filter = filterValue.trim().toLowerCase();
  }

  importCSV() {
    this.fileInput.nativeElement.click();
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const fileType = file.name.split('.').pop().toLowerCase();
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
    this.papa.parse(file, {
      complete: (result: { data: any; }) => {
        const parsedData = result.data.map((row: any) => ({
          nama_komputer: row['Nama Komputer'] || '',
          //code_aset: `SIG.PC.${this.getMaxId() + 1}`,
          id_merk: row['ID Merk'] || null,
          id_series: row['ID Series'] || null,
          id_kategori: row['ID Kategori'] || null,
          id_prosesor: row['ID Prosesor'] || null,
          id_ram: row['ID RAM'] || null,
          id_storage: row['ID Storage'] || null,
          id_lokasi: row['ID Lokasi'] || null,
          ip_dhcp: row['IP DHCP'] || '',
          ip_static: row['IP Static'] || '',
          mac_addres: row['Mac Address'] || '',
          serial_number: row['Serial Number'] || '',
          serial_key_windows: row['Serial Key Windows'] || '',
          cost: row['Cost'] || null,
          vendor: row['Vendor'] || '',
          tgl_beli: row['Tanggal Pembelian'] || null,
        }));
        this.handleParsedData(parsedData);
      },
      header: true
    });
  }
  

  parseXLSX(file: File) {
    const reader = new FileReader();
    reader.onload = (event) => {
      const data = new Uint8Array(event.target?.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const json: any[][] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
  
      if (json.length > 1) {
        const headers = json[0];
        const dataRows = json.slice(1);
  
        const parsedData = dataRows.map((row) => {
          const getColumnValue = (header: string) => {
            const index = headers.indexOf(header);
            return index !== -1 ? row[index] : '';
          };
  
          return {
            nama_komputer: getColumnValue('Nama Komputer'),
            //code_aset: `SIG.PC.${this.getMaxId() + 1}`,
            id_merk: getColumnValue('ID Merk') || null,
            id_series: getColumnValue('ID Series') || null,
            id_kategori: getColumnValue('ID Kategori') || null,
            id_prosesor: getColumnValue('ID Prosesor') || null,
            id_ram: getColumnValue('ID RAM') || null,
            id_storage: getColumnValue('ID Storage') || null,
            id_lokasi: getColumnValue('ID Lokasi') || null,
            ip_dhcp: getColumnValue('IP DHCP'),
            ip_static: getColumnValue('IP Static'),
            mac_addres: getColumnValue('Mac Address'),
            serial_number: getColumnValue('Serial Number'),
            serial_key_windows: getColumnValue('Serial Key Windows'),
            cost: getColumnValue('Cost'),
            vendor: getColumnValue('Vendor'),
            tgl_beli: getColumnValue('Tanggal Pembelian'),
          };
        });
  
        this.handleParsedData(parsedData);
      } else {
        console.error('No data rows found in the XLSX file.');
      }
    };
    reader.readAsArrayBuffer(file);
  }
  

  handleParsedData(data: any) {
    this.errorMessage = '';
  
    data.forEach((item: any) => {
      console.log('Sending item to server:', item);
      this.barServ.createBarang(item).subscribe(
        () => {
          this.getBarang();
          Swal.fire('Success!', 'File imported successfully!', 'success');
        },
        (error) => {
          console.error('Error creating inventory item:', error);
          this.errorMessage = 'Failed to create inventory item.';
          Swal.fire('Error', 'Failed to create inventory item.', 'error');
        }
      );
    });
  }
  

  getMaxId(): number {
    return this.barang.data.reduce((max, item) => {
      if (item.kode_barang) {
        const id_barang = parseInt(item.kode_barang.split('.').pop() || '0', 10);
        return Math.max(max, id_barang);
      }
      return max;
    }, 0);
  }

  generateBarcodeData(item: any): string {
    return `${item.id_barang} - ${item.kode_barang} - ${item.nama_barang}`;
  }

  generateQRData(item: any): string {
    return `
    Data Barang

    No: ${item.id_barang} 
    Kode Barang: ${item.kode_barang} 
    Nama Barang: ${item.nama_barang} 
    
    `;
  }
}

