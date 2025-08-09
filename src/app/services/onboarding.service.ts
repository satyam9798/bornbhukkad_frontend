import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root'
})
export class OnboardingService {

  constructor(private http: HttpClient, private router: Router,private toastService: ToastService) { }
 
  handleSubmit1(data: any) {
    const token = localStorage.getItem('token');
    const headers = token ? new HttpHeaders().set('Authorization', `Bearer ${token}`) : undefined;
    const options = headers ? { headers } : {};
    return this.http.post('http://localhost:8080/merchants/restaurant', data, options)
  }
  
  saveKirana(data: any) {
    const token = localStorage.getItem('token');
    const headers = token ? new HttpHeaders().set('Authorization', `Bearer ${token}`) : undefined;
    const options = headers ? { headers } : {};
    return this.http.post('http://localhost:8080/merchants/kirana', data, options)
  }

  saveKiranaLocation(data: any) {
    const token = localStorage.getItem('token');
    const headers = token ? new HttpHeaders().set('Authorization', `Bearer ${token}`) : undefined;
    const options = headers ? { headers } : {};
    return this.http.post('http://localhost:8080/merchants/kiranaLocation', data, options)
  }

  handleSubmit2(data: any) {
    const token = localStorage.getItem('token');
    const headers = token ? new HttpHeaders().set('Authorization', `Bearer ${token}`) : undefined;
    const options = headers ? { headers } : {};
    return this.http.post('http://localhost:8080/merchants/restaurantLocation', data, options)
  }

  handleSubmit3(data:any) {
    const token= localStorage.getItem('token');
    const headers= token ? new HttpHeaders().set('Authorization', `Bearer ${token}`) : undefined;
    const options = headers ? { headers } : {};
    return this.http.post('http://localhost:8080/merchants/restFulfillment',data ,options);
  }

  saveKiranaFulfillment(data:any) {
    const token= localStorage.getItem('token');
    const headers= token ? new HttpHeaders().set('Authorization', `Bearer ${token}`) : undefined;
    const options = headers ? { headers } : {};
    return this.http.post('http://localhost:8080/merchants/kiranaFulfillment',data ,options);
  }

  fetchFullfillments(vendor:any){
    const token= localStorage.getItem('token');
    const headers= token ? new HttpHeaders().set('Authorization', `Bearer ${token}`) : undefined;
    const options = headers ? { headers } : {};
    return this.http.get(`http://localhost:8080/merchants/restFulfillments?id=${vendor}`,options);
  }
}

