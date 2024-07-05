import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { InventoryService } from '../inventory.service';
import { MerkService } from '../../merk/merk.service';
import { SeriesService } from '../../series/series.service';
import { KategoriService } from '../../kategori/kategori.service';
import { ProsesorService } from '../../prosesor/prosesor.service';
import { RamService } from '../../ram/ram.service';
import { StorageService } from '../../storage/storage.service';
import { LokasiService } from '../../lokasi/lokasi.service';

@Component({
  selector: 'app-update-inventory',
  templateUrl: './update-inventory.component.html',
})
export class UpdateInventoryComponent implements OnInit {
  inventoryId: string = '';
  nama_komputer: string = '';
  code_aset: string = '';
  id_merk: string = '';
  merk: any[] = [];
  id_series: string = '';
  series: any[] = [];
  id_kategori: string = '';
  kategori: any[] = [];
  id_prosesor: string = '';
  prosesor: any[] = [];
  id_ram: string = '';
  ram: any[] = [];
  id_storage: string = '';
  storage: any[] = [];
  id_lokasi: string = '';
  lokasi: any[] = [];
  errorMessage: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private invService: InventoryService,
    private merkService: MerkService,
    private serService: SeriesService,
    private katService: KategoriService,
    private proService: ProsesorService,
    private ramService: RamService,
    private stoService: StorageService,
    private lokService: LokasiService,
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      console.log('Route Params:', params);
      this.inventoryId = params['id'];
      console.log('Inventory ID:', this.inventoryId);
      this.loadInventory(this.inventoryId);
    });
    this.loadMerk();
    this.loadSeries();
    this.loadKategori();
    this.loadProsesor();
    this.loadRam();
    this.loadStorage();
    this.loadLokasi();
  }

  loadInventory(id: string) {
    this.invService.getInventoryById(id).subscribe(
      (data: any) => {
        this.nama_komputer = data.nama_komputer;
        this.code_aset = data.code_aset;
        this.id_merk = data.id_merk;
        this.id_series = data.id_series;
        this.id_kategori = data.id_kategori;
        this.id_prosesor = data.id_prosesor;
        this.id_ram = data.id_ram;
        this.id_storage = data.id_storage;
        this.id_lokasi = data.id_lokasi;
      },
      error => {
        this.errorMessage = 'Failed to load inventory details.';
        console.error(error);
      }
    );
  }

  loadMerk() {
    this.merkService.getMerk().subscribe(
      (data: any[]) => {
        this.merk = data;
      },
      error => {
        this.errorMessage = 'Failed to load merk data.';
        console.error(error);
      }
    );
  }

  loadSeries() {
    this.serService.getSeries().subscribe(
      (data: any[]) => {
        this.series = data;
      },
      error => {
        this.errorMessage = 'Failed to load series data.';
        console.error(error);
      }
    );
  }

  loadKategori() {
    this.katService.getKategori().subscribe(
      (data: any[]) => {
        this.kategori = data;
      },
      error => {
        this.errorMessage = 'Failed to load Kategori data.';
        console.error(error);
      }
    );
  }

  loadProsesor() {
    this.proService.getProsesor().subscribe(
      (data: any[]) => {
        this.prosesor = data;
      },
      error => {
        this.errorMessage = 'Failed to load prosesor data.';
        console.error(error);
      }
    );
  }

  loadRam() {
    this.ramService.getRam().subscribe(
      (data: any[]) => {
        this.ram = data;
      },
      error => {
        this.errorMessage = 'Failed to load ram data.';
        console.error(error);
      }
    );
  }

  loadStorage() {
    this.stoService.getStorage().subscribe(
      (data: any[]) => {
        this.storage = data;
      },
      error => {
        this.errorMessage = 'Failed to load storage data.';
        console.error(error);
      }
    );
  }

  loadLokasi() {
    this.lokService.getLokasi().subscribe(
      (data: any[]) => {
        this.lokasi = data;
      },
      error => {
        this.errorMessage = 'Failed to load prosesor data.';
        console.error(error);
      }
    );
  }

  updateInventory() {
    const inventoryIdNumber = parseInt(this.inventoryId, 10);
  
    this.invService.updateInventory(inventoryIdNumber, {
      nama_komputer: this.nama_komputer,
      id_merk: this.id_merk, // Ensure id_merk is included
      id_series: this.id_series,
      id_kategori: this.id_kategori,
      id_prosesor: this.id_prosesor,
      id_ram: this.id_ram,
      id_storage: this.id_storage,
      id_lokasi: this.id_lokasi,
    }).subscribe(
      (response: any) => {
        console.log('Inventory updated successfully:', response);
        this.router.navigate(['/inventory/inventory-list']);
      },
      error => {
        console.error('Error updating inventory:', error);
      }
    );
  }
  

  back() {
    this.router.navigate(['inventory/inventory-list']);
  }
}
