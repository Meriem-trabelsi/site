// Import necessary modules from Angular
import { Component, OnInit } from '@angular/core'; // To define a component and use the OnInit interface
import { CommonModule } from '@angular/common'; // Core Angular module (ngIf, ngFor, etc.)
import { HttpClient } from '@angular/common/http'; // To perform HTTP requests
import { ActivatedRoute } from '@angular/router'; // To access route parameters

// Import custom components (header and footer)
import { HeaderComponent } from '../components/header/header.component';
import { FooterComponent } from '../components/footer/footer.component';

// Declaration of the CartComponent
@Component({
  selector: 'app-cart', // HTML selector to use this component
  imports: [ // Modules and components needed by this component
    CommonModule, HeaderComponent, FooterComponent
  ],
  templateUrl: './cart.component.html', // Path to the associated HTML file
  styleUrls: ['./cart.component.css'] // CSS file for component styling
})
export class CartComponent implements OnInit {

  // Declare an array to store cart items
  cartItems: any[] = [];

  // Variable to store the total cart price
  totalPrice: number = 0;

  // Injecting HttpClient (for HTTP requests) and ActivatedRoute (for route access)
  constructor(private http: HttpClient, private route: ActivatedRoute) {}

  // Method automatically called when the component initializes
  ngOnInit(): void {
    // Call the method to fetch cart items
    this.fetchCart();
  }

  // Method to retrieve cart data from the backend
  fetchCart(): void {
    this.http.get<{produits: any[], total: number}>(
      `http://localhost:5000/Cart/fetch`, // API URL to get cart items
      { withCredentials: true } // Sends cookies for authentication
    ).subscribe(
      (response) => {
        // On success: store products and total price
        this.cartItems = response.produits;
        this.totalPrice = response.total;
        console.log(response); // Log the response
      },
      (error) => {
        // On request error
        console.error('Error fetching cart', error);
      }
    );
  }

  // Method triggered when quantity of an item changes
  onQuantityChange(item: any, event: any): void {
    const newQuantity = parseInt(event.target.value, 10); // Convert input value to integer

    // Check if the input value is valid
    if (isNaN(newQuantity) || newQuantity < 1) {
      // If invalid, reset to the previous value
      event.target.value = item.quantite;
      return;
    }

    // Update the quantity through the API
    this.updateQuantity(item.produitID, newQuantity);
  }

  // Method to send a request to the backend to update quantity
  updateQuantity(produitID: number, quantite: number): void {
    this.http.put(
      `http://localhost:5000/Cart/update`, // Update URL
      { produitID, quantite }, // Data to send
      { withCredentials: true } // Sends cookies
    ).subscribe(
      () => {
        console.log('Quantity has been updated');
        this.fetchCart(); // Reload the cart after update
      },
      (error) => {
        console.error('An error occurred during quantity update', error);

        // If the error is due to stock limits
        if (error.status === 400 && error.error?.error === "Quantité demandée dépasse le stock disponible.") {
          alert("Requested quantity exceeds available stock.");
        } else {
          // Other types of errors
          alert("An error occurred while updating quantity.");
        }
      }
    );
  }

  // Method to remove an item from the cart
  removeFromCart(produitID: number): void {
    this.http.delete(
      `http://localhost:5000/Cart/remove`, // Deletion URL
      {
        body: { produitID }, // Product ID to remove (sent in the body)
        withCredentials: true // Sends cookies
      }
    ).subscribe(
      () => {
        console.log('Item removed from cart');
        this.fetchCart(); // Reload the cart after removal
      },
      (error) => {
        console.error('Error while removing item from cart:', error);
      }
    );
  }

}
