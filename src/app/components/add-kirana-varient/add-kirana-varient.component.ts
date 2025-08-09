import { Component,OnInit, Input ,EventEmitter,Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {FormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MenueServicesService } from '../../services/menue-services.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-add-kirana-varient',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule,MatFormFieldModule, MatSelectModule, MatInputModule, FormsModule],
  templateUrl: './add-kirana-varient.component.html',
  styleUrl: './add-kirana-varient.component.css'
})
export class AddKiranaVarientComponent {
  @Input() initialVariants: any[] | undefined;
  @Input() customItems: any[] = [];
  @Input() currentVariants: string | undefined;

  @Output() formSubmit = new EventEmitter<any>(); 

  imageSrcs: string[] = [];
  imageFiles: File[] = [];
  imageUrls:string[]=["hello world"];
  variantFormGroup: FormGroup;

  constructor(private fb: FormBuilder,private MenueServicesService: MenueServicesService,private ToastService:ToastService) {
    this.variantFormGroup = this.fb.group({
      variantForms: this.fb.array([])
    });
  }

  get variantForms(): FormArray {
    return this.variantFormGroup.get('variantForms') as FormArray;
  }


  createVariantForm(variantData?: any): FormGroup {
    const variantForm = this.fb.group({
      id: [variantData ? variantData.id : '', Validators.required], // Set ID based on variantData,
      images: [variantData ? variantData.images : [], Validators.required], // Set ID based on variantData,
      quantity: [variantData ? variantData.quantity : '', Validators.required],
      price: [variantData ? variantData.price : '', Validators.required],
    });
    return variantForm;
  }

  addVariantForm(variantData?: any): void {
    this.variantForms.push(this.createVariantForm(variantData));
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

  updateVariantImages(index: number, imagePath: string): void {
    const variantForm = this.variantForms.at(index);
    const imagesArray = variantForm.get('images')?.value || [];
    imagesArray.push(imagePath);
    variantForm.patchValue({ images: imagesArray });
  }

  
  uploadImages(index: number): void {
    if (!this.imageFiles.length) {
      alert('Please select at least one file to upload.');
      return;
    }
  
    this.imageFiles.forEach((file) => {
      const formData = new FormData();
      formData.append('image', file);
  
      this.MenueServicesService.uploadImage(formData).subscribe(
        (data: any) => {
          this.ToastService.show("Images uploaded successfully");
          this.imageUrls.push(data.path);
          this.imageFiles = [];
          this.imageSrcs = [];
          console.log('Image uploaded:', data.path);
  
          // Update the form group with the uploaded image path
          this.updateVariantImages(index, data.path);
  
          this.getImage(data.path);
        },
        (error: any) => {
          console.error('Error uploading image:', error);
          this.ToastService.show("Error in uploading the image");
        }
      );
    });
  }
  
  getImage(imagePath: string): void {
    this.MenueServicesService.getImage(imagePath).subscribe(
      (blob:any) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const uploadedImage = new Image();
          uploadedImage.src = reader.result as string;
          document.getElementById('uploadedImages')?.appendChild(uploadedImage);
        };
        reader.readAsDataURL(blob);
      },
      (error:any) => {
        console.error('Error retrieving image:', error);
      }
    );
  }

  removeImage(image: string): void {
    const index = this.imageSrcs.indexOf(image);
    if (index !== -1) {
      this.imageSrcs.splice(index, 1);
      this.imageFiles.splice(index, 1);
    }
  }

  cancelImages(): void {
    this.imageSrcs = [];
    this.imageFiles = [];
    const uploadedImages = document.getElementById('uploadedImages');
    if (uploadedImages) {
      uploadedImages.innerHTML = '';
    }
  }

  onSubmit(): void {

    console.log(this.variantFormGroup.value);
    this.formSubmit.emit(this.variantFormGroup.value);
   }


}
