import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VariantService {
  private variantsSubject = new BehaviorSubject<any[]>([]);
  variants$ = this.variantsSubject.asObservable();

  constructor() {}

  updateVariants(variants: any[]) {
    this.variantsSubject.next(variants);
  }
}
