import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { DeviceService } from '../../../services/device.service';
import { DeviceFormComponent } from './device-form.component';

describe('DeviceFormComponent', () => {
  let component: DeviceFormComponent;
  let fixture: ComponentFixture<DeviceFormComponent>;
  let deviceService: jasmine.SpyObj<DeviceService>;
  let router: jasmine.SpyObj<Router>;

  function createActivatedRouteMock(id: string | null) {
    return {
      snapshot: {
        paramMap: {
          get: (key: string) => (key === 'id' ? id : null)
        }
      }
    };
  }

  beforeEach(async () => {
    deviceService = jasmine.createSpyObj<DeviceService>('DeviceService', ['getDevice', 'createDevice', 'updateDevice']);
    router = jasmine.createSpyObj<Router>('Router', ['navigate']);

    await TestBed.configureTestingModule({
      declarations: [DeviceFormComponent],
      imports: [ReactiveFormsModule],
      providers: [
        { provide: DeviceService, useValue: deviceService },
        { provide: Router, useValue: router },
        { provide: ActivatedRoute, useValue: createActivatedRouteMock(null) },
        { provide: MatSnackBar, useValue: jasmine.createSpyObj<MatSnackBar>('MatSnackBar', ['open']) }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(DeviceFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve criar e iniciar em modo criação', () => {
    expect(component).toBeTruthy();
    expect(component.isEditMode).toBeFalse();
  });

  it('onSubmit deve chamar createDevice quando não for edit', () => {
    deviceService.createDevice.and.returnValue(of({
      id: 1,
      name: 'iPhone',
      location: 'SP',
      purchase_date: '2023-01-01',
      in_use: false,
      user_id: 1
    }));

    component.deviceForm.patchValue({
      name: 'iPhone',
      location: 'SP',
      purchase_date: new Date('2023-01-01T00:00:00')
    });

    component.onSubmit();

    expect(deviceService.createDevice).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/devices']);
  });
});


