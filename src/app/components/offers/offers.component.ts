import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OfferService } from '../../services/offer.service';
import { Offer, Audience, TagGroup } from '../../models/offer.model';
import { TAG_CONSTANTS } from '../../constants/tag.constants';
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  MatAccordion,
  MatExpansionModule,
  MatExpansionPanelHeader,
} from '@angular/material/expansion';
import { AuthServiceService } from '../../services/auth-service.service';
import { MenueServicesService } from '../../services/menue-services.service';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-offers',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatExpansionModule,
    MatAccordion,
    MatExpansionPanelHeader,
    MatSlideToggleModule,
    MatTooltipModule
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
  offerForm!: FormGroup;

  tooltips: { [key: string]: string } = {
    value_type: "Whether the discount is a flat value or percentage.",
    value: "The actual discount applied.",
    value_cap: "The maximum discount allowed for this offer.",
    auto: "whether offer is auto applied based on cart selection",
    additive: "Whether offer can be applied in addition to other offers."
  };

  hours = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'));
  minutes = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'));

  constructor(
    private fb: FormBuilder,
    private offerService: OfferService,
    private authService: AuthServiceService,
    private menuService: MenueServicesService
  ) { }

  ngOnInit() {
    this.initForm();
    this.loadData();
  }

  initForm() {
    this.offerForm = this.fb.group({
      name: ['', Validators.required],
      active: [true],
      item_ids: this.fb.array([]),
      location_ids: this.fb.array([]),

      time: this.fb.group({
        start: ['', Validators.required],
        end: ['', Validators.required],
      }),

      tags: this.fb.group({
        qualifier: this.fb.group({
          min_value: [''],
          min_items: [''],
          first_order_only: ['No']
        }),
        benefit: this.fb.group({
          value_type: ['Percent'],
          value: [''],
          value_cap: ['']
        }),
        meta: this.fb.group({
          auto: ['No'],
          additive: ['No']
        })
      })
    });
  }


  getTooltip(key: string): string {
    return this.tooltips[key] || '';
  }


  getTagGroup(group: string): FormGroup {
    return this.offerForm.get('tags.' + group) as FormGroup;
  }

  getTimeGroup(): FormGroup {
    return this.offerForm.get('time') as FormGroup;
  }

  toggleArrayValue(arrayName: 'item_ids' | 'location_ids', id: number, event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    const arr = this.offerForm.get(arrayName) as FormArray;
    if (checked) {
      arr.push(new FormControl(id));
    } else {
      const idx = arr.controls.findIndex(x => x.value === id);
      arr.removeAt(idx);
    }
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
      .subscribe((data: any) => {
        this.locations = data;
      });
    this.menuService
      .getRawItems(this.vendorId)
      .subscribe((data: any) => {
        this.items = data;
      });
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
    this.populateOfferForm(offer)
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
    this.initForm();
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

    const formValue = this.offerForm.value;

    this.newOffer = {
      vendorId: this.vendorId,
      active: formValue.active,
      audienceId: '',
      name: formValue.name,
      descriptor: { code: '', images: [] },
      location_ids: formValue.location_ids,
      item_ids: formValue.item_ids,
      time: {
        label: 'valid',
        range: { start: formValue.time.start, end: formValue.time.end },
      },
      tags: Object.keys(formValue.tags).map(group => ({
        code: group.toString(),
        list: Object.keys(formValue.tags[group]).map(key => ({
          code: key,
          value: formValue.tags[group][key]
        }))
      }))
    };
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
      this.editingOfferId = id;

      this.populateOfferForm(JSON.parse(JSON.stringify(data)));
      this.showCreateModal = true;
    });
  }

  populateOfferForm(offer: Offer): void {
    const mappedTags = this.mapTagsForForm(offer.tags);
    this.offerForm.patchValue({
      name: offer.name,
      item_ids: offer.item_ids,
      active: offer.active,
      location_ids: offer.location_ids,
      tags: mappedTags
    });


    this.setFormArrayValues('item_ids', offer.item_ids);
    this.setFormArrayValues('location_ids', offer.location_ids);
  }


  setFormArrayValues(arrayName: 'item_ids' | 'location_ids', values: string[]) {
    const arr = this.offerForm.get(arrayName) as FormArray;
    arr.clear();
    values.forEach(v => arr.push(new FormControl(v)));
  }

  private mapTagsForForm(tags: any[]): any {
    const result: any = { qualifier: {}, benefit: {}, meta: {} };

    tags.forEach(group => {
      group.list.forEach((item: any) => {
        result[group.code][item.code] = item.value;
      });
    });

    return result;
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
    this.offerForm.reset();
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