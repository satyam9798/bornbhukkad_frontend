import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { SideBarComponent } from '../../components/side-bar/side-bar.component';
import { CommonModule } from '@angular/common';
import { MenueComponent } from '../../components/menue/menue.component';
import { Router } from '@angular/router';
import { AuthServiceService } from '../../services/auth-service.service';
import { OffersComponent } from '../../components/offers/offers.component';
import { CredsComponent } from "../../components/creds/creds.component";


@Component({
  selector: 'app-dash-board',
  standalone: true,
  imports: [
    NavbarComponent,
    SideBarComponent,
    CommonModule,
    MenueComponent,
    OffersComponent,
    CredsComponent
],
  templateUrl: './dash-board.component.html',
  styleUrls: ['./dash-board.component.css'], // Also note the correction here from styleUrl to styleUrls
})
export class DashBoardComponent implements OnInit {
  show = 'Menue';
  MerchantType: string | null = '';

  constructor(
    private router: Router,
    private authServiceService: AuthServiceService
  ) {}

  changeDashboard(dashboardName: string) {
    console.log(`Dashboard changed to: ${dashboardName}`);
    this.show = dashboardName;
  }

  ngOnInit() {
    this.MerchantType = localStorage.getItem('type');
    if (localStorage.getItem('token') === null) {
      this.router.navigate(['/login']);
      return;
    }

    let user = localStorage.getItem('vendorId');
    if (user === null) {
      this.router.navigate(['/merchantOnboarding']);
      return;
    }
    if (this.MerchantType === 'kirana') {
      this.authServiceService.getKiranaLocation(user).subscribe({
        next: (res: any) => {
          console.log(res);
          if (res.length === 0) {
            this.router.navigate(['/merchantOnboarding_2']);
            return;
          }
          localStorage.setItem('vendorLocation', JSON.stringify(res[0]));
        },
        error: (error) => {
          console.error('Error:', error);
        },
      });

      this.authServiceService.getKiranaUserData(user).subscribe({
        next: (res: any) => {
          console.log(res);
          localStorage.setItem('vendorData', JSON.stringify(res));
        },
        error: (error) => {
          console.error('Error:', error);
        },
      });
    } else {
      console.log(user);
      this.authServiceService.getUserLocation(user).subscribe({
        next: (res: any) => {
          console.log(res);
          if (res.length === 0) {
            this.router.navigate(['/merchantOnboarding_2']);
            return;
          }
          localStorage.setItem('vendorLocation', JSON.stringify(res[0]));
        },
        error: (error) => {
          console.error('Error:', error);
        },
      });

      this.authServiceService.getUserData(user).subscribe({
        next: (res: any) => {
          console.log(res);
          localStorage.setItem('vendorData', JSON.stringify(res));
        },
        error: (error) => {
          console.error('Error:', error);
        },
      });
    }
  }
}
