import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OfferService } from '../../services/offer.service';
import { Offer, Audience, TagGroup } from '../../models/offer.model';
import { TAG_CONSTANTS } from '../../constants/tag.constants';
import { FormsModule } from '@angular/forms';
import {
  MatAccordion,
  MatExpansionModule,
  MatExpansionPanelHeader,
} from '@angular/material/expansion';
import { AuthServiceService } from '../../services/auth-service.service';
import { MenueServicesService } from '../../services/menue-services.service';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

@Component({
  selector: 'app-offers',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatExpansionModule,
    MatAccordion,
    MatExpansionPanelHeader,
    MatSlideToggleModule
  ],
  templateUrl: './offers.component.html',
  styleUrls: ['./offers.component.css'],
})
export class OffersComponent implements OnInit {
  vendorId: string = localStorage.getItem('vendorId') || 'P6';
  offers: Offer[] = [];
  audiences: Audience[] = [];
  items: any[] = [];
  locations: any[] = [];
  groupList: ('qualifier' | 'benefit' | 'meta')[] = [
    'qualifier',
    'benefit',
    'meta',
  ];
  labelMap: { [key: string]: string } = {
    min_value: 'Minimum Order Value',
    min_items: 'Minimum Items Required',
    first_order_only: 'First Order Only',
    value_type: 'Value Type',
    value: 'Discount Value',
    value_cap: 'Maximum Discount Cap',
    additive: 'Is Additive?',
    auto: 'Auto Apply?',
    // add more as needed
  };
  showCreateModal = false;
  newOffer: Offer = this.getEmptyOffer();
  editingOfferId: string | null = null;
  selectedOffer: any = null;
  showAudienceModal: boolean = false;
  showDeletePopup = false;

  tagConstants = TAG_CONSTANTS;

  constructor(
    private offerService: OfferService,
    private authService: AuthServiceService,
    private menuService: MenueServicesService
  ) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.offerService
      .getOffers(this.vendorId)
      .subscribe((data) => (this.offers = data));
    this.offerService
      .getAudiences(this.vendorId)
      .subscribe((data) => (this.audiences = data));
    this.authService
      .getUserLocation(this.vendorId)
      .subscribe((data: any) => (this.locations = data));
    this.menuService
      .getRawItems(this.vendorId)
      .subscribe((data: any) => (this.items = data));
  }

  getRuleKeys(rules: any): string[] {
    return Object.keys(rules || {});
  }

  formatLabel(key: string): string {
    // Convert camelCase to Proper Case: "locationCity" -> "Location City"
    return key
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, (str) => str.toUpperCase());
  }

  formatValue(value: any): string {
    if (typeof value === 'object' && value !== null) {
      const operators: { [key: string]: string } = {
        $gt: '>',
        $gte: '≥',
        $lt: '<',
        $lte: '≤',
        $eq: '=',
        $ne: '≠',
      };

      const op = Object.keys(value)[0];
      const val = value[op];

      return `${operators[op] || op} ${val}`;
    }
    return value;
  }

  getEmptyOffer(): Offer {
    return {
      vendorId: this.vendorId,
      active: false,
      audienceId: '',
      name: '',
      descriptor: { code: '', images: [] },
      location_ids: [],
      item_ids: [],
      time: {
        label: 'valid',
        range: { start: '', end: '' },
      },
      tags: [
        { code: 'qualifier', list: [] },
        { code: 'benefit', list: [] },
        { code: 'meta', list: [] },
      ],
    };
  }

  toggleItem(event: Event, itemId: string) {
    const input = event.target as HTMLInputElement;
    const checked = input.checked;

    if (checked) {
      this.newOffer.item_ids.push(itemId);
    } else {
      this.newOffer.item_ids = this.newOffer.item_ids.filter(
        (id) => id !== itemId
      );
    }
  }

  toggleOfferStatus(offer: Offer): void {
    offer.active = !offer.active;
    this.editingOfferId = offer.id || "";
    this.saveOffer();
  }

  toggleLocation(event: Event, locationId: string) {
    const input = event.target as HTMLInputElement;
    const checked = input.checked;

    if (checked) {
      this.newOffer.location_ids.push(locationId);
    } else {
      this.newOffer.location_ids = this.newOffer.location_ids.filter(
        (id) => id !== locationId
      );
    }
  }

  openCreateModal() {
    this.newOffer = this.getEmptyOffer();
    this.editingOfferId = null;
    this.showCreateModal = true;
  }

  onInputChange(event: Event, group: string, code: string) {
    if (group === 'qualifier' || group === 'benefit' || group === 'meta') {
      const input = event.target as HTMLInputElement;
      const value = input.value;
      this.addTagValue(group as any, code, value);
    }
  }

  addTagValue(
    group: 'qualifier' | 'benefit' | 'meta',
    code: string,
    value: string
  ) {
    const tagGroup = this.newOffer.tags.find((t) => t.code === group);
    if (tagGroup) {
      const existing = tagGroup.list.find((t) => t.code === code);
      if (existing) {
        existing.value = value;
      } else {
        tagGroup.list.push({ code, value });
      }
    }
  }

  saveOffer() {
    if (this.editingOfferId) {
      // Editing existing offer
      const updatedOffer = { ...this.newOffer, id: this.editingOfferId };
      this.offerService
        .updateOffer(this.editingOfferId, updatedOffer)
        .subscribe(() => {
          this.resetForm();
        });
    } else {
      // Creating new offer
      const offer = [this.newOffer];
      this.offerService.createOffer(offer).subscribe(() => {
        this.resetForm();
      });
    }
  }

  viewOffer(id: string | undefined) {
    if (!id) return;
    this.offerService.getOfferById(id).subscribe((data) => {
      this.newOffer = JSON.parse(JSON.stringify(data));
      this.editingOfferId = id;
      this.showCreateModal = true;
    });
  }

  confirmDelete(offer: any) {
    this.selectedOffer = offer;
    this.showDeletePopup = true;
  }

  deleteOffer(id: string) {
    // Call your delete API here
    this.offerService.deleteOffer(id).subscribe(() => {
      this.offers = this.offers.filter((o) => o.id !== id);
      this.showDeletePopup = false;
    });
  }
  resetForm() {
    this.showCreateModal = false;
    this.editingOfferId = null;
    this.newOffer = this.getEmptyOffer();
    this.loadData();
  }
  getTagValue(group: string, code: string): string {
    const tagGroup = this.newOffer.tags.find((t) => t.code === group);
    const tag = tagGroup?.list.find((x) => x.code === code);
    return tag?.value || '';
  }
}

