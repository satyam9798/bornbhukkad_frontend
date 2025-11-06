import { Component, EventEmitter, Output, Input, Inject } from '@angular/core';
import {
  MatDialog,
  MatDialogModule,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { MatRadioModule } from '@angular/material/radio';
import { MatAccordion, MatExpansionModule } from '@angular/material/expansion';
import { MatDividerModule } from '@angular/material/divider';
import { Subscription } from 'rxjs';
import { AddCustomGroupsComponent } from '../add-custom-groups/add-custom-groups.component';
import { MatDialogRef } from '@angular/material/dialog';
import { constants } from '../../constants/constants';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MenueServicesService } from '../../services/menue-services.service';
import { nanoid } from 'nanoid';

@Component({
  selector: 'app-add-item',
  standalone: true,
  templateUrl: './add-item.component.html',
  styleUrl: './add-item.component.css',
})
export class AddItemComponent {
  Items = new FormControl('');

  @Output() addItem = new EventEmitter<any>();
  constructor(public dialog: MatDialog) {}

  openDialog(editItem?: any) {
    const dialogRef = this.dialog.open(DialogContent, {
      data: { editItem }, // Pass the editItem to the dialog, undefined if adding
    });

    dialogRef.afterClosed().subscribe((result) => {
      // Emit the result to the parent component or handle accordingly
      if (result) {
        this.addItem.emit(result);
      }
    });
  }

  AddItem(itemData: any) {
    console.log(itemData);
    this.addItem.emit(itemData);
  }
}

@Component({
  selector: 'price-chart',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    MatRadioModule,
    MatAccordion,
    MatExpansionModule,
    MatDividerModule,
    AddCustomGroupsComponent,
  ],
  styleUrls: ['./add-item.component.css'],
  templateUrl: './price-chart.html',
})
export class PriceChart {
  priceTable: any = [
    { ItemPrice: '<50', packagingFees: '5' },
    { ItemPrice: '50-150', packagingFees: '7' },
    { ItemPrice: '150-300', packagingFees: '10' },
    { ItemPrice: '300-500', packagingFees: '15' },
    { ItemPrice: '500+', packagingFees: '20' },
  ];
}

interface Option {
  form: FormGroup;
}

@Component({
  selector: 'dialog-content',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
    MatRadioModule,
    MatAccordion,
    MatExpansionModule,
    MatDividerModule,
    AddCustomGroupsComponent,
    MatInputModule,
    MatTooltipModule,
  ],
  styleUrls: ['./add-item.component.css'],
  templateUrl: './addItemBody.html',
})
export class DialogContent {
  show = 'part1';
  selected1 = 'option1';
  selected2 = 'option1';
  IsReturnable: boolean = false;
  IsCancleable: boolean = false;
  returnableControl = new FormControl(false);
  itemForm: FormGroup;
  productDimensions = constants.dimensionUnit;
  productUnits = constants.productUnit;
  @Output() addItem = new EventEmitter<any>();
  @Input() initialVariants!: any[];
  imageSrcs: string[] = [];
  imageFiles: File[] = [];
  customItems: any[] = [];
  parentMap: any = {};
  childMap: any = {};

  Fullfillments = [
    {
      id: 'F1',
      type: 'Delivery',
    },
    {
      id: 'F2',
      type: 'Buyer-Delivery',
    },
    {
      id: 'F3',
      type: 'self delivery',
    },
  ];

  cg1: any[] = [];
  cg2: any[] = [];
  cg3: any[] = [];
  cg4: any[] = [];
  cg5: any[] = [];
  cg6: any[] = [];

