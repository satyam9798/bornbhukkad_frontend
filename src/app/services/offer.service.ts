import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Offer, Audience } from '../models/offer.model';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class OfferService {
  private baseUrl = environment.apiUrl;
  constructor(private http: HttpClient) {}

  getOffers(vendorId: string): Observable<Offer[]> {
    const token = localStorage.getItem('token');
    const headers = token
      ? new HttpHeaders().set('Authorization', `Bearer ${token}`)
      : undefined;
    // let vendorId= localStorage.getItem('vendorId');
    const options = {
      headers: headers,
    };
    return this.http.get<Offer[]>(
      `${this.baseUrl}/merchants/restaurantOffer?vendorId=${vendorId}`,
      options
    );
  }

  getOfferById(id: string): Observable<Offer> {
    const token = localStorage.getItem('token');
    const headers = token
      ? new HttpHeaders().set('Authorization', `Bearer ${token}`)
      : undefined;
    // let vendorId= localStorage.getItem('vendorId');
    const options = {
      headers: headers,
    };
    return this.http.get<Offer>(
      `${this.baseUrl}/merchants/offer?id=${id}`,
      options
    );
  }

  getAudiences(vendorId: string): Observable<Audience[]> {
    const token = localStorage.getItem('token');
    const headers = token
      ? new HttpHeaders().set('Authorization', `Bearer ${token}`)
      : undefined;
    const options = {
      headers: headers,
    };
    return this.http.get<Audience[]>(
      `${this.baseUrl}/merchants/get-restaurant-audience?vendorId=${vendorId}`,
      options
    );
  }

  createOffer(offer: Offer[]): Observable<any> {
    return this.http.post(
      `${this.baseUrl}/merchants/restaurantOffer`,
      offer
    );
  }
  // TODO
  updateOffer(offerId: String, offer: Offer): Observable<any> {
    return this.http.patch(`${this.baseUrl}/merchants/offer?offerId=${offerId}`, offer);
  }
  // TODO
  deleteOffer(offerId: String): Observable<any> {
    return this.http.delete(`${this.baseUrl}/merchants/offer?offerId=${offerId}`);
  }
}
