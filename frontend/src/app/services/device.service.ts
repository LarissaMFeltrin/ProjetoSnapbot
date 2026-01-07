import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Device {
    id: number;
    name: string;
    location: string;
    purchase_date: string;
    in_use: boolean;
    user_id: number;
    deleted_at?: string | null;
    created_at?: string;
    updated_at?: string;
}

export interface DeviceFilters {
    page?: number;
    per_page?: number;
    in_use?: boolean | null;
    location?: string;
    purchase_date_from?: string;
    purchase_date_to?: string;
    sort_by?: string;
    sort_order?: 'asc' | 'desc';
}

export interface PaginatedResponse {
    data: Device[];
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
}

@Injectable({
    providedIn: 'root'
})
export class DeviceService {
    private apiUrl = `${environment.apiUrl}/devices`;

    constructor(private http: HttpClient) { }

    getDevices(filters?: DeviceFilters): Observable<PaginatedResponse> {
        let params = new HttpParams();

        if (filters) {
            if (filters.page) params = params.set('page', filters.page.toString());
            if (filters.per_page) params = params.set('per_page', filters.per_page.toString());
            if (filters.in_use !== null && filters.in_use !== undefined) {
                params = params.set('in_use', filters.in_use ? '1' : '0');
            }
            if (filters.location) params = params.set('location', filters.location);
            if (filters.purchase_date_from) params = params.set('purchase_date_from', filters.purchase_date_from);
            if (filters.purchase_date_to) params = params.set('purchase_date_to', filters.purchase_date_to);
            if (filters.sort_by) params = params.set('sort_by', filters.sort_by);
            if (filters.sort_order) params = params.set('sort_order', filters.sort_order);
        }

        return this.http.get<PaginatedResponse>(this.apiUrl, { params });
    }

    getDevice(id: number): Observable<Device> {
        return this.http.get<Device>(`${this.apiUrl}/${id}`);
    }

    createDevice(device: Partial<Device>): Observable<Device> {
        return this.http.post<Device>(this.apiUrl, device);
    }

    updateDevice(id: number, device: Partial<Device>): Observable<Device> {
        return this.http.put<Device>(`${this.apiUrl}/${id}`, device);
    }

    deleteDevice(id: number): Observable<{ message: string }> {
        return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`);
    }

    toggleUse(id: number): Observable<Device> {
        return this.http.patch<Device>(`${this.apiUrl}/${id}/use`, {});
    }
}

