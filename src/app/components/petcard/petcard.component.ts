import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LostDetailsComponent } from '../../popup/lostdetails/lostdetails.component';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { PetFilters } from '../pet-filters/pet-filters.component';

@Component({
  selector: 'app-petcard',
  imports: [CommonModule, FormsModule, LostDetailsComponent],
  templateUrl: './petcard.component.html',
  styleUrls: ['./petcard.component.css'],
  standalone: true
})
export class PetCardComponent implements OnInit, OnChanges {
  timestamp = Date.now();
  isLoggedIn: boolean = false;
  clientId: number = 0;
  @Input() filters: PetFilters = { location: '', types: [], ages: 0 }; // Input filter property
  @Input() limit?: number;

  pets: any[] = [];  // Array to hold the pets retrieved from the backend
  selectedPet: any = null;
  isLoading: boolean = false; // Add the isLoading property here

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.checkAuthStatus();
    this.fetchLostPets();
  }

   checkAuthStatus(): void {
    this.http.get<{ client: any }>('http://localhost:5000/Client/checkAuth', {
      withCredentials: true
    }).subscribe(
      (response) => {
        console.log('Logged in:', response);
        this.clientId = response.client.clientID;
        this.isLoggedIn = true;
      },
      (error) => {
        console.log('Not logged in:', error);
        this.isLoggedIn = false;
      }
    );
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['filters']) {
      this.fetchPets(); // Fetch pets whenever filters change
    }
  }

  fetchLostPets(){
    this.isLoading = true;
    this.http.get<any[]>('http://localhost:5000/lostPet/all')
      .subscribe(
        (data) => {
          const processedPets = data.map(pet => {
            pet.dateLost = new Date(pet.dateLost);
            return pet;
          });
          this.pets = this.limit ? processedPets.slice(0, this.limit) : processedPets;
          console.log('Fetched pets:', this.pets);
        },
        (error) => {
          console.error('Erreur lors de la récupération des animaux perdus', error);
        }
      );
  }

  fetchPets(): void {
    let queryParams = '';
  
    if (this.filters.location) {
      queryParams += `location=${this.filters.location}&`;
    }
    if (this.filters.types.length > 0) {
      queryParams += `types=${this.filters.types.join(',')}&`;
    }
    if (this.filters.ages > 0) {
      queryParams += `ages=${this.filters.ages}&`; // 'ages_lt' for "less than"
    }
  
    queryParams = queryParams.slice(0, -1);  // Remove the trailing "&"
  
    this.isLoading = true; // Set loading to true while fetching
    this.http.get<any[]>(`http://localhost:5000/lostPet/pets?${queryParams}`)
    .subscribe(
      (response) => {
        this.pets = this.limit ? response.slice(0, this.limit) : response;
        this.isLoading = false;
      },
      (error) => {
        this.isLoading = false;
        console.error('Error fetching pets:', error);
      }
    );
  }
  loadLostPets() {
    this.isLoading = true;
    this.http.get<any[]>('http://localhost:5000/lostPet/lost')
      .subscribe({
        next: (data) => {
          this.pets = this.limit ? data.slice(0, this.limit) : data;
          this.isLoading = false;
        },
        error: (err) => {
          this.isLoading = false;
          console.error('Error loading lost pets:', err);
        }
      });
  }
  handleButtonClick(pet: any): void {
    if (this.clientId === pet.clientID) {
      this.deleteLostPet(pet);
    } else {
      this.openPetModal(pet);
    }
  }
  
  deleteLostPet(pet: any): void {
    console.log('Trying to delete pet with ID:', pet.lostPetID);
      if (!confirm('Are you sure you want to delete this lost pet post?')) return;
    
  
      this.http.delete(`http://localhost:5000/lostPet/delete/${pet.lostPetID}`, {
        withCredentials: true
      }).subscribe(
      (res) => {
        alert('Lost pet post deleted successfully.');
        this.fetchLostPets(); // Refresh the list after deletion
      },
      (err) => {
        console.error('Error deleting lost pet post:', err);
        alert('Failed to delete lost pet post. You may not be the owner.');
      }
    );
  }
  
  
  onFiltersChanged(updatedFilters: { location: string, types: string[], ages: number }): void {
    this.filters = updatedFilters;  // Update the filters in the component
    console.log('Filters updated in parent:', this.filters);
    this.fetchPets();  // Fetch pets with updated filters
  }

  openPetModal(pet: any): void {
    this.selectedPet = pet;  // Set the selected pet to show details in the modal
  }

  closePetModal(): void {
    this.selectedPet = null;  // Close the modal by resetting the selected pet
  }
}
