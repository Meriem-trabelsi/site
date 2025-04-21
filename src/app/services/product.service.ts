import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Product {
  produitID: number;
  nomProd: string;
  nom: string;
  description: string;
  prix: number;
  oldPrice: number;
  stock: number;
  imageURL: string;
  categorieID: number;
  rating: number;
}


@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'http://localhost:5000/produit';

  constructor(private http: HttpClient) {}

  getProducts(categoryID?: number, maxPrice?: number): Observable<any[]> {
    let url = this.apiUrl;
    const params: string[] = [];
  
    if (categoryID !== undefined) {
      params.push(`categoryID=${categoryID}`);
    }
  
    if (maxPrice !== undefined) {
      params.push(`maxPrice=${maxPrice}`);
    }
  
    if (params.length > 0) {
      url += `?${params.join('&')}`;
    }
    return this.http.get<Product[]>(url);
  }

  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }

  getProductSpecifications(id: number): Observable<any[]> {
    return this.http.get<any[]>(`http://localhost:5000/fiche-technique/${id}`);
  }
}