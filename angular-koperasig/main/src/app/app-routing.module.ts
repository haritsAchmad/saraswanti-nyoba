import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BlankComponent } from './layouts/blank/blank.component';
import { FullComponent } from './layouts/full/full.component';
import { HomeComponent } from './pages/home/home.component';

const routes: Routes = [
  {
    path: '',
    component: FullComponent,
    children: [
      {
        path: '',
        redirectTo: '/authentication/login',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./pages/pages.module').then((m) => m.PagesModule),
      },
      {
        path: 'inventory',
        loadChildren: () =>
          import('./pages/inventory/inventory.module').then(
            (m) => m.InventoryModule
          ),
      },
      {
        path: 'kategori',
        loadChildren: () =>
          import('./pages/kategori/kategori.module').then(
            (m) => m.KategoriModule
          ),
      },
      {
        path: 'lokasi',
        loadChildren: () =>
          import('./pages/lokasi/lokasi.module').then(
            (m) => m.LokasiModule
          ),
      },
      {
        path: 'merk',
        loadChildren: () =>
          import('./pages/merk/merk.module').then(
            (m) => m.MerkModule
          ),
      },
      {
        path: 'prosesor',
        loadChildren: () =>
          import('./pages/prosesor/prosesor.module').then(
            (m) => m.ProsesorModule
          ),
      },
      {
        path: 'ram',
        loadChildren: () =>
          import('./pages/ram/ram.module').then(
            (m) => m.RamModule
          ),
      },
      {
        path: 'series',
        loadChildren: () =>
          import('./pages/series/series.module').then(
            (m) => m.SeriesModule
          ),
      },
      {
        path: 'series_print',
        loadChildren: () =>
          import('./pages/series_print/series_print.module').then(
            (m) => m.Series_printModule
          ),
      },
      {
        path: 'storage',
        loadChildren: () =>
          import('./pages/storage/storage.module').then(
            (m) => m.StorageModule
          ),
      },
      {
        path: 'barang',
        loadChildren: () =>
          import('./pages/barang/barang.module').then(
            (m) => m.BarangModule
          ),
      },
      {
        path: 'ui-components',
        loadChildren: () =>
          import('./pages/ui-components/ui-components.module').then(
            (m) => m.UicomponentsModule
          ),
      },
      {
        path: 'extra',
        loadChildren: () =>
          import('./pages/extra/extra.module').then((m) => m.ExtraModule),
      },
      {
        path: 'home',
        component: HomeComponent
      }
    ],
  },
  {
    path: '',
    component: BlankComponent,
    children: [
      {
        path: 'authentication',
        loadChildren: () =>
          import('./pages/authentication/authentication.module').then(
            (m) => m.AuthenticationModule
          ),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
