import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Offer, Audience } from '../models/offer.model';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class OfferService {
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
      `http://localhost:8080/merchants/restaurantOffer?vendorId=${vendorId}`,
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
      `http://localhost:8080/merchants/offer?id=${id}`,
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
      `http://localhost:8080/merchants/get-restaurant-audience?vendorId=${vendorId}`,
      options
    );
  }

  createOffer(offer: Offer[]): Observable<any> {
    return this.http.post(
      `http://localhost:8080/merchants/restaurantOffer`,
      offer
    );
  }
  // TODO
  updateOffer(offerId: String, offer: Offer): Observable<any> {
    return this.http.patch(`http://localhost:8080/merchants/offer?offerId=${offerId}`, offer);
  }
  // TODO
  deleteOffer(offerId: String): Observable<any> {
    return this.http.delete(`http://localhost:8080/merchants/offer?offerId=${offerId}`);
  }
}
