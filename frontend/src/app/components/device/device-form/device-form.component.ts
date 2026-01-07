import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DeviceService } from '../../../services/device.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, NativeDateAdapter } from '@angular/material/core';

@Component({
  selector: 'app-device-form',
  templateUrl: './device-form.component.html',
  styleUrls: ['./device-form.component.css'],
  providers: [
    { provide: DateAdapter, useClass: NativeDateAdapter, deps: [MAT_DATE_LOCALE] }
  ]
})
export class DeviceFormComponent implements OnInit {
  deviceForm: FormGroup;
  loading = false;
  isEditMode = false;
  deviceId: number | null = null;
  maxDate = new Date(); // Data máxima = hoje (não pode ser futura)

  constructor(
    private fb: FormBuilder,
    private deviceService: DeviceService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {
    this.deviceForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(255)]],
      location: ['', [Validators.required, Validators.maxLength(255)]],
      purchase_date: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.deviceId = +id;
      this.loadDevice();
    }
  }

  loadDevice(): void {
    if (!this.deviceId) return;

    this.loading = true;
    this.deviceService.getDevice(this.deviceId).subscribe({
      next: (device) => {
        // Converter string de data para Date object
        const purchaseDate = device.purchase_date ? new Date(device.purchase_date + 'T00:00:00') : null;
        this.deviceForm.patchValue({
          name: device.name,
          location: device.location,
          purchase_date: purchaseDate
        });
        this.loading = false;
      },
      error: (error) => {
        this.loading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.deviceForm.valid) {
      this.loading = true;
      const formValue = this.deviceForm.value;

      // Formatar data para YYYY-MM-DD
      const purchaseDate = new Date(formValue.purchase_date);
      const formattedDate = purchaseDate.toISOString().split('T')[0];

      const deviceData = {
        name: formValue.name,
        location: formValue.location,
        purchase_date: formattedDate
      };

      if (this.isEditMode && this.deviceId) {
        this.deviceService.updateDevice(this.deviceId, deviceData).subscribe({
          next: () => {
            this.snackBar.open('Dispositivo atualizado com sucesso!', 'Fechar', {
              duration: 3000,
              panelClass: ['success-snackbar']
            });
            this.router.navigate(['/devices']);
          },
          error: (error) => {
            this.loading = false;
          }
        });
      } else {
        this.deviceService.createDevice(deviceData).subscribe({
          next: () => {
            this.snackBar.open('Dispositivo criado com sucesso!', 'Fechar', {
              duration: 3000,
              panelClass: ['success-snackbar']
            });
            this.router.navigate(['/devices']);
          },
          error: (error) => {
            this.loading = false;
          }
        });
      }
    }
  }

  cancel(): void {
    this.router.navigate(['/devices']);
  }
}

