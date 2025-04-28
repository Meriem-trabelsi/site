import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Product } from '../../services/product.service';
import { RouterModule } from '@angular/router'; 

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.css'],
  standalone: true,
  imports: [CommonModule,RouterModule ]
})
export class ProductCardComponent {
  @Input() product!: Product;
  selectedQuantity: number = 1;

  constructor(private http: HttpClient) {}

  get produitID(): string {
    return this.product?.produitID?.toString() || '';
  }

  getStarsArray(rating: number): number[] {
    return Array(Math.floor(rating || 0)).fill(0);
  }

  getEmptyStarsArray(rating: number): number[] {
    const validRating = Math.max(0, Math.min(5, Math.floor(rating || 0))); // Ensures rating is between 0 and 5
    return Array(5 - validRating).fill(0);
  }  

  addToCart(): void {
    this.http.post(
      `http://localhost:5000/Cart/add`,
      { produitID: this.produitID, quantite: this.selectedQuantity },
      { withCredentials: true }
    ).subscribe(
      () => {
        alert('Product added to cart !');
      },
      (error) => {
        console.error('Error adding to cart:', error);
        if (error.status === 400) {
          alert("The quantity surpasses our available stock!");
        } else if (error.status === 401) {
          alert("Please login.");
          window.location.href = '/login';
        } else {
          alert("Error adding to cart");
        }
      }
    );
  }
}