  constructor(
    private MenueServicesService: MenueServicesService,
    public dialogRef: MatDialogRef<DialogContent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog
  ) {
    this.itemForm = new FormGroup({
      itemName: new FormControl(''),
      price: new FormControl(''),
      PackagingPrice: new FormControl('', Validators.required),
      shortDescription: new FormControl('', Validators.required),
      longDescription: new FormControl('', Validators.required),
      foodPreference: new FormControl('', Validators.required),
      width: new FormControl('', Validators.required),
      height: new FormControl('', Validators.required),
      length: new FormControl('', Validators.required),
      widthUnit: new FormControl('', Validators.required),
      ReturnWindow: new FormControl('', Validators.required),
      Cancleable: new FormControl(''),
      SellerPickUpReturn: new FormControl({ value: '', disabled: true }),
      COD: new FormControl(''),
      fullfillmentId: new FormControl('', Validators.required),
      heightUnit: new FormControl('', Validators.required),
      lengthUnit: new FormControl('', Validators.required),
      weight: new FormControl('', Validators.required),
      weightUnit: new FormControl('', Validators.required),
      ItemTimings: new FormControl('', Validators.required),
      ccName: new FormControl('', Validators.required),
      ccEmail: new FormControl('', Validators.required),
      ccPhone: new FormControl('', Validators.required),
    });

    if (this.data.editItem) {
      const ccRaw =
        this.data.editItem.itemDetails.ondc_org_contact_details_consumer_care ||
        '';
      const [ccName, ccEmail, ccPhone] = ccRaw.split(',');
      const backend = this.data.editItem.itemDetails;

      const mappedData = {
        itemName: backend.descriptor?.name || '',
        price: backend.price?.value || '',
        PackagingPrice: backend.packagingPrice || '',
        shortDescription: backend.descriptor?.short_desc || '',
        longDescription: backend.descriptor?.long_desc || '',
        foodPreference:
          backend.tags?.find((t:any) => t.code === 'veg_nonveg')?.list?.[0]
            ?.value || '',
        width: backend.dimension?.width?.value || '',
        widthUnit: backend.dimension?.width?.unit || '',
        height: backend.dimension?.height?.value || '',
        heightUnit: backend.dimension?.height?.unit || '',
        length: backend.dimension?.length?.value || '',
        lengthUnit: backend.dimension?.length?.unit || '',
        ReturnWindow:
          backend.ondc_org_return_window ||
          backend['@ondc/org/return_window'] ||
          '',
        Cancleable:
          backend.ondc_org_cancellable ||
          backend['@ondc/org/cancellable'] ||
          false,
        SellerPickUpReturn:
          backend.ondc_org_seller_pickup_return ||
          backend['@ondc/org/seller_pickup_return'] ||
          false,
        COD: backend['@ondc/org/available_on_cod'] || '',
        fullfillmentId: backend.id || '', // adjust if fulfillmentId is elsewhere
        weight: backend.weight?.value || '',
        weightUnit: backend.weight?.unit || '',
        ItemTimings: backend.timing || '',
        ccName: ccName || '',
        ccEmail: ccEmail || '',
        ccPhone: ccPhone || '',
      };

      this.itemForm.patchValue(this.data.editItem.itemDetails);
      this.initialVariants = this.data.editItem.customGroups;
      console.log(this.initialVariants);
    }
  }

