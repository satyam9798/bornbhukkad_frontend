import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthServiceService } from '../../services/auth-service.service';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { ToastService } from '../../services/toast.service';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';
@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [FormsModule, RouterLink, NavbarComponent, CommonModule, MatTooltipModule],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css',
})

export class SignUpComponent {
  constructor(
    private authServiceService: AuthServiceService,
    private toastService: ToastService,
    private router: Router
  ) {}

  SubmitHandler(data: any) {
    data.phone = data.phone.toString();
    console.log(data);
    this.authServiceService.Register(data).subscribe({
      next: (res: any) => {
        this.toastService.show('Registration Successful');
        window.location.href = '/login';
      },
      error: (error) => {
        console.error('Error:', error);
        this.toastService.show(error?.error?.error || 'Login Failed');
      },
    });
  }
}
