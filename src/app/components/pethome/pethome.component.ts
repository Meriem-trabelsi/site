import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdoptdetailsComponent } from '../../popup/adoptdetails/adoptdetails.component';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-pethome',
  standalone: true,
  imports: [CommonModule, AdoptdetailsComponent],
  templateUrl: './pethome.component.html',
  styleUrls: ['./pethome.component.css']
})
export class PethomeComponent implements OnInit {
  pets: any[] = [];
  selectedPet: any = null;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadPets();
  }

  loadPets() {
    this.http.get<any[]>('http://localhost:5000/adoptPet/')
      .subscribe({
        next: (data) => {
          this.pets = data;
        },
        error: (err) => {
          console.error('Erreur lors du chargement des animaux à adopter :', err);
        }
      });
  }

  openPetModal(pet: any) {
    this.selectedPet = pet;
  }

  closePetModal() {
    this.selectedPet = null;
  }
}
