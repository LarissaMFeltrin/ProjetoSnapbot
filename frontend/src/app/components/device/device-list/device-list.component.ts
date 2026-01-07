import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DeviceService, Device, DeviceFilters, PaginatedResponse } from '../../../services/device.service';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-device-list',
  templateUrl: './device-list.component.html',
  styleUrls: ['./device-list.component.css']
})
export class DeviceListComponent implements OnInit {
  displayedColumns: string[] = ['name', 'location', 'purchase_date', 'in_use', 'actions'];
  dataSource = new MatTableDataSource<Device>([]);
  loading = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  filterForm: FormGroup;
  totalItems = 0;
  pageSize = 15;
  currentPage = 0;

  constructor(
    private deviceService: DeviceService,
    private router: Router,
    private snackBar: MatSnackBar,
    private fb: FormBuilder
  ) {
    this.filterForm = this.fb.group({
      location: [''],
      in_use: [null],
      purchase_date_from: [''],
      purchase_date_to: [''],
      sort_by: ['created_at'],
      sort_order: ['desc']
    });

    // Carregar filtros do localStorage
    this.loadFiltersFromStorage();
  }

  ngOnInit(): void {
    this.loadDevices();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  loadDevices(): void {
    this.loading = true;
    const filters: DeviceFilters = {
      page: this.currentPage + 1,
      per_page: this.pageSize,
      ...this.filterForm.value
    };

    // Converter valores do formulário
    const inUseValue = filters.in_use as any;
    if (inUseValue === '' || inUseValue === null || inUseValue === undefined) {
      filters.in_use = null;
    } else if (typeof inUseValue === 'string') {
      filters.in_use = inUseValue === 'true';
    } else {
      filters.in_use = Boolean(inUseValue);
    }

    this.deviceService.getDevices(filters).subscribe({
      next: (response: PaginatedResponse) => {
        this.dataSource.data = response.data;
        this.totalItems = response.total;
        this.loading = false;
        this.saveFiltersToStorage();
      },
      error: (error) => {
        this.loading = false;
        // Erro já tratado pelo ErrorInterceptor
      }
    });
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadDevices();
  }

  applyFilters(): void {
    this.currentPage = 0;
    this.loadDevices();
  }

  clearFilters(): void {
    this.filterForm.reset({
      location: '',
      in_use: null,
      purchase_date_from: '',
      purchase_date_to: '',
      sort_by: 'created_at',
      sort_order: 'desc'
    });
    this.currentPage = 0;
    this.loadDevices();
    localStorage.removeItem('device_filters');
  }

  toggleUse(device: Device): void {
    this.loading = true;
    this.deviceService.toggleUse(device.id).subscribe({
      next: () => {
        this.snackBar.open('Status atualizado com sucesso!', 'Fechar', {
          duration: 3000,
          panelClass: ['success-snackbar']
        });
        this.loadDevices();
      },
      error: (error) => {
        this.loading = false;
      }
    });
  }

  editDevice(device: Device): void {
    this.router.navigate(['/devices/edit', device.id]);
  }

  deleteDevice(device: Device): void {
    if (confirm(`Tem certeza que deseja excluir o dispositivo "${device.name}"?`)) {
      this.loading = true;
      this.deviceService.deleteDevice(device.id).subscribe({
        next: () => {
          this.snackBar.open('Dispositivo excluído com sucesso!', 'Fechar', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
          this.loadDevices();
        },
        error: (error) => {
          this.loading = false;
        }
      });
    }
  }

  newDevice(): void {
    this.router.navigate(['/devices/new']);
  }

  private saveFiltersToStorage(): void {
    const filters = this.filterForm.value;
    localStorage.setItem('device_filters', JSON.stringify(filters));
  }

  private loadFiltersFromStorage(): void {
    const savedFilters = localStorage.getItem('device_filters');
    if (savedFilters) {
      try {
        const filters = JSON.parse(savedFilters);
        this.filterForm.patchValue(filters);
      } catch (e) {
        console.error('Erro ao carregar filtros do localStorage:', e);
      }
    }
  }
}

