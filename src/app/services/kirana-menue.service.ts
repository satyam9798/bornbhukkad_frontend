import { Injectable } from '@angular/core';
import {HttpClient,HttpHeaders} from '@angular/common/http'
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class KiranaMenueService {
private baseUrl = environment.apiUrl;
  constructor(private http:HttpClient,private router:Router) {  }

  addKiranaProduct(data:any){
    const token = localStorage.getItem('token');
    const headers = token ? new HttpHeaders().set('Authorization', `Bearer ${token}`) : undefined;
    const options = headers ? { headers } : {};
    //console.log(JSON.stringify(data));
    return this.http.post(`${this.baseUrl}/merchants/kiranaProduct`, data, options)
  }

  addKiranaCategories(data:any){
    const token = localStorage.getItem('token');
    const headers = token ? new HttpHeaders().set('Authorization', `Bearer ${token}`) : undefined;     
    const options = headers ? { headers } : {};    
    return this.http.post(`${this.baseUrl}/merchants/kiranaCategories`, data, options);
  }

  updateKiranaItems(data:any){
    const token = localStorage.getItem('token');
    const headers = token ? new HttpHeaders().set('Authorization', `Bearer ${token}`) : undefined;
    const options = headers ? { headers } : {};
    return this.http.put(`${this.baseUrl}/merchants/kiranaProduct`, data, options)

  }

  deleteKiranaItem(data:any){
    const token= localStorage.getItem('token');
    const headers= token? new HttpHeaders().set('Authorization', `Bearer ${token}`) : undefined;
    const options = headers ? { headers } : {};
    return this.http.delete(`${this.baseUrl}/merchants/kiranaProduct?id=${data.id}`,options);
  }

  getKiranaCategories(): Observable<any> { // Changed to return Observable
    const token = localStorage.getItem('token');
    const headers = token ? new HttpHeaders().set('Authorization', `Bearer ${token}`) : undefined;
    let vendorId= localStorage.getItem('vendorId');
    const options = {
      headers: headers,
    };
    return this.http.get(`${this.baseUrl}/merchants/kiranaCategories?vendorId=${vendorId}`, options);
  }

  getKiranaItems(): Observable<any> { // Changed to return Observable
    const token = localStorage.getItem('token');
    const headers = token ? new HttpHeaders().set('Authorization', `Bearer ${token}`) : undefined;
    let vendorId= localStorage.getItem('vendorId');
    const options = {
      headers: headers,
    };
    return this.http.get(`${this.baseUrl}/merchants/kiranaProducts?vendorId=${vendorId}`, options);
  }

  // add cred kirana service
  addCreds(data:any){
    const token = localStorage.getItem('token');
    const headers = token ? new HttpHeaders().set('Authorization', `Bearer ${token}`) : undefined;
    const options = headers ? { headers } : {};
    //console.log(JSON.stringify(data));
    return this.http.post(`${this.baseUrl}/merchants/kiranaCreds`, data, options)
  }
}
