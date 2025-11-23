import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http'
import { Router } from '@angular/router';
import { ToastService } from './toast.service';
import { environment } from '../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {

 private baseUrl = environment.apiUrl;

  constructor(private http:HttpClient,private router:Router,private toastService: ToastService) { }

  Register(data:any){
    if(data.merchantType==='Kirana'){
      console.log("Kirana");
        return this.http.post(`${this.baseUrl}/api/auth/registerKirana`,data);
    }
    else{
      console.log("No Kirana");  
      return this.http.post(`${this.baseUrl}/api/auth/registerRestaurant`,data);
    }
   
  }

  login(data:any){
    console.log("gloal api url",this.baseUrl);
    return this.http.post(`${this.baseUrl}/api/auth/login`,data);
  }

  getUserData(user:any){
    return this.http.get(`${this.baseUrl}/merchants/vendor?vendorId=${user}`);
  }

  getUserLocation(user:any){
    return this.http.get(`${this.baseUrl}/merchants/location?vendorId=${user}`);
  }

  getKiranaLocation(user:any){
    return this.http.get(`${this.baseUrl}/merchants/kiranaLocation?kiranaId=${user}`);
  } 

  getKiranaUserData(user:any){
    return this.http.get(`${this.baseUrl}/merchants/kirana?id=${user}`);
  }
  
}