  onFilesSelected(event: any): void {
    const files = event.target.files;
    if (files) {
      this.imageSrcs = [];
      this.imageFiles = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        this.imageFiles.push(file);
        const reader = new FileReader();
        reader.onload = (e) => {
          this.imageSrcs.push(e.target?.result as string);
        };
        reader.readAsDataURL(file);
      }
    }
  }

  uploadImages(): void {
    if (!this.imageFiles.length) {
      alert('Please select at least one file to upload.');
      return;
    }

    this.imageFiles.forEach((file) => {
      const formData = new FormData();
      formData.append('image', file);

      this.MenueServicesService.uploadImage(formData).subscribe(
        (data: any) => {
          this.imageFiles.push(data.path);
          console.log('Image uploaded:', data.path);
          // this.getImage(data.path);
        },
        (error: any) => {
          console.error('Error uploading image:', error);
        }
      );
    });
  }

  getImage(imagePath: string): void {
    this.MenueServicesService.getImage(imagePath).subscribe(
      (blob: any) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const uploadedImage = new Image();
          uploadedImage.src = reader.result as string;
          document.getElementById('uploadedImages')?.appendChild(uploadedImage);
        };
        reader.readAsDataURL(blob);
      },
      (error: any) => {
        console.error('Error retrieving image:', error);
      }
    );
  }

  cancelImages(): void {
    this.imageSrcs = [];
    this.imageFiles = [];
    const uploadedImages = document.getElementById('uploadedImages');
    if (uploadedImages) {
      uploadedImages.innerHTML = '';
    }
  }

  removeImage(image: string): void {
    const index = this.imageSrcs.indexOf(image);
    if (index !== -1) {
      this.imageSrcs.splice(index, 1);
      this.imageFiles.splice(index, 1);
    }
  }

  generateRandomUniqueNumber(): number {
    const min = 10000000; // minimum value for the random number
    const max = 99999999; // maximum value for the random number
    const uniqueNumbers: Set<number> = new Set(); // set to store unique numbers

    while (true) {
      const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min; // generate random number
      if (!uniqueNumbers.has(randomNumber)) {
        uniqueNumbers.add(randomNumber); // add the number to the set
        return randomNumber; // return the unique number
      }
    }
  }

  openPriceChart() {
    this.dialog.open(PriceChart);
  }

  findViewValue(targetValue: number): string | null {
    const result = this.customItems.find((item) => item.value === targetValue);
    return result ? result.viewValue : null;
  }

  processCustomItems(formsGroup: any, cgName: string) {
    formsGroup.forEach((group: any) => {
      let customID = nanoid();
      group.varientId = customID;
      let Cparent = this.findViewValue(group?.parentCg);
      let customItem: any = {
        viewValue: `${group?.variantName}${
          Cparent !== null ? ` [parent-> ${Cparent}]` : ''
        }`,
        value: customID,
      };
      this.customItems.push(customItem);
    });
  }

  groupByParentCg(foodVariants: any[]): any[] {
    const groupedMap: { [key: string]: any[] } = {};
    foodVariants.forEach((variant) => {
      const parentCgKey = variant.parentCg.toString();
      if (!groupedMap[parentCgKey]) {
        groupedMap[parentCgKey] = [];
      }
      groupedMap[parentCgKey].push(variant);
    });

    return Object.keys(groupedMap).map((key) => ({
      parentCg: key,
      CgId: nanoid(),
      data: groupedMap[key],
    }));
  }

  mapRelationShips(foodVariants: any[]) {
    foodVariants.forEach((group: any) => {
      group.data.forEach((groupItem: any) => {
        this.parentMap[groupItem.varientId] = group.CgId;
      });
    });

    foodVariants.forEach((d: any) => {
      d.data.forEach((dp: any) => {
        let ParentId = dp.parentCg;
        if (ParentId !== '') {
          this.childMap[ParentId] = d.CgId;
        }
      });
    });

    foodVariants.forEach((d: any) => {
      d.data.forEach((dp: any) => {
        let variantId = dp.parentCg;
        if (variantId !== '') {
          dp.parentCg = this.parentMap[variantId];
        }
      });
    });
  }

  // Inside DialogContent component
  handleVariantFormSubmit(formData: any, groupIndex: number) {
    console.log('Received form data:', JSON.stringify(formData));
    // Determine which group the data belongs to and push it to the respective array
    switch (groupIndex) {
      case 1:
        if (formData?.variantForms) {
          this.processCustomItems(formData?.variantForms, 'Quantity');
          let groupedVariants1: any = this.groupByParentCg(
            formData?.variantForms
          );
          this.cg1.push(...groupedVariants1); // Assuming formData.variantForms is the array of variant objects
          this.mapRelationShips(groupedVariants1);
        }
        break;
      case 2:
        if (formData?.variantForms) {
          this.processCustomItems(formData?.variantForms, 'Preparation type');
          let groupedVariants2 = this.groupByParentCg(formData?.variantForms);
          this.cg2.push(...groupedVariants2);
          this.mapRelationShips(groupedVariants2);
        }
        break;
      case 3:
        if (formData?.variantForms) {
          this.processCustomItems(formData?.variantForms, 'Size');
          let groupedVariants3 = this.groupByParentCg(formData?.variantForms);
          this.cg3.push(...groupedVariants3);
          this.mapRelationShips(groupedVariants3);
        }
        break;
      case 4:
        if (formData?.variantForms) {
          this.processCustomItems(formData?.variantForms, 'Base');
          let groupedVariants4 = this.groupByParentCg(formData?.variantForms);
          this.cg4.push(...groupedVariants4);
          this.mapRelationShips(groupedVariants4);
        }
        break;
      case 5:
        if (formData?.variantForms) {
          this.processCustomItems(formData?.variantForms, 'Rice');
          let groupedVariants5 = this.groupByParentCg(formData?.variantForms);
          this.cg5.push(...groupedVariants5);
          this.mapRelationShips(groupedVariants5);
        }
        break;
      case 6:
        if (formData?.variantForms) {
          this.processCustomItems(formData?.variantForms, 'MakeYourOwn');
          let groupedVariants6 = this.groupByParentCg(formData?.variantForms);
          this.cg6.push(...groupedVariants6);
          this.mapRelationShips(groupedVariants6);
        }
        break;
      default:
        console.log('Unknown group index');
    }
  }

  changeForm(name: string) {
    this.show = name;
  }

  onSubmitClick() {
    console.log(this.itemForm.valid);
    console.log(this.itemForm.value);
  }

  onSubmit() {
    console.log(this.itemForm.value);
    // Combine data from the three custom groups and the main form
    const combinedData = {
      itemDetails: {
        ...this.itemForm.value,
        returnable: this.returnableControl.value,
      },
      customGroups: [
        {
          name: 'Quantity',
          data: this.cg1,
        },
        {
          name: 'Preparation type',
          data: this.cg2,
        },
        {
          name: 'Size',
          data: this.cg3,
        },
        {
          name: 'Base',
          data: this.cg4,
        },
        {
          name: 'Rice',
          data: this.cg5,
        },
        {
          name: 'Make Your Own',
          data: this.cg6,
        },
      ],
      childRelationShips: this.childMap,
      parentRelationShips: this.parentMap,
    };
    this.dialogRef.close(combinedData);
    //  Close the dialog with the combined data
  }
}
