import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { SignUpComponent } from './pages/sign-up/sign-up.component';
import { HttpClientModule } from '@angular/common/http';
import { ToastService } from '../app/services/toast.service';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { OrderAlertComponent } from './components/order-alert/order-alert.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    LoginComponent,
    SignUpComponent,
    HttpClientModule,
    MatSnackBarModule,
    OrderAlertComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'bb_frontend';

  constructor(private toastService: ToastService) {}
}
