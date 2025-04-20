import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { AdoptdetailsComponent } from '../../popup/adoptdetails/adoptdetails.component';
import { HttpClient } from '@angular/common/http';
import { PetFilters } from '../pet-filters/pet-filters.component'; // Import PetFilters interface
import { FormsModule } from '@angular/forms';

interface DeletePetResponse {
  message: string;
}

@Component({
  selector: 'app-pethome',
  standalone: true,
  imports: [CommonModule, FormsModule, AdoptdetailsComponent], // Keep only necessary imports
  templateUrl: './pethome.component.html',
  styleUrls: ['./pethome.component.css']
})
export class PethomeComponent implements OnInit, OnChanges {
  @Input() filters: PetFilters = { location: '', types: [], ages: [] }; // Input filter property
  @Input() limit?: number;


  pets: any[] = [];
  selectedPet: any = null;
  isLoading: boolean = false; // Add the isLoading property here

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadPets();  // Initially load pets when the component is initialized
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
    if (this.filters.ages.length > 0) {
      queryParams += `ages=${this.filters.ages.join(',')}&`;
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

  closePetModal() {
    this.selectedPet = null;  // Close the modal
  }

  onFiltersChanged(updatedFilters: { location: string, types: string[], ages: string[] }): void {
    this.filters = updatedFilters;  // Update the filters in the component
    console.log('Filters updated in parent:', this.filters);
    this.fetchPets();  // Fetch pets with updated filters
  }

  deletePet(petId: string) {
    const confirmation = confirm('Are you sure you want to delete this pet?');
    if (confirmation) {
      this.isLoading = true;  // Start loading state
      
      // Perform DELETE request
      this.http.delete<DeletePetResponse>(`http://localhost:5000/delete/${petId}`, { headers: this.getAuthHeaders() })
        .subscribe({
          next: (response) => {
            this.isLoading = false;  // End loading state
  
            // Check if the response contains the message indicating successful deletion
            if (response && response.message === 'Pet deleted successfully') {
              // Remove the pet from the local list
              this.pets = this.pets.filter(pet => pet.petID !== petId); // Ensure matching by petID
              console.log('Pet deleted successfully');
            } else {
              console.error('Failed to delete pet: ', response);
            }
          },
          error: (err) => {
            this.isLoading = false;  // End loading state
            console.error('Error deleting pet:', err);
          }
        });
    }
  }
  
  

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token'); // Assuming JWT token is stored in localStorage
    if (token) {
      return new HttpHeaders({ Authorization: `Bearer ${token}` });
    } else {
      return new HttpHeaders(); // Return empty HttpHeaders if no token is found
    }
  }

  
}
