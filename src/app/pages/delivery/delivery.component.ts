import { Component } from '@angular/core';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { OnboardingService } from '../../services/onboarding.service';
import { ToastService } from '../../services/toast.service';
@Component({
  selector: 'app-delivery',
  standalone: true,
  imports: [FormsModule,NavbarComponent,CommonModule],
  templateUrl: './delivery.component.html',
  styleUrl: './delivery.component.css'
})
export class DeliveryComponent {
  ShowDelivery:boolean = false;
  ShowOrder:boolean = false;
  ShowSelfPickup:boolean = false;
  MerchantType: string | null = '';
  daysOfWeek: string[] = [ 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday','Sunday'];

  constructor(private OnboardingService:OnboardingService,private toastService: ToastService,private router: Router){}

  ngOnInit() {
    this.MerchantType = localStorage.getItem('type');
    console.log('MerchantType in ngOnInit:', this.MerchantType);
  }

  SubmitHandler(data:any){
    let payload= [];
    console.log(data);

    if(this.ShowDelivery){
      let phone = data.DeliveryPhone ? data.DeliveryPhone.toString() : '';
      let temp={
          "id": "",
          "type": "Delivery",
          "contact": {
              "phone": phone,
              "email": data?.DeliveryEmail
          },
          "defaultId":"F1",
          "deliveryTime":{
            "deliveryStartDay":data.Delivery_StartDay,
            "deliveryEndDay":data.Delivery_EndDay,
            "deliveryStartTime":data.Delivery_StartTime,
            "deliveryEndTime":data.Delivery_EndTime,
          }
        
      }
      payload.push(temp);
    }

    if(this.ShowOrder){
      let phone = data.BuyerDeliveryPhone ? data.BuyerDeliveryPhone.toString() : '';
      let temp={
          "id": "",
          "type": "Buyer-Delivery",
          "contact": {
              "phone": phone,
              "email": data?.BuyerDeliveryEmail
          },
          "defaultId":"F2",
          "deliveryTime":{
            "deliveryStartDay":data.BuyerDelivery_StartDay,
            "deliveryEndDay":data.BuyerDelivery_EndDay,
            "deliveryStartTime":data.BuyerDelivery_StartTime,
            "deliveryEndTime":data.BuyerDelivery_EndTime,
          }
     
      }
      payload.push(temp);
    }
    
    if(this.ShowSelfPickup){
      let phone = data.SelfPickUpPhone ? data.SelfPickUpPhone.toString() : '';
      let temp={
          "id": "",
          "type": "Self-Pickup",
          "contact": {
              "phone": phone,
              "email": data?.SelfPickUpEmail
          },
          "defaultId":"F3",
          "deliveryTime":{
            "deliveryStartDay":data.SelfPickUp_StartDay,
            "deliveryEndDay":data.SelfPickUp_EndDay,
            "deliveryStartTime":data.SelfPickUp_StartTime,
            "deliveryEndTime":data.SelfPickUp_EndTime,
          }
         
      }
      payload.push(temp);
    }

    if(this.MerchantType==='kirana'){
      payload.forEach((element:any) => {
        element["kiranaId"]=localStorage.getItem('vendorId');
      });
    }
    else{
      payload.forEach((element:any) => {
        element["vendorId"]=localStorage.getItem('vendorId');
      });

    }
  
    console.log("Payload :",payload);
    console.log(JSON.stringify(payload));
    if(this.MerchantType==='kirana'){ 
      this.OnboardingService.saveKiranaFulfillment(payload).subscribe({
          next:(result:any)=>{
            console.log(result);
            this.router.navigate(['/merchantOnboarding_2']);
            },
            error:(error)=>{
                console.log("Error",error);
                this.toastService.show(error?.error?.error||'Failed to submit');
              }
        }
      )
    }
    else{
      this.OnboardingService.handleSubmit3(payload).subscribe(
        {
          next:(result:any)=>{
            console.log(result);
            this.router.navigate(['/merchantOnboarding_2']);
            },
            error:(error)=>{
                console.log("Error",error);
                this.toastService.show(error?.error?.error||'Failed to submit');
              }
        }
      )
    };
    }
}
