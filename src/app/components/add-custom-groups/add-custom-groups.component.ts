import { Component, OnInit, Input ,EventEmitter,Output} from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {FormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MenueServicesService } from '../../services/menue-services.service';
interface Food {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-add-custom-groups',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule,MatFormFieldModule, MatSelectModule, MatInputModule, FormsModule],
  templateUrl: './add-custom-groups.component.html',
  styleUrls: ['./add-custom-groups.component.css']
})
export class AddCustomGroupsComponent implements OnInit {
  @Input() initialVariants: any[] | undefined;
  @Input() customItems: any[] = [];
  @Input() currentVariants: string | undefined;
  
  @Output() formSubmit = new EventEmitter<any>(); 

  variantFormGroup: FormGroup;
  foods: Food[] = [
    {value: 'Veg', viewValue: 'Veg'},
    {value: 'Non veg', viewValue: 'Non Veg'},
  ];

  constructor(private fb: FormBuilder,private MenueServicesService: MenueServicesService) {
    this.variantFormGroup = this.fb.group({
      variantForms: this.fb.array([])
    });
  }

  ngOnInit(): void {
    // console.log(this.initialVariants,this.currentVariants);
    // console.log("hello");

    if (this.initialVariants && this.currentVariants) {
      const CG = this.initialVariants.find(variant => variant.name === this.currentVariants);
  
      if (CG && CG.data) {
        CG.data.forEach((variant: any) => this.addVariantForm(variant));
      } else {
        this.addVariantForm();
      }
    } else {
      // No variants provided, add a default empty form
      this.addVariantForm();
    }
  }
  
  get variantForms(): FormArray {
    return this.variantFormGroup.get('variantForms') as FormArray;
  }

  createVariantForm(variantData?: any): FormGroup {
    const variantForm = this.fb.group({
      id: [variantData ? variantData.id : '', Validators.required], // Set ID based on variantData,
      variantName: [variantData ? variantData.variantName : '', Validators.required],
      FoodType: [variantData ? variantData.FoodType : 'veg', Validators.required],
      additionalPrice: [variantData ? variantData.additionalPrice : 0, [Validators.required, Validators.min(0)]],
      parentCg: [variantData ? variantData.parentCg : ''],
      varientId: [variantData ? variantData.varientId : ''],
    });

    // Listen for changes on the itemPrice and additionalPrice fields
    const itemPriceControl = variantForm.get('itemPrice');
    const additionalPriceControl = variantForm.get('additionalPrice');
    itemPriceControl?.valueChanges.subscribe(() => this.updateTotalPrice(variantForm));
    additionalPriceControl?.valueChanges.subscribe(() => this.updateTotalPrice(variantForm));
    return variantForm;
  }

  addVariantForm(variantData?: any): void {
    this.variantForms.push(this.createVariantForm(variantData));
  }

  updateTotalPrice(variantForm: FormGroup): void {
    const itemPrice = variantForm.get('itemPrice')?.value || 0;
    const additionalPrice = variantForm.get('additionalPrice')?.value || 0;
    const totalPrice = itemPrice + additionalPrice;
    variantForm.get('totalPrice')?.setValue(totalPrice);
  }

  removeVariantForm(index: number): void {
    if (this.initialVariants) {
      console.log(this.variantForms);
      this.MenueServicesService.deleteCGItem(this.variantForms.at(index).value.id).subscribe((data)=>{
        console.log(data);
      } );
    }
    
    this.variantForms.removeAt(index);
  }

  isVariantChanged(formItem: any, originalItem: any): boolean {
    return Object.keys(formItem).some(key => formItem[key] !== originalItem[key]);
  }

  onSubmit(): void {

    this.formSubmit.emit(this.variantFormGroup.value);
    console.log(JSON.stringify(this.customItems));
   }
}

