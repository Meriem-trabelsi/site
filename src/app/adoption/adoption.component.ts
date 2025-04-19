import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../components/header/header.component';
import { FooterComponent } from '../components/footer/footer.component';
import { PetFiltersComponent } from '../components/pet-filters/pet-filters.component';
import { PethomeComponent } from '../components/pethome/pethome.component';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-adoption',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent, FooterComponent, PetFiltersComponent, PethomeComponent], // Ensure PethomeComponent is included here
  templateUrl: './adoption.component.html',
  styleUrls: ['./adoption.component.css']
})
export class AdoptionComponent implements OnInit {
  isLoggedIn: boolean = false;
  filters: { location: string, types: string[], ages: string[] } = {
    location: '',
    types: [],
    ages: []
  };

  constructor(
    private http: HttpClient,
    private router: Router // Inject Router service for navigation
  ) {}

  ngOnInit(): void {
    this.checkAuthStatus();
  }

  checkAuthStatus(): void {
    this.http.get<{ client: any }>('http://localhost:5000/Client/checkAuth', {
      withCredentials: true // Include cookies in request
    }).subscribe(
      (response) => {
        console.log('Logged in:', response);
        this.isLoggedIn = true;
      },
      (error) => {
        console.log('Not logged in:', error);
        this.isLoggedIn = false;
      }
    );
  }

  handlePostAdoption(event: MouseEvent): void {
    event.preventDefault();
    if (this.isLoggedIn) {
      this.router.navigate(['/post']); // Navigate to post page
    } else {
      alert('You must be logged in to post a pet for adoption.');
      this.router.navigate(['/login']);
    }
  }

  // Listen for filter changes
  onFiltersChanged(filters: { location: string, types: string[], ages: string[] }): void {
    this.filters = filters;
    console.log('Filters updated:', this.filters);
  }
}
