import { Component, OnInit } from '@angular/core'; 
import { Router } from '@angular/router'; 
import { CategoryService } from '../../services/categorie.service'; 
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common'; 

@Component({
  selector: 'app-header', 
  standalone: true,
  imports: [CommonModule], 
  templateUrl: './header.component.html', 
  styleUrl: './header.component.css' 
})
export class HeaderComponent implements OnInit {
  // Array to store categories
  categories: any[] = [];

  // Variable to track the user's login status
  isLoggedIn = false;

  // Inject required services through the constructor
  constructor(
    private categoryService: CategoryService, 
    private router: Router,                   
    private http: HttpClient                  
  ) {}

  ngOnInit(): void {
    // Call the service to fetch categories from the API
    this.categoryService.getCategories().subscribe(
      (data) => {
        this.categories = data.slice(0, 7);
      },
      (error) => {
        console.error('Error while fetching categories:', error);
      }
    );

    // Check if the user is logged in
    this.checkAuthStatus();
  }

  // Function to navigate to a specific category
  goToCategory(categoryId: number): void {
    // Redirect to the 'shop' page with a query parameter (categoryID)
    this.router.navigate(['/shop'], {
      queryParams: { categoryID: categoryId }
    });
  }

  // Check if the client is logged in by calling the backend API
  checkAuthStatus(): void {
    this.http.get<{ client: any }>('http://localhost:5000/Client/checkAuth', {
      withCredentials: true // Include cookies in the request (for sessions)
    }).subscribe(
      (response) => {
        // If the client is logged in, show confirmation and update isLoggedIn
        console.log('Already logged in:', response);
        this.isLoggedIn = true;
      },
      (error) => {
        // Otherwise, indicate the user is not logged in
        console.log('Not logged in:', error);
        this.isLoggedIn = false;
      }
    );
  }

  // Redirect user based on login status
  goToPage(): void {
    if (this.isLoggedIn) {
      // If logged in, log the user out
      this.logout();
    } else {
      // Otherwise, redirect to the login page
      this.router.navigate(['/login']);
    }
  }

  // Function to log out the user
  logout(): void {
    this.http.post('http://localhost:5000/Client/logout', {}, {
      withCredentials: true // Send session cookies too
    }).subscribe(
      () => {
        // If logout is successful, show a message, update state and redirect to home
        alert('Logged out successfully');
        this.isLoggedIn = false;
        this.router.navigate(['/']);
      },
      (error) => {
        // On logout failure, log the error
        console.log('Logout failed:', error);
      }
    );
  }
}
