import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';
import { PaginationParams, Products } from '../../types/types';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(private apiService: ApiService) {}

  getProducts = (
    url: string,
    params: PaginationParams
  ): Observable<Products> => {
    return this.apiService.get(url, { params, responseType: 'json' });
  };
  // Adding a product via the API
  addProduct = (url: string, body: any): Observable<any> => {
    return this.apiService.post(url, body, {});
  };

  // Editing a product via the API
  editProduct = (url: string, body: any): Observable<any> => {
    return this.apiService.put(url, body, {});
  };

  // Deleting a product via the API
  deleteProduct = (url: string): Observable<any> => {
    console.log(url);
    return this.apiService.delete(url, {});
  };

  // Upload file in a product via the API
  uploadProduct = (url: string, body: any): Observable<any> => {
    return this.apiService.post(url, body, {});
  };
}
