import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { OnboardingService } from '../../services/onboarding.service';
import { ToastService } from '../../services/toast.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { GeocodingService } from '../../services/geo-encoding.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-merchant-onboarding-2',
  standalone: true,
  imports: [FormsModule, RouterLink,CommonModule],
  templateUrl: './merchant-onboarding-2.component.html',
  styleUrl: './merchant-onboarding-2.component.css'
})
export class MerchantOnboarding2Component {

  constructor(
    private OnboardingService: OnboardingService,
    private toastService: ToastService,
    private router: Router,
    private GeocodingService: GeocodingService,
    private http: HttpClient
  ) { }
  latitude: number = 0;
  longitude: number = 0;
  isDisabled: boolean = true;
  showIntraCity:boolean=false;
  showHyperlocal:boolean=false;
  showPanIndia:boolean=false;
  daysOfWeek: string[] = [ 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday','Sunday'];
  MerchantType: string | null = '';
  Fullfillments: any[] = [];
  stdCodeList: any[] = [];

  ngOnInit() {
    this.MerchantType = localStorage.getItem('type');
    let vendorId=localStorage.getItem('vendorId');
    console.log('VendorId:', vendorId);
    this.http.get<any[]>('assets/city-to-pincode.json').subscribe(json => {
      this.stdCodeList = json;
    });
    this.OnboardingService.fetchFullfillments(vendorId).subscribe({
      next: (result: any) => {
        this.Fullfillments=result;
        console.log(this.Fullfillments)
      },
      error: (error) => console.error('Error:', error),
    });

    console.log('MerchantType in ngOnInit:', this.MerchantType);
  }
 


  getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.latitude = Number(position.coords.latitude.toFixed(8));
          this.longitude = Number(position.coords.longitude.toFixed(8));
          console.log(this.latitude, this.longitude);
        },
        (error) => {
          console.error('Error getting location', error);
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  }

  SubmitHandler(data: any) {
    // Validate the data
    console.log(data);
    const daysOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const daysArr: number[] = [];
  
    // Populate daysArr based on the days available in the data
    daysOfWeek.forEach((day, index) => {
      if (data[day]) daysArr.push(index + 1);
    });
    const Days = daysArr.join(',');
    const startTime = data.StartTime.split(':').join('');
    const endTime = data.EndTime.split(':').join('');
    console.log(startTime, endTime);

    let finalAddress = `${data.street}, ${data.locality}, ${data.city}, ${data.state}, ${data.area_code}`;

    this.GeocodingService.geocodeAddress(finalAddress).subscribe({
      next: (result: any) => {
        this.latitude = result.lat;
        this.longitude = result.lng;
        console.log('Latitude:', this.latitude);
        console.log('Longitude:', this.longitude);
        this.isDisabled = false;
      },
      error: (error) => console.error('Error:', error),
    });

    
    let tags = [
      {
        "code": "order_value",
        "list": [
          {
            "code": "min_value",
            "value": data.minimumOrderValue
          }
        ]
      },
    ];
  
    this.Fullfillments.forEach((fullfillment) => {
        let temp = {
          "code": "timing",
          "list": [
            {
              "code": "type",
              "value": fullfillment.type,
            },
            {
              "code": "location",
              "value": ""
            },
            {
              "code": "day_from",
              "value":fullfillment?.deliveryTime?.deliveryStartDay
            },
            {
              "code": "day_to",
              "value": fullfillment?.deliveryTime?.deliveryEndDay
            },
            {
              "code": "time_from",
              "value":fullfillment?.deliveryTime?.deliveryStartTime
            },
            {
              "code": "time_to",
              "value": fullfillment?.deliveryTime?.deliveryEndTime
            }
          ]
        }
        tags.push(temp);
      
    });
  

      tags.push({
        "code": "serviceability",
        "list": [
          {
            "code": "location",
            "value": ""
          },
          {
            "code": "category",
            "value": "F&B"
          },
          {
            // hyperlocal
            "code": "type",
            "value": "10"
          },
          {
            // radius
            "code": "val",
            "value": data.radius
          },
          {
            "code": "unit",
            "value": "km"
          }
        ]
      });
    
  
    if (data.IntraCity) {
      console.log("IntraCity");
      tags.push({
        "code": "serviceability",
        "list": [
          {
            "code": "location",
            "value": ""
          },
          {
            "code": "category",
            "value": "F&B"
          },
          {
            "code": "type",
            "value": "11"
          },
          {
            // radius
            "code": "val",
            "value": data.IntracityRadius
          },
          {
            "code": "unit",
            "value": "km"
          }
        ]
      });
    }
  
    if (data.PanIndia) {
      console.log("PanIndia");
      tags.push({
        "code": "serviceability",
        "list": [
          {
            "code": "location",
            "value": ""
          },
          {
            "code": "category",
            "value": "F&B"
          },
          {
            "code": "type",
            "value": "12"
          },
          {
            // radius
            "code": "val",
            "value": data.PanIndiaRadius
          },
          {
            "code": "unit",
            "value": "km"
          }
        ]
      });
    }

  
  
    const payload = {
      "time": {
        "label": "",
        "timestamp": "",
        "range": {
          "start": startTime,
          "end": endTime
        },
        "days": Days,
        "schedule": {
          "holidays": [
            "2023-08-15"
          ],
          "frequency": "PT4H",
          "times": [
            "1100",
            "1900"
          ]
        }
      },
      "gps": {
        "type": "Point",
        "coordinates": [
          this.longitude,
          this.latitude
        ]
      },
      "address": {
        "locality": data.locality,
        "street": data.street,
        "city": data.city,
        "area_code": data.area_code,
        "state": data.state
      },
      "circle": {
        "gps": `${this.longitude},${this.latitude}`,
        "radius": {
          "unit": "km",
          "value": data.radius
        }
      },
      "tags": tags,
    } as any;

    if(this.MerchantType === 'restaurant') {
      payload['vendorId'] = localStorage.getItem('vendorId');
    }else{
      payload['kiranaId'] = localStorage.getItem('vendorId');
    }
    if (data.area_code?.toString()) {
      const match = this.stdCodeList.find(entry => entry.Pincode === data.area_code?.toString());
      payload['stdCode'] = match ? match['STD Code'] : null;
    }

    console.log(payload);
  
    // Uncomment and use this when ready to submit the payload
    if(this.MerchantType === 'restaurant') {
      console.log('Restaurant',JSON.stringify(payload));
        this.OnboardingService.handleSubmit2(payload).subscribe({
          next: (result: any) => {
            console.log(result);
            this.toastService.show('Location Added Successfully');
            this.router.navigate(['/']);
          },
          error: (error) => console.error('Error:', error),
        });
    }
    else{
        this.OnboardingService.saveKiranaLocation(payload).subscribe({
          next: (result: any) => {
            console.log(result);
            this.toastService.show('Location Added Successfully');
            this.router.navigate(['/']);
          },
          error: (error) => console.error('Error:', error),
        });
    }
  }
  
}
