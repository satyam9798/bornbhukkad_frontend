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
    value: 'Discount Value',
    value_cap: 'Maximum Discount Cap',
    additive: 'Is Additive?',
    auto: 'Auto Apply?',
    item_count: 'Number of Items',
    item_id: 'Item ID',
    item_value: 'Item Value',
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
  formSubmitted = false;

  tooltips: { [key: string]: string } = {
    value_type: "Whether the discount is a flat value or percentage.",
    value: "The actual discount applied.",
    value_cap: "The maximum discount allowed for this offer.",
    auto: "whether offer is auto applied based on cart selection",
    additive: "Whether offer can be applied in addition to other offers.",
    item_count: "Number of items to be purchased or given free.",
    item_id: "The specific item ID for the free item.",
    item_value: "The monetary value of the free item.",
    first_order_only: "Whether the offer is valid only for the customer's first order.",
    min_value: "Minimum order value required to avail the offer.",
    min_items: "Minimum number of items required in the cart to avail the offer."

  };
// define offer types
public readonly OfferTypeMap: { [key: string]: string } = { 
    DISC_PCT: 'Percentage Discount',
    DISC_AMT: 'Flat Discount',
    BUY_X_GET_Y: 'Buy Any Get Any',
    FREEBIE: 'Free Item'
  };

 public offerOptions = Object.values(this.OfferTypeMap);


 // Define which fields are allowed per group for each OfferType
public readonly OfferTypeConfig: Record<string, { qualifier: string[], benefit: string[], meta: string[] }> = {
  'BUY_X_GET_Y': {
    qualifier: ['item_count', 'first_order_only'], // Assuming min_items represents Item_count
    benefit: ['item_count'],
    meta: ['auto', 'additive']   // Adjust label names to match your tagConstants.ts
  },
  'DISC_PCT': {
    qualifier: ['min_value', 'first_order_only'],
    benefit: ['value', 'value_cap'],
    meta: ['auto', 'additive']
  },
  'DISC_AMT': {
    qualifier: ['min_value', 'first_order_only'],
    benefit: ['value'],
    meta: ['auto', 'additive']
  },
  'FREEBIE': {
    qualifier: ['min_value', 'first_order_only'],
    benefit: ['item_count', 'item_id', 'item_value'],
    meta: ['auto', 'additive']
  }
};

onTypeChange(event: any) {
  const selectElement = event.target as HTMLSelectElement;
  const selectedOfferTypeValue = selectElement.value; 
  this.selectedOffer = Object.keys(this.OfferTypeMap).find(k => this.OfferTypeMap[k] === selectedOfferTypeValue); 
  
  // Add validators to required fields based on selected offer type
  this.updateValidators();
}

updateValidators() {
  if (!this.selectedOffer) {
    // Clear validators if no offer type selected
    this.clearValidators();
    return;
  }

  const config = this.OfferTypeConfig[this.selectedOffer];
  
  // Update qualifier validators
  const qualifierGroup = this.offerForm.get('tags.qualifier') as FormGroup;
  if (qualifierGroup) {
    Object.keys(qualifierGroup.controls).forEach(key => {
      const control = qualifierGroup.get(key);
      if (config.qualifier.includes(key)) {
        control?.setValidators([Validators.required]);
      } else {
        control?.clearValidators();
      }
      control?.updateValueAndValidity({ emitEvent: false });
    });
  }

  // Update benefit validators
  const benefitGroup = this.offerForm.get('tags.benefit') as FormGroup;
  if (benefitGroup) {
    Object.keys(benefitGroup.controls).forEach(key => {
      const control = benefitGroup.get(key);
      if (config.benefit.includes(key)) {
        control?.setValidators([Validators.required]);
      } else {
        control?.clearValidators();
      }
      control?.updateValueAndValidity({ emitEvent: false });
    });
  }

  // Update meta validators
  const metaGroup = this.offerForm.get('tags.meta') as FormGroup;
  if (metaGroup) {
    Object.keys(metaGroup.controls).forEach(key => {
      const control = metaGroup.get(key);
      if (config.meta.includes(key)) {
        control?.setValidators([Validators.required]);
      } else {
        control?.clearValidators();
      }
      control?.updateValueAndValidity({ emitEvent: false });
    });
  }
}

