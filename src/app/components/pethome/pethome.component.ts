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
  @Input() filters: PetFilters = { location: '', types: [], ages: [] }; // Input filter property

  pets: any[] = [];
  selectedPet: any = null;

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
    // Initial fetch of all pets
    this.http.get<any[]>('http://localhost:5000/adoptPet/')
      .subscribe({
        next: (data) => {
          this.pets = data;
        },
        error: (err) => {
          console.error('Error loading pets:', err);
        }
      });
  }

  // Method to filter pets using frontend filters (can be used independently)
  filterPets() {
    let filteredPets = this.pets;
  
    // Filter by location
    if (this.filters.location) {
      filteredPets = filteredPets.filter(pet => pet.location === this.filters.location);
    }
  
    // Filter by pet types
    if (this.filters.types.length > 0) {
      filteredPets = filteredPets.filter(pet => this.filters.types.includes(pet.type));
    }
  
    // Filter by ages
    if (this.filters.ages.length > 0) {
      filteredPets = filteredPets.filter(pet => this.filters.ages.includes(pet.age));
    }
  
    this.pets = filteredPets;  // Update the pets list
  }

  // Method to fetch pets from backend with updated filters
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
  
    // Fetch pets from the backend using query parameters
    this.http.get<any[]>(`http://localhost:5000/pets?${queryParams}`)
      .subscribe(
        (response) => {
          this.pets = response;  // Update the pets list with filtered pets
        },
        (error) => {
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
}
