import { Component, EventEmitter, Output } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { MenueServicesService } from '../../services/menue-services.service';
import { cat, kiranaCategories } from '../../utils/categories';

@Component({
  selector: 'app-add-category',
  standalone: true,
  imports: [
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
  ],
  templateUrl: './addcategory.component.html',
  styleUrls: ['./addcategory.component.css'],
})
export class AddCategoryComponent {
  Categories = new FormControl('');
  @Output() addCategory = new EventEmitter<any>();
  MerchantType: string | null = '';

  ngOnInit() {
    this.MerchantType = localStorage.getItem('type');
    console.log('MerchantType in ngOnInit:', this.MerchantType);
  }

  constructor(
    public dialog: MatDialog,
    private MenueServicesService: MenueServicesService
  ) {}
  openDialog() {
    const dialogRef = this.dialog.open(DialogContent);
    console.log(cat);
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log(`Dialog result: ${result}`);
        if (this.MerchantType === 'kirana') {
          this.MenueServicesService.addKiranaCategories(result).subscribe({
            next: (res) => console.log(res),
            error: (error) => console.error('Error:', error),
          });
        } else {
          this.MenueServicesService.addCategories(result).subscribe({
            next: (res) => console.log(res),
            error: (error) => console.error('Error:', error),
          });
        }
        this.emit(result);
      }
    });
  }

  emit(categories: any) {
    console.log(categories);
    this.addCategory.emit(categories);
  }
}

@Component({
  selector: 'dialog-content',
  standalone: true,
  imports: [
    MatDialogModule,
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  template: `
    <h2 mat-dialog-title>Add category</h2>
    <mat-dialog-content class="mat-typography">
      <mat-form-field class="w-[400px]">
        <mat-label>Categories</mat-label>
        <mat-select [formControl]="categories" multiple>
          @for (topping of CategoryList; track topping) {
          <mat-option [value]="topping">{{
            topping.descriptor.name
          }}</mat-option>
          }
        </mat-select>
      </mat-form-field>
    </mat-dialog-content>
    <mat-dialog-actions align="end" class="w-full flex gap-10">
      <button mat-button mat-dialog-close>Cancel</button>
      <button mat-button [mat-dialog-close]="categories.value" cdkFocusInitial>
        Submit
      </button>
    </mat-dialog-actions>
  `,
})
export class DialogContent {
  categories = new FormControl('');
  CategoryList: any[] = [];
  MerchantType: string | null = '';
  ngOnInit() {
    this.MerchantType = localStorage.getItem('type');
    let locationData: any = localStorage.getItem('vendorLocation');
    locationData = JSON.parse(locationData);
    let str = locationData?.time?.days;
    let numbers = str.split(',');
    let StartDay = numbers[0];
    let EndDay = numbers[numbers.length - 1];
    if (this.MerchantType === 'kirana') {
      kiranaCategories.forEach((element: any, index: any) => {
        const seq = (index + 1).toString();
        const temp: any = {
          id: element.id,
          parentCategoryId: localStorage.getItem('vendorId'),
          descriptor: {
            name: element.name,
            // "shortDesc": element.shortDescription, // for kirana we dont need these fields
            // "longDesc": element.longDescription,
            // "images": element.images
          },
          tags: [
            {
              code: 'type',
              list: [
                {
                  code: 'type',
                  value: 'variant_group',
                },
              ],
            },
            {
              code: 'attr ',
              list: [
                {
                  code: 'name ',
                  value: 'item.quantity.unitized.measure ',
                },
                {
                  code: 'seq',
                  value: seq,
                },
              ],
            },
          ],
          vendorId: localStorage.getItem('vendorId'),
        };
        this.CategoryList.push(temp);
      });
    } else {
      cat.forEach((element: any) => {
        const temp: any = {
          id: element.id,
          parentCategoryId: localStorage.getItem('vendorId'),
          descriptor: {
            name: element.name,
            shortDesc: element.shortDescription,
            longDesc: element.longDescription,
            images: element.images,
          },
          tags: [
            {
              code: 'type',
              list: [
                {
                  code: 'type',
                  value: 'custom_menu',
                },
              ],
            },
            {
              code: 'timing',
              list: [
                {
                  code: 'day_from',
                  value: StartDay,
                },
                {
                  code: 'day_to',
                  value: EndDay,
                },
                {
                  code: 'time_from',
                  value: locationData?.time?.range?.start,
                },
                {
                  code: 'time_to',
                  value: locationData?.time?.range?.end,
                },
              ],
            },
            {
              code: 'display',
              list: [
                {
                  code: 'rank',
                  value: '3',
                },
              ],
            },
          ],
          vendorId: localStorage.getItem('vendorId'),
        };
        this.CategoryList.push(temp);
      });
    }
  }
}
