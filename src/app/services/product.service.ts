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
  fournisseurID: number;
}


@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'http://localhost:5000/produit';

  constructor(private http: HttpClient) {}

  getProducts(categoryID?: number): Observable<any[]> {
    let url = this.apiUrl;
    if (categoryID) {
      url += `?categoryID=${categoryID}`;
    }
    return this.http.get<Product[]>(url);
  }

  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }

  getProductSpecifications(id: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/fiche-technique/${id}`);
  }

}