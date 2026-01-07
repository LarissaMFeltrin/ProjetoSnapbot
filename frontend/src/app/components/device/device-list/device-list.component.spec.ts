import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { DeviceService } from '../../../services/device.service';
import { DeviceListComponent } from './device-list.component';

describe('DeviceListComponent', () => {
  let component: DeviceListComponent;
  let fixture: ComponentFixture<DeviceListComponent>;
  let deviceService: jasmine.SpyObj<DeviceService>;

  beforeEach(async () => {
    deviceService = jasmine.createSpyObj<DeviceService>('DeviceService', ['getDevices', 'toggleUse', 'deleteDevice']);
    deviceService.getDevices.and.returnValue(of({
      data: [],
      current_page: 1,
      per_page: 15,
      total: 0,
      last_page: 1
    }));

    await TestBed.configureTestingModule({
      declarations: [DeviceListComponent],
      imports: [ReactiveFormsModule],
      providers: [
        { provide: DeviceService, useValue: deviceService },
        { provide: Router, useValue: jasmine.createSpyObj<Router>('Router', ['navigate']) },
        { provide: MatSnackBar, useValue: jasmine.createSpyObj<MatSnackBar>('MatSnackBar', ['open']) }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      // Evita dependência de ControlValueAccessor do Angular Material no template.
      .overrideTemplate(DeviceListComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(DeviceListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve criar e carregar dispositivos no ngOnInit', () => {
    expect(component).toBeTruthy();
    expect(deviceService.getDevices).toHaveBeenCalled();
  });

  it('applyFilters deve resetar página e recarregar', () => {
    component.currentPage = 3;
    component.applyFilters();
    expect(component.currentPage).toBe(0);
    expect(deviceService.getDevices).toHaveBeenCalled();
  });
});


