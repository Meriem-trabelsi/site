import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router'; // Import Router for navigation
import { PetCardComponent } from '../components/petcard/petcard.component';
import { HeaderComponent } from '../components/header/header.component';
import { FooterComponent } from '../components/footer/footer.component';
import { PetFiltersComponent } from '../components/pet-filters/pet-filters.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-lost',
  templateUrl: './lost.component.html',
  styleUrls: ['./lost.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, PetCardComponent, HeaderComponent, FooterComponent, PetFiltersComponent]
})
export class LostComponent implements OnInit, OnChanges {
  @Input() filters!: { location: string; types: string[]; ages: number };
  filteredPets: any[] = [];
  allPets: any[] = [];
  isLoggedIn: boolean = false;
  clientId: number = 0;

  constructor(
    private http: HttpClient,
    private router: Router // Inject Router service for navigation
  ) {}

  ngOnInit(): void {
    this.checkAuthStatus();
  }

  ngOnChanges(): void {
    this.applyFilters();
  }

  applyFilters(): void {
    const { location, types, ages } = this.filters;

    this.filteredPets = this.allPets.filter(pet => {
      const matchLocation = location ? pet.location === location : true;
      const matchType = types.length ? types.includes(pet.type) : true;
      const matchAge = ages ? ages === pet.age : true;

      return matchLocation && matchType && matchAge;
    });
  }

  // Listen for filter changes
  onFiltersChanged(filters: { location: string, types: string[], ages: number }): void {
    this.filters = filters;
    console.log('Filters updated:', this.filters);
  }

  // Vérifie si l'utilisateur est connecté
  checkAuthStatus(): void {
    this.http.get<{ client: any }>('http://localhost:5000/Client/checkAuth', {
      withCredentials: true // Inclut les cookies dans la requête
    }).subscribe(
      (response) => {
        console.log('Déjà connecté :', response);
        this.isLoggedIn = true;
      },
      (error) => {
        console.log('Non connecté :', error);
        this.isLoggedIn = false;
      }
    );
  }

  // Handle the "Report a Lost Pet" click event
  handleReportLostPet(event: MouseEvent): void {
    event.preventDefault(); // Prevent the default anchor behavior
    if (this.isLoggedIn) {
      this.router.navigate(['/plost']); // Navigate to the report lost pet page
    } else {
      alert('You must be logged in to report a lost pet.');
      this.router.navigate(['/login']); // Redirect to login page if not logged in
    }
  }
}