// import { Component, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { OfferService } from '../../services/offer.service';
// import { Offer, Audience, TagGroup } from '../../models/offer.model';
// import { TAG_CONSTANTS } from '../../constants/tag.constants';
// import { FormsModule } from '@angular/forms';

// @Component({
//   selector: 'app-offers',
//   standalone: true,
//   imports: [CommonModule, FormsModule],
//   templateUrl: './offers.component.html',
//   styleUrls: ['./offers.component.css'],
// })
// export class OffersComponent implements OnInit {
//   vendorId: string = localStorage.getItem('vendorId') || 'P6';
//   offers: Offer[] = [];
//   audiences: Audience[] = [];
//   selectedOffer: Offer | null = null;
//   groupList: ('qualifier' | 'benefit' | 'meta')[] = [
//     'qualifier',
//     'benefit',
//     'meta',
//   ];

//   showCreateModal = false;
//   newOffer: Offer = this.getEmptyOffer();

//   tagConstants = TAG_CONSTANTS;

//   constructor(private offerService: OfferService) {}

//   ngOnInit() {
//     this.loadData();
//   }

//   loadData() {
//     this.offerService
//       .getOffers(this.vendorId)
//       .subscribe((data) => (this.offers = data));
//     this.offerService
//       .getAudiences(this.vendorId)
//       .subscribe((data) => (this.audiences = data));
//   }

//   getEmptyOffer(): Offer {
//     return {
//       vendorId: this.vendorId,
//       audience_id: '',
//       name: '',
//       descriptor: { code: '', images: [] },
//       location_ids: [],
//       item_ids: [],
//       time: {
//         label: 'valid',
//         range: { start: '', end: '' },
//       },
//       tags: [
//         { code: 'qualifier', list: [] },
//         { code: 'benefit', list: [] },
//         { code: 'meta', list: [] },
//       ],
//     };
//   }

//   openCreateModal() {
//     this.newOffer = this.getEmptyOffer();
//     this.showCreateModal = true;
//   }

//   onInputChange(event: Event, group: string, code: string) {
//     if (group === 'qualifier' || group === 'benefit' || group === 'meta') {
//       const input = event.target as HTMLInputElement;
//       const value = input.value;
//       this.addTagValue(group as any, code, value); // or cast here
//     }
//   }

//   addTagValue(
//     group: 'qualifier' | 'benefit' | 'meta',
//     code: string,
//     value: string
//   ) {
//     const tagGroup = this.newOffer.tags.find((t) => t.code === group);
//     if (tagGroup) {
//       const existing = tagGroup.list.find((t) => t.code === code);
//       if (existing) {
//         existing.value = value;
//       } else {
//         tagGroup.list.push({ code, value });
//       }
//     }
//   }

//   saveOffer() {
//     this.offerService.createOffer(this.newOffer).subscribe(() => {
//       this.showCreateModal = false;
//       this.loadData();
//     });
//   }

//   viewOffer(id: string) {
//     this.offerService
//       .getOfferById(id)
//       .subscribe((data) => (this.selectedOffer = data));
//   }
// }
