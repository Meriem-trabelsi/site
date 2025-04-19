import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router'; // Import Router for navigation
import { PetCardComponent } from '../components/petcard/petcard.component';
import { LostDetailsComponent } from '../popup/lostdetails/lostdetails.component';
import { HeaderComponent } from '../components/header/header.component';
import { FooterComponent } from '../components/footer/footer.component';
import { PetFiltersComponent } from '../components/pet-filters/pet-filters.component';

@Component({
  selector: 'app-lost',
  templateUrl: './lost.component.html',
  styleUrls: ['./lost.component.css'],
  standalone: true,
  imports: [PetCardComponent, LostDetailsComponent, HeaderComponent, FooterComponent, PetFiltersComponent]
})
export class LostComponent implements OnInit {
  isLoggedIn: boolean = false;
  pets = [
    { name: 'Max', breed: 'Golden Retriever', location: 'Tunis', lostDate: '2025-04-10', imageUrl: 'path/to/image' },
    { name: 'Luna', breed: 'Siamese', location: 'Sfax', lostDate: '2025-04-12', imageUrl: 'path/to/image' },
    { name: 'Charlie', breed: 'Bulldog', location: 'Hammamet', lostDate: '2025-04-14', imageUrl: 'path/to/image' }
  ];

  selectedPet: any = null;

  constructor(
    private http: HttpClient,
    private router: Router // Inject Router service for navigation
  ) {}

  ngOnInit(): void {
    this.checkAuthStatus();
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

  // Show details of a lost pet
  showLostDetails(pet: any) {
    if (this.isLoggedIn) {
      this.selectedPet = pet;
    } else {
      alert('You must be logged in to view details.');
      this.router.navigate(['/login']); // Navigate to login page
    }
  }

  // Close the details of a lost pet
  closeLostDetails() {
    this.selectedPet = null;
  }
}
