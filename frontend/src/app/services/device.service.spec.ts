import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { DeviceService, PaginatedResponse } from './device.service';
import { environment } from '../../environments/environment';

describe('DeviceService', () => {
  let service: DeviceService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });

    service = TestBed.inject(DeviceService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('getDevices deve enviar filtros como query params', () => {
    const mockResponse: PaginatedResponse = {
      data: [],
      current_page: 1,
      per_page: 15,
      total: 0,
      last_page: 1
    };

    service.getDevices({
      page: 2,
      per_page: 10,
      in_use: true,
      location: 'Escritório',
      purchase_date_from: '2023-01-01',
      purchase_date_to: '2023-12-31',
      sort_by: 'name',
      sort_order: 'asc'
    }).subscribe((res) => {
      expect(res.current_page).toBe(1);
    });

    const req = httpMock.expectOne((r) => r.url === `${environment.apiUrl}/devices`);
    expect(req.request.method).toBe('GET');
    expect(req.request.params.get('page')).toBe('2');
    expect(req.request.params.get('per_page')).toBe('10');
    expect(req.request.params.get('in_use')).toBe('1');
    expect(req.request.params.get('location')).toBe('Escritório');
    expect(req.request.params.get('purchase_date_from')).toBe('2023-01-01');
    expect(req.request.params.get('purchase_date_to')).toBe('2023-12-31');
    expect(req.request.params.get('sort_by')).toBe('name');
    expect(req.request.params.get('sort_order')).toBe('asc');

    req.flush(mockResponse);
  });

  it('toggleUse deve chamar PATCH /devices/{id}/use', () => {
    service.toggleUse(5).subscribe();

    const req = httpMock.expectOne(`${environment.apiUrl}/devices/5/use`);
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual({});
    req.flush({ id: 5, name: 'X', location: 'Y', purchase_date: '2023-01-01', in_use: true, user_id: 1 });
  });
});


