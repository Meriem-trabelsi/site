import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

interface CartItem {
  produitID: number;
  nom: string;
  quantite: number;
  prix: number;
}

interface CommandeResponse {
  produits: CartItem[];
  total: number;
}

@Component({
  selector: 'app-commander',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './commander.component.html',
  styleUrls: ['./commander.component.css']
})
export class CommanderComponent implements OnInit {

  cartItems: CartItem[] = [];   // Liste des articles du panier
  totalPrice: number = 0;  // Prix total du panier
  isLoading: boolean = false;

  //  Formulaire dynamique
  form = {
    lname: '',   // Prénom (fname) is removed
    region: '',
    houseadd: '',
    phone: '',
    payment: ''
  };

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.fetchClient(); // Récupération du panier au chargement du composant
  }

  // Fonction pour récupérer le panier depuis le serveur
  fetchClient(): void {
    this.isLoading = true;
    this.http.get<any>('http://localhost:5000/Client/getClientInfo', { withCredentials: true }).subscribe(
      (response) => {
        this.form.lname = response.nom;
        this.form.region = response.region;
        this.form.houseadd = response.adresse;
        this.form.phone = response.tel;
      },
      (error) => {
        console.error('Error fetching client info:', error);
        this.isLoading = false;
      }
    );
    this.http.get<CommandeResponse>('http://localhost:5000/Cart/fetch', { withCredentials: true }).subscribe(
      (response) => {
        this.cartItems = response.produits;
        this.totalPrice = response.total;
        this.isLoading = false;
      },
      (error) => {
        console.error('Erreur lors de la récupération du panier:', error);
        this.isLoading = false;
      }
    );
  }

  // Fonction pour calculer le total du panier
  getTotal(): number {
    return this.cartItems.reduce((total, item) => total + (item.prix * item.quantite), 0);
  }
  
  passerComm() {
    const nom = this.form.lname;
    const region = this.form.region;
    const adresse = this.form.houseadd; // FIXED: should be houseadd, not region
    const tel = this.form.phone;
  
    var form2 = { nom, region, adresse, tel };
  
    // Update client info first
    this.http.put('http://localhost:5000/Client/updateClientInfo', form2, { withCredentials: true }).subscribe({
      next: () => {
        // If client info is updated successfully, proceed with order
        this.http.post('http://localhost:5000/Cart/commander', {}, { withCredentials: true }).subscribe({
          next: () => {
            alert('Commande passée avec succès');
          },
          error: (error) => {
            alert('Erreur lors du passage de la commande: ' + error.error?.error || error.message);
          }
        });
      },
      error: (error) => {
        alert('Erreur lors de la mise à jour des informations du client: ' + error.error?.error || error.message);
      }
    });
    this.router.navigate(['/home']);
  }
  
}