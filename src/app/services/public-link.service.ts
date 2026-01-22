import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PublicLinkService {
  private baseUrl = environment.apiUrl;
  constructor(private http: HttpClient) {}

  getPublicLink(): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = token
      ? new HttpHeaders().set('Authorization', `Bearer ${token}`)
      : undefined;

    const vendorId = localStorage.getItem('vendorId');

    return this.http.get(
      `${this.baseUrl}/merchants/restaurant/public-link?vendorId=${vendorId}`,
      { headers },
    );
  }

  regeneratePublicLink(): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = token
      ? new HttpHeaders().set('Authorization', `Bearer ${token}`)
      : undefined;

    const vendorId = localStorage.getItem('vendorId');

    return this.http.post(
      `${this.baseUrl}/merchants/restaurant/public-link/regenerate?vendorId=${vendorId}`,
      {},
      { headers },
    );
  }
}
