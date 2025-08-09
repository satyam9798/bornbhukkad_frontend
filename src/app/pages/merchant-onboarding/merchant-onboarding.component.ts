import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { OnboardingService } from '../../services/onboarding.service';
import { Router } from '@angular/router';
import { ToastService } from '../../services/toast.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-merchant-onboarding',
  standalone: true,
  imports: [FormsModule, RouterLink, CommonModule],  // Ensure CommonModule is imported here
  templateUrl: './merchant-onboarding.component.html',
  styleUrls: ['./merchant-onboarding.component.css']
})
export class MerchantOnboardingComponent {
  MerchantType: string | null = '';

  constructor(
    private OnboardingService: OnboardingService,
    private router: Router,
    private toastService: ToastService
  ) {}

  ngOnInit() {
    this.MerchantType = localStorage.getItem('type');
    console.log('MerchantType in ngOnInit:', this.MerchantType);
  }

  SubmitHandler(data: any) {
    let payload = {
      userEmail: localStorage.getItem('userEmail'),
      descriptor: {
        name: data.Name,
        shortDesc: data.Short_description,
        longDesc: data.Long_description,
        images: ['https://sellerNP.com/images/np.png'],
        symbol: 'https://sellerNP.com/images/np.png'
      }
    } as any;

    if(this.MerchantType === 'restaurant') {
      payload= {...payload,fssaiLicenseNo: data.fssaiLicenseNo}
          
    }
    console.log('Payload:', payload);
    if (this.MerchantType === 'kirana') {
      this.OnboardingService.saveKirana(payload).subscribe({
        next: (result: any) => {
          localStorage.setItem('vendorId', result.id);
          localStorage.setItem('vendorData', JSON.stringify(result));
          this.router.navigate(['/delivery']);
        },
        error: (error) => {
          if(error?.status===400){
            this.toastService.show('Store with same name already exists');
          }else{
            this.toastService.show(error?.error?.error || 'Failed to submit');
          }
        }
      });
    } else {
      this.OnboardingService.handleSubmit1(payload).subscribe({
        next: (result: any) => {
          localStorage.setItem('vendorId', result.id);
          localStorage.setItem('vendorData', JSON.stringify(result));
          this.router.navigate(['/delivery']);
        },
        error: (error) => {
          if(error?.status===400){
            this.toastService.show('Store with same name already exists');
          }else{
            this.toastService.show(error?.error?.error || 'Failed to submit');
          }
        }
      });
    }
  }
}
