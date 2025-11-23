import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MenueServicesService {
  private baseUrl = environment.apiUrl;
  constructor(private http: HttpClient, private router: Router) {}

  addMenus(data: any) {
    const token = localStorage.getItem('token');
    const headers = token
      ? new HttpHeaders().set('Authorization', `Bearer ${token}`)
      : undefined;
    const options = headers ? { headers } : {};
    console.log(JSON.stringify(data));
    return this.http.post(
      `${this.baseUrl}/merchants/restaurantProduct`,
      data,
      options
    );
  }

  addCategories(data: any) {
    const token = localStorage.getItem('token');
    const headers = token
      ? new HttpHeaders().set('Authorization', `Bearer ${token}`)
      : undefined;
    const options = headers ? { headers } : {};
    return this.http.post(
      `${this.baseUrl}/merchants/restaurantCategories`,
      data,
      options
    );
  }

  addKiranaCategories(data: any) {
    const token = localStorage.getItem('token');
    const headers = token
      ? new HttpHeaders().set('Authorization', `Bearer ${token}`)
      : undefined;
    const options = headers ? { headers } : {};
    return this.http.post(
      `${this.baseUrl}/merchants/kiranaCategories`,
      data,
      options
    );
  }

  updateItems(data: any) {
    const token = localStorage.getItem('token');
    const headers = token
      ? new HttpHeaders().set('Authorization', `Bearer ${token}`)
      : undefined;
    const options = headers ? { headers } : {};
    return this.http.put(
      `${this.baseUrl}/merchants/restaurantProduct`,
      data,
      options
    );
  }

  deleteItem(data: any) {
    console.log(data);
    const token = localStorage.getItem('token');
    const headers = token
      ? new HttpHeaders().set('Authorization', `Bearer ${token}`)
      : undefined;
    const options = headers ? { headers } : {};
    return this.http.delete(
      `${this.baseUrl}/merchants/restProduct?id=${data.id}`,
      options
    );
  }

  deleteCGItem(data: any) {
    console.log(data);
    const token = localStorage.getItem('token');
    const headers = token
      ? new HttpHeaders().set('Authorization', `Bearer ${token}`)
      : undefined;
    const options = headers ? { headers } : {};
    return this.http.delete(
      `${this.baseUrl}/merchants/restItem?id=${data}`,
      options
    );
    // http://localhost:8080/merchants/restItem?id=C23
  }

  getCategories(): Observable<any> {
    // Changed to return Observable
    const token = localStorage.getItem('token');
    const headers = token
      ? new HttpHeaders().set('Authorization', `Bearer ${token}`)
      : undefined;
    let vendorId = localStorage.getItem('vendorId');
    const options = {
      headers: headers,
    };
    return this.http.get(
      `${this.baseUrl}/merchants/categories?vendorId=${vendorId}`,
      options
    );
  }

  getKiranaCategories(): Observable<any> {
    // Changed to return Observable
    const token = localStorage.getItem('token');
    const headers = token
      ? new HttpHeaders().set('Authorization', `Bearer ${token}`)
      : undefined;
    let vendorId = localStorage.getItem('vendorId');
    const options = {
      headers: headers,
    };
    return this.http.get(
      `${this.baseUrl}/merchants/kiranaCategories?kiranaId=${vendorId}`,
      options
    );
  }

  getItems(): Observable<any> {
    // Changed to return Observable
    const token = localStorage.getItem('token');
    const headers = token
      ? new HttpHeaders().set('Authorization', `Bearer ${token}`)
      : undefined;
    let vendorId = localStorage.getItem('vendorId');
    const options = {
      headers: headers,
    };
    return this.http.get(
      `${this.baseUrl}/merchants/products?vendorId=${vendorId}`,
      options
    );
  }

  getRawItems(vendorId: String): Observable<any> {
    // Changed to return Observable
    const token = localStorage.getItem('token');
    const headers = token
      ? new HttpHeaders().set('Authorization', `Bearer ${token}`)
      : undefined;
    // let vendorId = localStorage.getItem('vendorId');
    const options = {
      headers: headers,
    };
    return this.http.get(
      `${this.baseUrl}/merchants/raw-products?vendorId=${vendorId}`,
      options
    );
  }

  getKiranaitems(): Observable<any> {
    // Changed to return Observable
    const token = localStorage.getItem('token');
    const headers = token
      ? new HttpHeaders().set('Authorization', `Bearer ${token}`)
      : undefined;
    let vendorId = localStorage.getItem('vendorId');
    const options = {
      headers: headers,
    };
    return this.http.get(
      `${this.baseUrl}/merchants/kiranaProduct?kiranaId=${vendorId}`,
      options
    );
  }

  uploadImage(formData: FormData): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = token
      ? new HttpHeaders().set('Authorization', `Bearer ${token}`)
      : undefined;
    const options = headers ? { headers } : {};
    return this.http.post<any>(
      `${this.baseUrl}/api/upload`,
      formData,
      options
    );
  }

  getImage(imagePath: string): Observable<Blob> {
    return this.http.get(
      `${this.baseUrl}/api/images?path=${encodeURIComponent(imagePath)}`,
      {
        responseType: 'blob',
      }
    );
  }
}
