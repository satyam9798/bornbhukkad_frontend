import {
  MatDialog,
  MatDialogModule,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
  FormBuilder
} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { KiranaMenueService } from '../../services/kirana-menue.service';
import { MenueServicesService } from '../../services/menue-services.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-add-cred-item',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    MatButtonModule
  ],
  templateUrl: './add-cred-item.component.html',
  styleUrl: './add-cred-item.component.css'
})
export class AddCredItemComponent {
  
imageSrcs: string[] = [];
imageFiles: File[] = [];
 imagePreview: string | null = null;

  form = this.fb.group({
    name: ['', Validators.required],
    verifyUrl: ['https://abcd.dnb.com/verify?id=ESG-12345678', [Validators.required]],
    validFrom: ['', Validators.required],
    validTo: ['', Validators.required],
    imageFile: [null, Validators.required], // file object
    url: [''] // optional: final image URL after upload
  });

 
  constructor(private fb: FormBuilder, private dialogRef: MatDialogRef<AddCredItemComponent>,
    private MenueServicesService: MenueServicesService, private kiranaService: KiranaMenueService,
  private toastmsg : ToastService) {}

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) {
      this.form.patchValue({ imageFile: file as any });
      const reader = new FileReader();
      reader.onload = () => (this.imagePreview = reader.result as string);
      reader.readAsDataURL(file);
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

  onSubmitClick() {
    
    const payload = {
      id: "",
      descriptor: {
        code: "esg_badge",
        name: this.form.value.name,
      },
      url: "https://abcd.cdn.com/images/badge-img",
      kiranaId: localStorage.getItem('vendorId'),
      tags: [
        {
          code: "verification",
          list: [
            {
              code: "verify_url",
              value: this.form.value.verifyUrl // ✅ fixed quotes
            },
            {
              code: "valid_from",
              value:  this.form.value.validFrom // ✅ corrected milliseconds format
            },
            {
              code: "valid_to",
              value: this.form.value.validTo // ✅ corrected milliseconds format
            }
          ]
        }
      ]
    };
    console.log('Payload to submit:', payload);
    this.kiranaService.addCreds(payload).subscribe(
      (response) => {
        console.log('Creds data added successfully:', response);
        this.toastmsg.show('Creds added successfully!', 'bg-success text-light', 3000 );
        this.dialogRef.close(response); // Close dialog and return response
      },
      (error) => {
        console.error('Error adding creds data:', error);
        this.toastmsg.show('Failed to add creds. Please try again.', 'bg-danger text-light', 3000 );
      }
    );

  }

onSubmit(): void {
  console.log('Form submitted');
    if (this.form.valid) {
      console.log(this.form.value);
      // handle form submission
    } else {
      this.form.markAllAsTouched();
    }
  }

  cancel(): void {
    this.dialogRef.close();
  }
}


