import { Component, EventEmitter, Inject, Input, Output } from '@angular/core';
import { MatDialog, MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { MatRadioModule } from '@angular/material/radio';
import {MatAccordion, MatExpansionModule} from '@angular/material/expansion';
import {MatDividerModule} from '@angular/material/divider';
import { Subscription } from 'rxjs';
import {AddCustomGroupsComponent} from '../add-custom-groups/add-custom-groups.component'
import { MatDialogRef } from '@angular/material/dialog';
import { constants } from '../../constants/constants';
import {MatInputModule} from '@angular/material/input';
import { AddKiranaVarientComponent } from '../add-kirana-varient/add-kirana-varient.component';

@Component({
  selector: 'app-add-kirana-item',
  standalone: true,
  imports: [],
  templateUrl: './add-kirana-item.component.html',
  styleUrl: './add-kirana-item.component.css'
})
export class AddKiranaItemComponent {
  Items = new FormControl('');

  @Output() addItem = new EventEmitter<any>();
  constructor(public dialog: MatDialog) { }

  openDialog(editItem?: any) {
    const dialogRef = this.dialog.open(DialogContent2, {
      data: { editItem}
    });

    dialogRef.afterClosed().subscribe(result => {
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
  imports: [CommonModule,MatDialogModule,MatFormFieldModule,MatSelectModule,FormsModule,ReactiveFormsModule,
    CommonModule,
    MatRadioModule,
    MatAccordion,
    MatExpansionModule,
    MatDividerModule,
    AddCustomGroupsComponent,
  ],
  styleUrls: ['./add-kirana-item.component.css'],
  templateUrl: './price-chart.html',

})
export class PriceChart{
  priceTable: any = [
    {ItemPrice:"<50",packagingFees:"5"},
    {ItemPrice:"50-150",packagingFees:"7"},
    {ItemPrice:"150-300",packagingFees:"10"},
    {ItemPrice:"300-500",packagingFees:"15"},
    {ItemPrice:"500+",packagingFees:"20"},
  ];
}

interface Option {
  form: FormGroup;
}

@Component({
  selector: 'dialog-content',
  standalone: true,
  imports: [
    CommonModule, MatDialogModule, MatFormFieldModule, MatSelectModule, FormsModule, ReactiveFormsModule,
    MatRadioModule, MatAccordion, MatExpansionModule, MatDividerModule, AddCustomGroupsComponent,MatInputModule,AddKiranaVarientComponent
  ],
  styleUrls: ['./add-kirana-item.component.css'],
  templateUrl: './addItemBody.html',
})
export class DialogContent2 {
  show = 'part1';
  selected1 = 'option1';
  selected2 = 'option1';
  IsReturnable: boolean = false;
  IsCancleable: boolean = false;
  returnableControl = new FormControl(false);
  itemForm: FormGroup;
  productDimensions=constants.dimensionUnit;
  productUnits=constants.productUnit;
  variants: any[] = [];
  @Output() addItem = new EventEmitter<any>();
  @Input() initialVariants!: any[];

  Fullfillments = [
    {
      id: "F1",
      type: "Delivery",

    },
    {
      id: "F2",
      type: "Buyer-Delivery",

    },
    {
      id: "F3",
      type: "self delivery",

    }
  ]

  cg1: any[] = [];
  cg2: any[] = [];
  cg3: any[] = [];
  cg4: any[] = [];
  cg5: any[] = [];
  cg6: any[] = [];

  constructor(
    public dialogRef: MatDialogRef<DialogContent2>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog
  ) {
    this.itemForm = new FormGroup({
      itemName: new FormControl('', Validators.required),
      price: new FormControl('', Validators.required),
      PackagingPrice: new FormControl('', Validators.required),
      shortDescription: new FormControl('', Validators.required),
      longDescription: new FormControl('', Validators.required),
      foodPreference: new FormControl('', Validators.required),
      width: new FormControl('', Validators.required),
      height: new FormControl('', Validators.required),
      length: new FormControl('', Validators.required),
      widthUnit: new FormControl('', Validators.required),
      ReturnWindow:new FormControl('',Validators.required),
      Cancleable:new FormControl('',Validators.required),
      SellerPickUpReturn:new FormControl({ value: '', disabled: true }),
      COD:new FormControl('',Validators.required),
      fullfillmentId: new FormControl('', Validators.required),
      heightUnit: new FormControl('', Validators.required),
      lengthUnit: new FormControl('', Validators.required),
      weight: new FormControl('', Validators.required),
      weightUnit: new FormControl('', Validators.required),
      ItemTimings: new FormControl('', Validators.required),
    });

    if (this.data.editItem) {
      this.itemForm.patchValue(this.data.editItem.itemDetails);
      this.initialVariants = this.data.editItem.customGroups;
      console.log(this.initialVariants);
    }
  }

  openPriceChart() {
    this.dialog.open(PriceChart);
  }

  // Inside DialogContent component
  handleVariantFormSubmit(formData: any, groupIndex: number) {
    console.log('Received form data:', formData);
    this.variants=formData.variantForms;
  }

  changeForm(name: string) {
    this.show = name;
  }



  onSubmit() {
    console.log(this.itemForm.value);
    // Combine data from the three custom groups and the main form
    const combinedData = {
      itemDetails: {...this.itemForm.value,returnable:this.returnableControl.value},
      varientItems:this.variants
    };
    this.dialogRef.close(combinedData);
    //  Close the dialog with the combined data
    
  }
}

