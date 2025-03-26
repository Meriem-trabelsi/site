import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';  // Directly import HttpClient
import { ActivatedRoute } from '@angular/router';  // To get clientID from URL or route params

@Component({
  selector: 'app-cart-1',
  templateUrl: './cart-1.component.html',
  styleUrls: ['./cart-1.component.css']
})
export class Cart1Component implements OnInit {
  clientID: number = 1; // Example static clientID (you should get it dynamically, e.g., from session or auth)
  cartItems: any[] = [];
  totalPrice: number = 0;
  private apiUrl = 'http://localhost:3636/api/cart';  // Direct API URL

  constructor(private http: HttpClient, private route: ActivatedRoute) {}

  ngOnInit(): void {
    // Dynamically fetch clientID from route if available
    this.route.params.subscribe(params => {
      if (params['clientID']) {
        this.clientID = +params['clientID'];  // Use the clientID from URL
      }
    });
    this.fetchCart(); // Fetch cart data when the component initializes
  }

  // Fetch cart items from the backend
  fetchCart(): void {
    this.http.get<any[]>(`${this.apiUrl}/${this.clientID}`).subscribe(
      (data) => {
        this.cartItems = data;
        this.calculateTotalPrice();
      },
      (error) => {
        console.error('Error fetching cart data:', error);
      }
    );
  }

  // Add an item to the cart
  addToCart(produitID: number, quantite: number): void {
    this.http.post(`${this.apiUrl}/add`, { clientID: this.clientID, produitID, quantite }).subscribe(
      () => {
        console.log('Item added to cart');
        this.refreshCart(); // Refresh the cart data
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
        this.refreshCart(); // Refresh the cart data
      },
      (error) => {
        console.error('Error removing item from cart:', error);
      }
    );
  }
  // **Here is the onQuantityChange method**
  onQuantityChange(item: any, event: any): void {
    const newQuantity = event.target.value;
    item.quantite = newQuantity;

    this.updateQuantity(item.produitID, newQuantity);
  }


  // Update the quantity of an item in the cart
  updateQuantity(produitID: number, quantite: number): void {
    this.http.put(`${this.apiUrl}/update`, { clientID: this.clientID, produitID, quantite }).subscribe(
      () => {
        console.log('Quantity updated');
        this.refreshCart(); // Refresh the cart data
      },
      (error) => {
        console.error('Error updating quantity:', error);
      }
    );
  }

  // Refresh the cart data
  private refreshCart(): void {
    this.fetchCart();
  }

  // Calculate the total price for the cart
  calculateTotalPrice(): void {
    this.totalPrice = this.cartItems.reduce((sum, item) => {
      return sum + item.prix * item.quantite;
    }, 0);
  }
}
