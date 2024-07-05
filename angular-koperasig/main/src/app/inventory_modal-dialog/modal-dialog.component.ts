import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MerkService } from '../pages/merk/merk.service';
import { SeriesService } from '../pages/series/series.service';
import { KategoriService } from '../pages/kategori/kategori.service';
import { ProsesorService } from '../pages/prosesor/prosesor.service';
import { RamService } from '../pages/ram/ram.service';
import { StorageService } from '../pages/storage/storage.service';
import { LokasiService } from '../pages/lokasi/lokasi.service';
import { formatDate } from '@angular/common';
import { DecimalPipe } from '@angular/common';

interface DialogData {
  title: string;
  form: FormGroup;
}

@Component({
  selector: 'app-modal-dialog',
  templateUrl: './modal-dialog.component.html',
  providers: [DecimalPipe]
})
export class ModalDialogComponent implements OnInit {
  merk: any[] = [];
  series: any[] = [];
  kategori: any[] = [];
  prosesor: any[] = [];
  ram: any[] = [];
  storage: any[] = [];
  lokasi: any[] = [];

  constructor(
    public dialogRef: MatDialogRef<ModalDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private fb: FormBuilder,
    private merkService: MerkService,
    private seriesService: SeriesService,
    private kategoriService: KategoriService,
    private prosesorService: ProsesorService,
    private ramService: RamService,
    private storageService: StorageService,
    private lokasiService: LokasiService,
    private decimalPipe: DecimalPipe,
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.getData();
    this.formatCostValue();
  }

  private initForm(): void {
    this.data.form = this.fb.group({
      nama_komputer: [this.data.form.value.nama_komputer || '', Validators.required],
      id_merk: [this.data.form.value.id_merk || '', Validators.required],
      id_series: [this.data.form.value.id_series || '', Validators.required],
      id_kategori: [this.data.form.value.id_kategori || '', Validators.required],
      id_prosesor: [this.data.form.value.id_prosesor || '', Validators.required],
      id_ram: [this.data.form.value.id_ram || '', Validators.required],
      id_storage: [this.data.form.value.id_storage || '', Validators.required],
      id_lokasi: [this.data.form.value.id_lokasi || '', Validators.required],
      ip_dhcp: [this.data.form.value.ip_dhcp || ''],
      ip_static: [this.data.form.value.ip_static || ''],
      mac_addres: [this.data.form.value.mac_addres || ''],
      serial_number: [this.data.form.value.serial_number || ''],
      serial_key_windows: [this.data.form.value.serial_key_windows || ''],
      cost: [this.data.form.value.cost || ''],
      vendor: [this.data.form.value.vendor || ''],
      tgl_beli: [this.parseDate(this.data.form.value.tgl_beli) || null],
    });
  }

  private parseDate(date: string): Date | null {
    if (!date) {
      return null;
    }
    const parsedDate = new Date(date);
    return isNaN(parsedDate.getTime()) ? null : parsedDate;
  }

  private formatDateForDatabase(date: Date | null): string | null {
    return date ? formatDate(date, 'yyyy-MM-dd', 'en') : null;
  }

  onCostChange(event: any): void {
    let value = event.target.value.replace(/,/g, ''); // Remove existing commas
    if (!isNaN(value)) {
      const formattedValue = this.decimalPipe.transform(value, '1.0-0');
      const costControl = this.data.form.get('cost');
      if (costControl) {
        costControl.setValue(formattedValue);
      }
    }
  }

  private formatCostValue(): void {
    const costControl = this.data.form.get('cost');
    if (costControl) {
      const costValue = costControl.value;
      if (costValue) {
        const formattedValue = this.decimalPipe.transform(costValue, '1.0-0');
        costControl.setValue(formattedValue, { emitEvent: false });
      }
    }
  }
  

  onCancelClick(): void {
    this.dialogRef.close();
  }

  onSaveClick(): void {
    if (this.data.form.valid) {
      const formValue = this.data.form.value;
      formValue.tgl_beli = this.formatDateForDatabase(formValue.tgl_beli); // Format date before sending it to the server
      formValue.cost = formValue.cost.replace(/,/g, ''); // Remove commas from cost value
      this.dialogRef.close(formValue);
    }
  }

  getData() {
    this.getMerkData();
    this.getSeriesData();
    this.getKategoriData();
    this.getProsesorData();
    this.getRamData();
    this.getStorageData();
    this.getLokasiData();
  }

  getMerkData() {
    this.merkService.getMerk().subscribe(
      (merkList: any[]) => {
        this.merk = merkList;
      },
      (error) => {
        console.error('Error fetching merk list:', error);
      }
    );
  }

  getSeriesData() {
    this.seriesService.getSeries().subscribe(
      (seriesList: any[]) => {
        this.series = seriesList;
      },
      (error) => {
        console.error('Error fetching series list:', error);
      }
    );
  }

  getKategoriData() {
    this.kategoriService.getKategori().subscribe(
      (kategoriList: any[]) => {
        this.kategori = kategoriList;
      },
      (error) => {
        console.error('Error fetching kategori list:', error);
      }
    );
  }

  getProsesorData() {
    this.prosesorService.getProsesor().subscribe(
      (prosesorList: any[]) => {
        this.prosesor = prosesorList;
      },
      (error) => {
        console.error('Error fetching prosesor list:', error);
      }
    );
  }

  getRamData() {
    this.ramService.getRam().subscribe(
      (ramList: any[]) => {
        this.ram = ramList;
      },
      (error) => {
        console.error('Error fetching ram list:', error);
      }
    );
  }

  getStorageData() {
    this.storageService.getStorage().subscribe(
      (storageList: any[]) => {
        this.storage = storageList;
      },
      (error) => {
        console.error('Error fetching storage list:', error);
      }
    );
  }

  getLokasiData() {
    this.lokasiService.getLokasi().subscribe(
      (lokasiList: any[]) => {
        this.lokasi = lokasiList;
      },
      (error) => {
        console.error('Error fetching lokasi list:', error);
      }
    );
  }
}
