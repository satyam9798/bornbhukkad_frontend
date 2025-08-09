import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-offer',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './add-offer.component.html',
  styleUrl: './add-offer.component.css'
})
export class AddOfferComponent {
  offerForm: FormGroup;

  
  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddOfferComponent>
  ) {
    this.offerForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      active: [true],
    });
  }

  submitForm() {
    if (this.offerForm.valid) {
      this.dialogRef.close(this.offerForm.value);
    }
  }

  close() {
    this.dialogRef.close();
  }
}