clearValidators() {
  const tagsGroup = this.offerForm.get('tags') as FormGroup;
  if (tagsGroup) {
    Object.keys(tagsGroup.controls).forEach(groupName => {
      const group = tagsGroup.get(groupName) as FormGroup;
      if (group) {
        Object.keys(group.controls).forEach(key => {
          const control = group.get(key);
          control?.clearValidators();
          control?.updateValueAndValidity({ emitEvent: false });
        });
      }
    });
  }
}
shouldShowField(group: string, label: string): boolean {
  if (!this.selectedOffer) return false; // Don't show if no offer selected
  const config = this.OfferTypeConfig[this.selectedOffer];
  return config && config[group as 'qualifier' | 'benefit' | 'meta']?.includes(label);
}

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
  // Dynamically create form groups based on TAG_CONSTANTS
  const tagGroups: { [key: string]: any } = {};

  Object.keys(this.tagConstants).forEach((groupName) => {
    const groupControls: { [key: string]: any } = {};
    
    this.tagConstants[groupName].forEach((tag: any) => {
      const defaultValue = tag.defaultValue || '';
      // Add Validators.required for fields that are displayed based on OfferTypeConfig
      groupControls[tag.label] = [defaultValue];
    });

    tagGroups[groupName] = this.fb.group(groupControls);
  });

  this.offerForm = this.fb.group({
    name: ['', Validators.required],
    active: [true],
    offerType: [''],
    item_ids: this.fb.array([]),
    location_ids: this.fb.array([]),

    time: this.fb.group({
      start: ['', Validators.required],
      end: ['', Validators.required],
    }),

    tags: this.fb.group(tagGroups)
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
    this.formSubmitted = false;
    this.selectedOffer = null;
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
    // Mark form as submitted to show validation errors
    this.formSubmitted = true;

    // Check if form is invalid
    if (this.offerForm.invalid) {
      return;
    }

    const formValue = this.offerForm.value;
    
    // Get the offer type code from the selected offer type display name
    const offerTypeCode = Object.keys(this.OfferTypeMap).find(k => this.OfferTypeMap[k] === formValue.offerType) || '';

    // Build tags array with only the relevant fields for the selected offer type
    const tagsArray = this.buildTagsArray(formValue.tags);

    this.newOffer = {
      vendorId: this.vendorId,
      active: formValue.active,
      audienceId: '',
      name: formValue.name,
      descriptor: { code: offerTypeCode, images: ['https://sellerNP.com/images/offer2-banner.png'] },
      location_ids: formValue.location_ids || [],
      item_ids: formValue.item_ids || [],
      time: {
        label: 'valid',
        range: { 
          start: formValue.time.start ? this.formatTimeToISO(formValue.time.start) : '',
          end: formValue.time.end ? this.formatTimeToISO(formValue.time.end) : ''
        },
      },
      tags: tagsArray
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
      console.log('Creating new offer:', this.newOffer);
      const offer = [this.newOffer];
      this.offerService.createOffer(offer).subscribe(() => {
        this.resetForm();
      });
    }
  }

  private buildTagsArray(tags: any): TagGroup[] {
    const result: TagGroup[] = [];

    Object.keys(tags).forEach(groupCode => {
      const groupTags = tags[groupCode];
      const tagList: { code: string; value: string }[] = [];

      // Only include fields that have values
      Object.keys(groupTags).forEach(fieldCode => {
        const value = groupTags[fieldCode];
        if (value !== '' && value !== null && value !== undefined) {
          tagList.push({
            code: fieldCode,
            value: String(value)
          });
        }
      });

      // Only add the group if it has tags
      if (tagList.length > 0) {
        result.push({
          code: groupCode,
          list: tagList
        });
      }
    });

    return result;
  }

  private formatTimeToISO(timeString: string): string {
    // Convert time input (HH:MM) to ISO format: "2023-06-21T16:00:00.000Z"
    if (!timeString) return '';
    
    const today = new Date();
    const [hours, minutes] = timeString.split(':');
    const date = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 
                          parseInt(hours), parseInt(minutes), 0, 0);
    
    // Return ISO string with milliseconds in format: YYYY-MM-DDTHH:MM:SS.000Z
    return date.toISOString();
  }

  viewOffer(id: string | undefined) {
    if (!id) {
      console.warn('No offer ID provided');
      return;
    }
    
    console.log('Fetching offer with ID:', id);
    
    this.offerService.getOfferById(id).subscribe({
      next: (data) => {
        console.log('Offer data received:', data);
        this.editingOfferId = id;
        this.formSubmitted = false;
        this.selectedOffer = null;
        
        // Detect and set the offer type from the existing offer data
        this.detectOfferType(data);
        
        this.populateOfferForm(JSON.parse(JSON.stringify(data)));
        this.showCreateModal = true;
       // console.log('Modal should now be visible, showCreateModal:', this.showCreateModal);
       // console.log('Selected offer type:', this.selectedOffer, 'Display name:', this.selectedOffer ? this.OfferTypeMap[this.selectedOffer] : 'none');
      },
      error: (err) => {
        console.error('Error fetching offer:', err);
      }
    });
  }

  detectOfferType(offer: Offer): void {
    if (!offer.tags || offer.tags.length === 0) return;

    // Get the benefit tags to determine offer type
    const benefitTags = offer.tags.find(t => t.code === 'benefit')?.list || [];
    const benefitCodes = benefitTags.map(t => t.code);
    
    // Determine offer type based on available tags in benefit section
    let detectedType: string | null = null;

    // Check for FREEBIE - has item_id or item_value (distinguishes from BUY_X_GET_Y)
    if (benefitCodes.some(code => ['item_id', 'item_value'].includes(code))) {
      detectedType = 'FREEBIE';
    }
    // Check for Buy X Get Y - has only item_count (no item_id or item_value)
    else if (benefitCodes.includes('item_count')) {
      detectedType = 'BUY_X_GET_Y';
    }
    // Check for Percentage Discount - has value_cap
    else if (benefitCodes.includes('value_cap')) {
      detectedType = 'DISC_PCT';
    }
    // Check for Flat Discount - has value but not value_cap
    else if (benefitCodes.includes('value')) {
      detectedType = 'DISC_AMT';
    }

    if (detectedType) {
      this.selectedOffer = detectedType;
      this.updateValidators();
    }
  }

  populateOfferForm(offer: Offer): void {
    try {
      const mappedTags = this.mapTagsForForm(offer.tags);
      
      // Safely handle time object with different possible structures
      const timeValue: any = {};
      
      if (offer.time) {
        // Handle structure 1: {range: {start, end}}
        if (offer.time.range) {
          timeValue.start = offer.time.range.start || '';
          timeValue.end = offer.time.range.end || '';
        } 
        // Handle structure 2: {timestamp: null} or other formats
        else {
          console.warn('Time structure does not have range property:', offer.time);
          timeValue.start = '';
          timeValue.end = '';
        }
      } else {
        console.warn('Time data missing:', offer.time);
        timeValue.start = '';
        timeValue.end = '';
      }
      
      // Get the display name for the offer type
      const offerTypeDisplayName = this.selectedOffer ? this.OfferTypeMap[this.selectedOffer] : '';
      
      this.offerForm.patchValue({
        name: offer.name,
        item_ids: offer.item_ids || [],
        active: offer.active,
        location_ids: offer.location_ids || [],
        offerType: offerTypeDisplayName,
        time: timeValue,
        tags: mappedTags
      });

      this.setFormArrayValues('item_ids', offer.item_ids || []);
      this.setFormArrayValues('location_ids', offer.location_ids || []);
      
      // Mark form as pristine and untouched to clear validation errors
      this.offerForm.markAsPristine();
      this.offerForm.markAsUntouched();
      
     // console.log('Form populated successfully with offer type:', offerTypeDisplayName);
    } catch (error) {
      console.error('Error populating form:', error);
    }
  }


  setFormArrayValues(arrayName: 'item_ids' | 'location_ids', values: string[]) {
    try {
      const arr = this.offerForm.get(arrayName) as FormArray;
      if (arr) {
        arr.clear();
        values.forEach(v => arr.push(new FormControl(v)));
      }
    } catch (error) {
      console.error(`Error setting form array values for ${arrayName}:`, error);
    }
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