import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ShareLinkModalComponent } from '../share-link-modal/share-link-modal.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  constructor(
    private router: Router,
    private dialog: MatDialog,
  ) {}

  goToProfile() {
    this.router.navigate(['/profile']);
  }

  openShareModal(): void {
    this.dialog.open(ShareLinkModalComponent, {
      width: '440px',
      disableClose: false,
      autoFocus: false,
    });
  }
}
