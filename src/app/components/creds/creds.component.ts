
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AddCredItemComponent } from '../add-cred-item/add-cred-item.component';
import { CredItem } from '../../models/CredItem';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-creds',
  standalone: true,
  imports: [AddCredItemComponent, CommonModule],
  styleUrl: './creds.component.css',
  templateUrl: './creds.component.html',
  
})
export class CredsComponent {
  MerchantType: string | null = '';
  constructor(private router: Router, private dialog: MatDialog) {}
 
  openDialog(): void {
    const dialogRef = this.dialog.open(AddCredItemComponent, {
      width: '600px'
    });

    dialogRef.afterClosed().subscribe((result: CredItem | undefined) => {
      if (result) {
        console.log('popup open successfully:', result);
      }
    });
  }
}
  
