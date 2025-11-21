import { Injectable } from '@angular/core';
import {HttpClient,HttpHeaders} from '@angular/common/http'
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class KiranaMenueService {

  constructor(private http:HttpClient,private router:Router) {  }

  addKiranaProduct(data:any){
    const token = localStorage.getItem('token');
    const headers = token ? new HttpHeaders().set('Authorization', `Bearer ${token}`) : undefined;
    const options = headers ? { headers } : {};
    console.log(JSON.stringify(data));
    return this.http.post('http://localhost:8080/merchants/kiranaProduct', data, options)
  }

  addKiranaCategories(data:any){
    const token = localStorage.getItem('token');
    const headers = token ? new HttpHeaders().set('Authorization', `Bearer ${token}`) : undefined;     
    const options = headers ? { headers } : {};    
    return this.http.post('http://localhost:8080/merchants/kiranaCategories', data, options);
  }

  updateKiranaItems(data:any){
    const token = localStorage.getItem('token');
    const headers = token ? new HttpHeaders().set('Authorization', `Bearer ${token}`) : undefined;
    const options = headers ? { headers } : {};
    return this.http.put('http://localhost:8080/merchants/kiranaProduct', data, options)

  }

  deleteKiranaItem(data:any){
    const token= localStorage.getItem('token');
    const headers= token? new HttpHeaders().set('Authorization', `Bearer ${token}`) : undefined;
    const options = headers ? { headers } : {};
    return this.http.delete(`http://localhost:8080/merchants/kiranaProduct?id=${data.id}`,options);
  }

  getKiranaCategories(): Observable<any> { // Changed to return Observable
    const token = localStorage.getItem('token');
    const headers = token ? new HttpHeaders().set('Authorization', `Bearer ${token}`) : undefined;
    let vendorId= localStorage.getItem('vendorId');
    const options = {
      headers: headers,
    };
    return this.http.get(`http://localhost:8080/merchants/kiranaCategories?vendorId=${vendorId}`, options);
  }

  getKiranaItems(): Observable<any> { // Changed to return Observable
    const token = localStorage.getItem('token');
    const headers = token ? new HttpHeaders().set('Authorization', `Bearer ${token}`) : undefined;
    let vendorId= localStorage.getItem('vendorId');
    const options = {
      headers: headers,
    };
    return this.http.get(`http://localhost:8080/merchants/kiranaProducts?vendorId=${vendorId}`, options);
  }

  // add cred kirana service
  addCreds(data:any){
    const token = localStorage.getItem('token');
    const headers = token ? new HttpHeaders().set('Authorization', `Bearer ${token}`) : undefined;
    const options = headers ? { headers } : {};
    //console.log(JSON.stringify(data));
    return this.http.post('http://localhost:8080/merchants/kiranaCreds', data, options)
  }
}
