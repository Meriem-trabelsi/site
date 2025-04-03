import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

interface CartItem {
  produitID: number;
  nom: string;
  quantite: number;
  prix: number;
}

interface CartResponse {
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

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchCart(); // Récupération du panier au chargement du composant
  }

  // Fonction pour récupérer le panier depuis le serveur
  fetchCart(): void {
    this.isLoading = true;
    this.http.get<CartResponse>('http://localhost:5000/Cart/fetch', { withCredentials: true }).subscribe(
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

  // Fonction pour valider et envoyer la commande
  // Function to pass the order
  passerCommande(): void {
    // Vérification des champs obligatoires
    if (!this.form.lname || !this.form.region || !this.form.houseadd || !this.form.phone) {
      alert("Veuillez remplir tous les champs obligatoires !");
      return;
    }
  
    // Vérification si une méthode de paiement est sélectionnée
    if (!this.form.payment) {
      alert("Veuillez choisir une méthode de paiement !");
      return;
    }
  
    // Vérification si le panier est vide
    if (this.cartItems.length === 0) {
      alert("Votre panier est vide !");
      return;
    }
  
    // Continue with order submission
    this.isLoading = true;
    const orderData = {
      client: this.form,
      produits: this.cartItems
    };
    this.http.post('http://localhost:5000/commander', orderData, { withCredentials: true }).subscribe(
      () => {
        alert('Commande validée !');
        this.cartItems = [];  // Vider le panier après la commande
        this.totalPrice = 0;
        this.isLoading = false;
      },
      (error) => {
        console.error('Erreur lors de la validation de la commande:', error);
        alert('Erreur lors de la validation de la commande.');
        this.isLoading = false;
      }
    );
  }
  

  
}
