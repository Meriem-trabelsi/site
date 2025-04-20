import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdoptdetailsComponent } from '../../popup/adoptdetails/adoptdetails.component';
import { HttpClient } from '@angular/common/http';
import { PetFilters } from '../pet-filters/pet-filters.component'; // Import PetFilters interface
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-pethome',
  standalone: true,
  imports: [CommonModule, FormsModule, AdoptdetailsComponent], // Keep only necessary imports
  templateUrl: './pethome.component.html',
  styleUrls: ['./pethome.component.css']
})
export class PethomeComponent implements OnInit, OnChanges {
  isLoggedIn: boolean = false;
  clientId: number = 0;
  @Input() filters: PetFilters = { location: '', types: [], ages: 0 }; // Input filter property
  @Input() limit?: number;

  pets: any[] = [];
  selectedPet: any = null;
  isLoading: boolean = false; // Add the isLoading property here

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.checkAuthStatus();
    this.loadPets();  // Initially load pets when the component is initialized
  }

  checkAuthStatus(): void {
    this.http.get<{ client: any }>('http://localhost:5000/Client/checkAuth', {
      withCredentials: true // Include cookies in request
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

  loadPets() {
    this.isLoading = true;
    this.http.get<any[]>('http://localhost:5000/adoptPet/')
      .subscribe({
        next: (data) => {
          this.pets = this.limit ? data.slice(0, this.limit) : data;
          this.isLoading = false;
        },
        error: (err) => {
          this.isLoading = false;
          console.error('Error loading pets:', err);
        }
      });
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
    this.http.get<any[]>(`http://localhost:5000/adoptPet/pets?${queryParams}`)
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

  openPetModal(pet: any) {
    this.selectedPet = pet;  // Open a modal with selected pet details
  }

  deleteAdoption(pet: any): void {
    this.http.delete(`http://localhost:5000/adoptPet/delete/${pet.adoptionPetID}`, {
      withCredentials: true
    }).subscribe(
      (res) => {
        alert('Adoption post deleted successfully.');
        location.reload();
      },      (err) => console.error('Error deleting post', err)
    );
  }
  

  closePetModal() {
    this.selectedPet = null;  // Close the modal
  }

  onFiltersChanged(updatedFilters: { location: string, types: string[], ages: number }): void {
    this.filters = updatedFilters;  // Update the filters in the component
    console.log('Filters updated in parent:', this.filters);
    this.fetchPets();  // Fetch pets with updated filters
  }
}
