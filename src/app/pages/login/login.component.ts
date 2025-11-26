import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthServiceService } from '../../services/auth-service.service';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { ToastService } from '../../services/toast.service';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink, NavbarComponent,CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

  constructor(private authServiceService: AuthServiceService, private toastService: ToastService, private router: Router) { }

  SubmitHandler(form: NgForm) {
    if (!form.valid) {
      this.toastService.show('Please fill out the form correctly.');
      return;
    }
    const data = form.value;
    this.authServiceService.login(data).subscribe({
      next: (res: any) => {
          console.log(res);
          localStorage.setItem("token", res.token);
          localStorage.setItem("userEmail",res.email);
          if(res.merchantId){
            localStorage.setItem("vendorId",res.merchantId);
          }
          localStorage.setItem('type',res.merchantType)
         // console.log("merchant Id",res.merchantId===null);
          if(res.merchantId===null){
            this.router.navigate(['/merchantOnboarding']);
          }else{
            this.router.navigate(['/']);
          }
      },
      error: (error) => {
        console.error('Error:', error);
        this.toastService.show(error?.error?.error||'Login Failed');
      }
    });
  }
}
