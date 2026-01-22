import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { PublicLinkService } from '../../services/public-link.service';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-share-link-modal',
  standalone: true,
  templateUrl: './share-link-modal.component.html',
  styleUrls: ['./share-link-modal.component.scss'],
  imports: [CommonModule],
})
export class ShareLinkModalComponent implements OnInit {
  link: any;
  publicUrl = '';
  private MerchantType: String | null = '';
  loading = false;
  private baseUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private publicLinkService: PublicLinkService,
  ) {}

  ngOnInit() {
    this.MerchantType = localStorage.getItem('type');
    this.fetchLink();
  }
  fetchLink(): void {
    this.loading = true;
    this.publicLinkService.getPublicLink().subscribe({
      next: (res) => {
        this.setLink(res);
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  generateLink(): void {
    this.fetchLink();
  }

  regenerateLink() {
    // this.http
    //   .post<any>(
    //     `${this.baseUrl}/merchants/restaurant/public-link/regenerate`,
    //     {},
    //   )
    //   .subscribe((res) => {
    //     this.link = res;
    //     this.publicUrl = `https://order.yourdomain.com/r/${res.publicLinkId}`;
    //   });
  }

  private setLink(res: any): void {
    this.link = res;
    this.publicUrl = `${environment.merchant_website_url}/r/${res.publicLinkId}`;
  }

  copyLink(): void {
    navigator.clipboard.writeText(this.publicUrl);
  }

  close() {
    // emit close event / hide modal
  }
}
