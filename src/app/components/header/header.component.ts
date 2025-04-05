import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CategoryService } from '../../services/categorie.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
  categories: any[] = [];

  constructor(private categoryService: CategoryService, private router: Router) {}

  ngOnInit(): void {
    this.categoryService.getCategories().subscribe(
      (data) => {
        this.categories = data.slice(0, 7); // Limit to 7 max
      },
      (error) => {
        console.error('Error fetching categories:', error);
      }
    );
  }

  goToCategory(categoryId: number): void {
    this.router.navigate(['/shop'], {
      queryParams: { categoryID: categoryId }
    });
  }
  
  goToPage() {
    this.router.navigate(['/login']);
  }

  checkAuthStatus(): void {
    this.http.get<{ client: any }>('http://localhost:5000/Client/checkAuth', { withCredentials: true }).subscribe(
      (response) => {
        console.log('Already logged in:', response);
        this.isLoggedIn = true;  // User is logged in
      },
      (error) => {
        console.log('Not logged in:', error);
        this.isLoggedIn = false; // User is not logged in
      }
    );
  }

  goToPage(): void {
    if (this.isLoggedIn) {
      this.logout();
    } else {
      this.router.navigate(['/login']);
    }
  }

  logout(): void {
    this.http.post('http://localhost:5000/Client/logout', {}, { withCredentials: true }).subscribe(
      () => {
        alert('Logged out successfully');
        this.isLoggedIn = false;
        this.router.navigate(['/']);
      },
      (error) => {
        console.log('Logout failed:', error);
      }
    );
  }
}
