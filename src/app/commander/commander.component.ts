// Importing the necessary modules
import { Component, OnInit } from '@angular/core'; // To define the Angular component
import { CommonModule } from '@angular/common'; // Provides common Angular directives like ngIf, ngFor
import { HttpClient } from '@angular/common/http'; // Allows making HTTP requests
import { FormsModule } from '@angular/forms'; // Manages forms
import { Router } from '@angular/router'; // Handles page navigation
import { HeaderComponent } from '../components/header/header.component'; // Importing the header component
import { FooterComponent } from '../components/footer/footer.component'; // Importing the footer component

// Defining the interface representing a cart item
interface CartItem {
  produitID: number; // Product ID
  nom: string;       // Product name
  quantite: number;  // Quantity of the product in the cart
  prix: number;      // Unit price of the product
}

// Interface for the response type when retrieving the cart
interface CommandeResponse {
  produits: CartItem[]; // List of products in the cart
  total: number;        // Total price of the cart
}

// Declaring the Commander component
@Component({
  selector: 'app-commander', // Selector used in the HTML
  standalone: true, // Standalone component
  imports: [FormsModule, CommonModule, HeaderComponent, FooterComponent], // Imported modules and components
  templateUrl: './commander.component.html', // Associated HTML file
  styleUrls: ['./commander.component.css'] // Associated CSS file
})
export class CommanderComponent implements OnInit {

  // List of items in the cart
  cartItems: CartItem[] = [];

  // Total price of the cart
  totalPrice: number = 0;

  // Loading indicator to display a spinner or something else
  isLoading: boolean = false;

  // Object representing the order form data
  form = {
    lname: '',    // Client's last name
    region: '',   // Client's region
    houseadd: '', // Client's house address
    phone: '',    // Client's phone number
    payment: ''   // Payment method (not used here)
  };

  // Injecting HttpClient for HTTP requests and Router for navigation
  constructor(private http: HttpClient, private router: Router) {}

  // Method automatically called when the component loads
  ngOnInit(): void {
    this.fetchClient(); // Calling the method to retrieve client and cart info
  }

  // Method to fetch client information and cart items
  fetchClient(): void {
    this.isLoading = true; // Activating the loading state

    // Fetching client information through a GET request
    this.http.get<any>('http://localhost:5000/Client/getClientInfo', { withCredentials: true }).subscribe(
      (response) => {
        // Filling the form fields with retrieved data
        this.form.lname = response.nom;
        this.form.region = response.region;
        this.form.houseadd = response.adresse;
        this.form.phone = response.tel;
      },
      (error) => {
        // Displaying an error if the request fails
        console.error('Error fetching client info:', error);
        this.isLoading = false;
      }
    );

    // Fetching cart content
    this.http.get<CommandeResponse>('http://localhost:5000/Cart/fetch', { withCredentials: true }).subscribe(
      (response) => {
        // Updating cart items and total price
        this.cartItems = response.produits;
        this.totalPrice = response.total;
        this.isLoading = false;
      },
      (error) => {
        // Displaying an error if fetching the cart fails
        console.error('Error fetching cart:', error);
        this.isLoading = false;
      }
    );
  }

  // Method to calculate the total price of the cart from the items
  getTotal(): number {
    return this.cartItems.reduce(
      (total, item) => total + (item.prix * item.quantite), 0
    );
  }

  // Method called when placing the order
  passerComm() {
    // Extracting form data
    const nom = this.form.lname;
    const region = this.form.region;
    const adresse = this.form.houseadd; // Correction: using houseadd, not region
    const tel = this.form.phone;

    // Creating the object to send to update the client info
    var form2 = { nom, region, adresse, tel };

    // PUT request to update client info
    this.http.put('http://localhost:5000/Client/updateClientInfo', form2, { withCredentials: true }).subscribe({
      next: () => {
        // If the update is successful, place the order
        this.http.post('http://localhost:5000/Cart/commander', {}, { withCredentials: true }).subscribe({
          next: () => {
            // Displaying an alert if the order is placed successfully
            alert('Your order has been placed successfully');
          },
          error: (error) => {
            // Displaying an error if the order fails
            alert('Error placing the order: ' + error.error?.error || error.message);
          }
        });
      },
      error: (error) => {
        // Displaying an error if updating client info fails
        alert('Error updating client information: ' + error.error?.error || error.message);
      }
    });

    // Redirecting to the home page
    this.router.navigate(['/homee']);
  }

}
