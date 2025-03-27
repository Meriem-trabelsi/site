import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-cart-1',
  imports: [
    CommonModule,
  ],
  templateUrl: './cart-1.component.html',
  styleUrls: ['./cart-1.component.css']
})
export class Cart1Component implements OnInit {
  
  cartItems: any[] = [];
  totalPrice: number = 0;
  

  constructor(private http: HttpClient, private route: ActivatedRoute) {}

  ngOnInit(): void {
    // Dynamically fetch clientID from route if available
    
      this.fetchCart(); // Fetch cart after setting clientID
    }
  

  // Fetch cart items from the backend
  fetchCart(): void {
    this.http.get<{produits: any[], total: number}>(`http://localhost:5000/Cart/fetch`,{ withCredentials: true }).subscribe(
      (response) => {
        // The backend returns an object with 'produits' and 'total'
        this.cartItems = response.produits;
        this.totalPrice = response.total;
        console.log(response);
      },
      (error) => {
        console.error('Error fetching cart data:', error);
      }
    );
  }

  // Add an item to the cart
  /*addToCart(produitID: number, quantite: number): void {
    this.http.post(`http://localhost:5000/Cart/add`, { clientID: this.clientID, produitID, quantite }).subscribe(
      () => {
        console.log('Item added to cart');
        this.fetchCart(); // Refresh the cart data
      },
      (error) => {
        console.error('Error adding item to cart:', error);
      }
    );
  }

  // Remove an item from the cart
  removeFromCart(produitID: number): void {
    this.http.delete(`${this.apiUrl}/remove`, { body: { clientID: this.clientID, produitID } }).subscribe(
      () => {
        console.log('Item removed from cart');
        this.fetchCart(); // Refresh the cart data
      },
      (error) => {
        console.error('Error removing item from cart:', error);
      }
    );
  }

  // Update the quantity of an item in the cart
  onQuantityChange(item: any, event: any): void {
    const newQuantity = parseInt(event.target.value, 10);
    
    // Validate the input
    if (isNaN(newQuantity) || newQuantity < 1) {
      // Reset to the previous quantity if invalid
      event.target.value = item.quantite;
      return;
    }

    this.updateQuantity(item.produitID, newQuantity);
  }

  // Update quantity via API
  updateQuantity(produitID: number, quantite: number): void {
    this.http.put(`${this.apiUrl}/update`, { clientID: this.clientID, produitID, quantite }).subscribe(
      () => {
        console.log('Quantity updated');
        this.fetchCart(); // Refresh the cart data
      },
      (error) => {
        console.error('Error updating quantity:', error);
      }
    );
  }*/
}