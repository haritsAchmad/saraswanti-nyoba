import { Component, OnInit, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { InventoryService } from '../inventory.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ModalDialogComponent } from 'src/app/inventory_modal-dialog/modal-dialog.component';
import { Papa } from 'ngx-papaparse';
import * as XLSX from 'xlsx';
import Swal from 'sweetalert2';
import { MerkService } from '../../merk/merk.service';
import { InventoryQrCodeModalComponent } from 'src/app/inventory-qr-code-modal/inventory-qr-code-modal.component';
import { IpInfoModalComponent } from 'src/app/ip-info-modal/ip-info-modal.component';
import { SerialInfoModalComponent } from 'src/app/serial-info-modal/serial-info-modal.component';

@Component({
  selector: 'app-inventory-list',
  templateUrl: './inventory-list.component.html',
  styleUrls: ['./inventory-list.component.css']
})
export class InventoryListComponent implements OnInit, AfterViewInit {
  inventory = new MatTableDataSource<any>();
  merk: any[] = [];
  errorMessage: string = '';
  currentItem: any = null;
  editFormVisible: boolean = false;
  displayedColumns: string[] = ['id', 'code_aset', 'nama_komputer', 'nama_merk', 'tgl_beli',  'actions'];

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('fileInput') fileInput!: ElementRef;

  constructor(
    private router: Router,
    private invServ: InventoryService,
    private dialog: MatDialog,
    private papa: Papa,
    private merkService: MerkService,
  ) {}

  ngOnInit() {
    this.getInventory();
  }

  ngAfterViewInit() {
    this.inventory.sort = this.sort;
  }

  showQrCode(item: any): void {
    const dialogRef = this.dialog.open(InventoryQrCodeModalComponent, {
      width: '500px',
      data: { qrCodeData: this.generateQRData(item) }
    });
  
    dialogRef.afterClosed().subscribe(result => {
      // handle the result if needed
    });
  }

  getInventory() {
    this.invServ.getInventory().subscribe(
      (data: any) => {
        if (Array.isArray(data)) {
          this.inventory.data = data;
        } else if (data && typeof data === 'object') {
          this.inventory.data = Object.keys(data).map(key => ({
            id: key,
            nama_komputer: data[key].nama_komputer,
            code_aset: data[key].code_aset,
            ip_dhcp: data[key].ip_dhcp,
            ip_static: data[key].ip_static,
            mac_addres: data[key].mac_addres,
            serial_number: data[key].serial_number,
            serial_key_windows: data[key].serial_key_windows,
            cost: data[key].cost,
            vendor: data[key].vendor,
            tgl_beli: data[key].tgl_beli,
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

  getMerkName(id: number): string {
    const merk = this.merk.find(m => m.id_merk === id);
    return merk ? merk.nama_merk : '';
  }

  openDialog(action: string, item?: any): void {
    const form = new FormGroup({
      nama_komputer: new FormControl(item ? item.nama_komputer : '', [Validators.required]),
      id_merk: new FormControl(item ? item.id_merk : '', [Validators.required]),
      id_series: new FormControl(item ? item.id_series : '', [Validators.required]),
      id_kategori: new FormControl(item ? item.id_kategori : '', [Validators.required]),
      id_prosesor: new FormControl(item ? item.id_prosesor : '', [Validators.required]),
      id_ram: new FormControl(item ? item.id_ram : '', [Validators.required]),
      id_storage: new FormControl(item ? item.id_storage : '', [Validators.required]),
      id_lokasi: new FormControl(item ? item.id_lokasi : '', [Validators.required]),
      ip_dhcp: new FormControl(item ? item.ip_dhcp : '', [Validators.required]),
      ip_static: new FormControl(item ? item.ip_static : '', [Validators.required]),
      mac_addres: new FormControl(item ? item.mac_addres : '', [Validators.required]),
      serial_number: new FormControl(item ? item.serial_number : '', [Validators.required]),
      serial_key_windows: new FormControl(item ? item.serial_key_windows : '', [Validators.required]),
      cost: new FormControl(item ? item.cost : '', [Validators.required]),
      vendor: new FormControl(item ? item.vendor : '', [Validators.required]),
      tgl_beli: new FormControl(item ? item.tgl_beli : '', [Validators.required]),
    });

    const dialogRef = this.dialog.open(ModalDialogComponent, {
      width: '1000px',
      data: { title: action === 'Create' ? 'Create Item' : 'Edit Item', form,  merkList: this.merk }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const { nama_komputer, id_merk, id_series, id_kategori, id_prosesor, id_ram, id_storage, id_lokasi, ip_dhcp, ip_static, mac_addres, serial_number, serial_key_windows, vendor, cost, tgl_beli } = result;
        if (action === 'Create') {
          this.invServ.createInventory({
            nama_komputer: nama_komputer.trim(),
            id_merk: id_merk,
            id_series: id_series,
            id_kategori: id_kategori,
            id_prosesor: id_prosesor,
            id_ram: id_ram,
            id_storage: id_storage,
            id_lokasi: id_lokasi,
            ip_dhcp: ip_dhcp,
            ip_static: ip_static,
            mac_addres: mac_addres,
            serial_number: serial_number,
            serial_key_windows: serial_key_windows,
            cost: cost,
            vendor: vendor,
            tgl_beli: tgl_beli,
          }).subscribe(() => {
            this.getInventory();
            Swal.fire('Success!', 'Item created successfully!', 'success');
          }, error => {
            console.error('Error creating item:', error);
            Swal.fire('Error', 'Failed to create item.', 'error');
          });
        } else if (action === 'Edit' && item) {
          this.invServ.updateInventory(item.id, {
            nama_komputer: nama_komputer.trim(),
            id_merk: id_merk,
            id_series: id_series,
            id_kategori: id_kategori,
            id_prosesor: id_prosesor,
            id_ram: id_ram,
            id_storage: id_storage,
            id_lokasi: id_lokasi,
            ip_dhcp: ip_dhcp,
            ip_static: ip_static,
            mac_addres: mac_addres,
            serial_number: serial_number,
            serial_key_windows: serial_key_windows,
            cost: cost,
            vendor: vendor,
            tgl_beli: tgl_beli,
          }).subscribe(() => {
            this.getInventory();
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
        this.invServ.deleteInventory(id).subscribe(() => {
          this.getInventory();
          Swal.fire('Deleted!', 'Item has been deleted successfully!', 'success');
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire('Cancelled', 'Item is safe!', 'info');
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.inventory.filter = filterValue.trim().toLowerCase();
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
      this.invServ.createInventory(item).subscribe(
        () => {
          this.getInventory();
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
    return this.inventory.data.reduce((max, item) => {
      if (item.code_aset) {
        const id = parseInt(item.code_aset.split('.').pop() || '0', 10);
        return Math.max(max, id);
      }
      return max;
    }, 0);
  }

  generateBarcodeData(item: any): string {
    return `${item.id} - ${item.code_aset} - ${item.nama_komputer}`;
  }

  generateQRData(item: any): string {
    return `
    Data Inventory

    No: ${item.id} 
    Kode Aset: ${item.code_aset} 
    Nama Komputer: ${item.nama_komputer} 
    Merk: ${item.nama_merk} 
    Series: ${item.nama_series} 
    Kategori: ${item.nama_kategori} 
    Prosesor: ${item.nama_prosesor} 
    RAM: ${item.nama_ram} 
    Storage: ${item.nama_storage} 
    Lokasi: ${item.nama_lokasi} 
    IP DHCP: ${item.ip_dhcp} 
    IP Static: ${item.ip_static} 
    Mac Address: ${item.mac_addres} 
    Serial Number: ${item.serial_number} 
    Serial Key Windows: 
    ${item.serial_key_windows} 
    Cost: ${item.cost} 
    Vendor: ${item.vendor} 
    Tanggal Pembelian: ${item.tgl_beli}
    `;
  }
}
