import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { ToastService } from './toast.service';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class OnboardingService {
  private baseUrl = environment.apiUrl;
  constructor(private http: HttpClient, private router: Router,private toastService: ToastService) { }
 
 saveKirana(data: any) {
    const token = localStorage.getItem('token');
    const headers = token ? new HttpHeaders().set('Authorization', `Bearer ${token}`) : undefined;
    const options = headers ? { headers } : {};
    return this.http.post(`${this.baseUrl}/merchants/kirana`, data, options)
  }

   handleSubmit1(data: any) {
    const token = localStorage.getItem('token');
    const headers = token ? new HttpHeaders().set('Authorization', `Bearer ${token}`) : undefined;
    const options = headers ? { headers } : {};
    return this.http.post(`${this.baseUrl}/merchants/restaurant`, data, options)
  }

  saveKiranaLocation(data: any) {
    const token = localStorage.getItem('token');
    const headers = token ? new HttpHeaders().set('Authorization', `Bearer ${token}`) : undefined;
    const options = headers ? { headers } : {};
    return this.http.post(`${this.baseUrl}/merchants/kiranaLocation`, data, options)
  }

  handleSubmit2(data: any) {
    const token = localStorage.getItem('token');
    const headers = token ? new HttpHeaders().set('Authorization', `Bearer ${token}`) : undefined;
    const options = headers ? { headers } : {};
    return this.http.post(`${this.baseUrl}/merchants/restaurantLocation`, data, options)
  }

  handleSubmit3(data:any) {
    const token= localStorage.getItem('token');
    const headers= token ? new HttpHeaders().set('Authorization', `Bearer ${token}`) : undefined;
    const options = headers ? { headers } : {};
    return this.http.post(`${this.baseUrl}/merchants/restFulfillment`,data ,options);
  }

  saveKiranaFulfillment(data:any) {
    const token= localStorage.getItem('token');
    const headers= token ? new HttpHeaders().set('Authorization', `Bearer ${token}`) : undefined;
    const options = headers ? { headers } : {};
    return this.http.post(`${this.baseUrl}/merchants/kiranaFulfillment`,data ,options);
  }

  fetchFullfillments(vendor:any){
    const token= localStorage.getItem('token');
    const headers= token ? new HttpHeaders().set('Authorization', `Bearer ${token}`) : undefined;
    const options = headers ? { headers } : {};
    return this.http.get(`${this.baseUrl}/merchants/restFulfillments?id=${vendor}`,options);
  }
}

