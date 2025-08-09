import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http'
import { Router } from '@angular/router';
import { ToastService } from './toast.service';
@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {

  constructor(private http:HttpClient,private router:Router,private toastService: ToastService) { }

  Register(data:any){
    if(data.merchantType==='Kirana'){
      console.log("Kirana");
        return this.http.post('http://localhost:8080/api/auth/registerKirana',data);
    }
    else{
      console.log("No Kirana");  
      return this.http.post('http://localhost:8080/api/auth/registerRestaurant',data);
    }
   
  }

  login(data:any){
    return this.http.post('http://localhost:8080/api/auth/login',data);
  }

  getUserData(user:any){
    return this.http.get(`http://localhost:8080/merchants/vendor?vendorId=${user}`);
  }

  getUserLocation(user:any){
    return this.http.get(`http://localhost:8080/merchants/location?vendorId=${user}`);
  }

  getKiranaLocation(user:any){
    return this.http.get(`http://localhost:8080/merchants/kiranaLocation?kiranaId=${user}`);
  } 

  getKiranaUserData(user:any){
    return this.http.get(`http://localhost:8080/merchants/kirana?id=${user}`);
  }
  
}
