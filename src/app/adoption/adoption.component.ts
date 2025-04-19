import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../components/header/header.component';
import { FooterComponent } from '../components/footer/footer.component';
import { PetFiltersComponent } from '../components/pet-filters/pet-filters.component';
import { PethomeComponent } from '../components/pethome/pethome.component';
import { HttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';  // Import Router for navigation

@Component({
  selector: 'app-adoption',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent, FooterComponent, PethomeComponent, PetFiltersComponent],
  templateUrl: './adoption.component.html',
  styleUrls: ['./adoption.component.css']
})
export class AdoptionComponent implements OnInit {
  isLoggedIn: boolean = false;

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

  // Handle click event and navigate to post-lost page
  handlePostAdoption(event: MouseEvent): void {
    event.preventDefault(); // Prevent default link behavior if needed

    // Check if the user is logged in before allowing them to navigate to the post-lost page
    if (this.isLoggedIn) {
      this.router.navigate(['/post']); // Navigate to the post-lost page
    } else {
      // If the user is not logged in, redirect to the login page or show an alert
      alert('You must be logged in to post a pet for adoption.');
      this.router.navigate(['/login']); // Navigate to the login page (or adjust to your actual login route)
    }
  }
}
