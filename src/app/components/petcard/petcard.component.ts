import { Component, OnInit,Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LostDetailsComponent } from '../../popup/lostdetails/lostdetails.component';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-petcard',
  imports: [CommonModule, LostDetailsComponent],
  templateUrl: './petcard.component.html',
  styleUrls: ['./petcard.component.css'],
  standalone: true
})
export class PetCardComponent implements OnInit {
  @Input() pet: any;

  pets: any[] = [];  // Array to hold the pets retrieved from the backend
  selectedPet: any = null;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    // Fetch lost pets when the component initializes
    this.fetchLostPets();
  }

  // Function to fetch lost pets from the backend
  // Example of logging the fetched data
  fetchLostPets(): void {
    this.http.get<any[]>('http://localhost:5000/lostPet/all')
      .subscribe(
        (data) => {
          this.pets = data.map(pet => {
            // Convert dateLost to a Date object if it's not already
            pet.dateLost = new Date(pet.dateLost);
            return pet;
          });
          console.log('Fetched pets:', this.pets);  // Log the pets data to check the dateLost format
        },
        (error) => {
          console.error('Erreur lors de la récupération des animaux perdus', error);
        }
      );
  }
  

  openPetModal(pet: any): void {
    this.selectedPet = pet;  // Set the selected pet to show details in the modal
  }

  closePetModal(): void {
    this.selectedPet = null;  // Close the modal by resetting the selected pet
  }
}
