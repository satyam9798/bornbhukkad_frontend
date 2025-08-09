import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class GeocodingService {
  private apiKey: string = environment?.NG_APP_GOOGLE_MAPS_API_KEY;

  constructor(private http: HttpClient) {}

  geocodeAddress(address: string): Observable<{ lat: number; lng: number }> {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      address
    )}&key=${this.apiKey}`;

    return this.http.get(url).pipe(
      map((response: any) => {
        if (response.status === 'OK' && response.results.length > 0) {
          const location = response.results[0].geometry.location;
          return { lat: location.lat, lng: location.lng };
        } else {
          throw new Error('Geocoding failed: ' + response.status);
        }
      })
    );
  }
}
