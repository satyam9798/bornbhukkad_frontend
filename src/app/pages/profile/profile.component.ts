import { Component } from '@angular/core';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { MatTabsModule } from '@angular/material/tabs';
import { Router } from '@angular/router';
@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [NavbarComponent, MatTabsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent {
  constructor(private router: Router) {}

  goToAddLocation() {
    this.router.navigate(['/delivery']);
  }
  logOut() {
    localStorage.clear();
    window.location.href = '/login';
  }
}
