// Importation des modules nécessaires depuis Angular
import { Component, OnInit } from '@angular/core'; // Pour définir un composant et utiliser l'interface OnInit
import { CommonModule } from '@angular/common'; // Module Angular de base (ngIf, ngFor, etc.)
import { HttpClient } from '@angular/common/http'; // Permet d'effectuer des requêtes HTTP
import { ActivatedRoute } from '@angular/router'; // Pour accéder aux paramètres de l’URL

// Importation des composants personnalisés (en-tête et pied de page)
import { HeaderComponent } from '../components/header/header.component';
import { FooterComponent } from '../components/footer/footer.component';

// Déclaration du composant CartComponent
@Component({
  selector: 'app-cart', // Sélecteur HTML pour utiliser ce composant
  imports: [ // Modules et composants nécessaires au fonctionnement de ce composant
    CommonModule, HeaderComponent, FooterComponent
  ],
  templateUrl: './cart.component.html', // Chemin vers le fichier HTML associé
  styleUrls: ['./cart.component.css'] // Fichier CSS pour le style du composant
})
export class CartComponent implements OnInit {

  // Déclaration d’un tableau pour stocker les articles du panier
  cartItems: any[] = [];

  // Variable pour stocker le prix total du panier
  totalPrice: number = 0;

  // Injection des services HttpClient (pour les requêtes HTTP) et ActivatedRoute (pour accéder aux routes)
  constructor(private http: HttpClient, private route: ActivatedRoute) {}

  // Méthode appelée automatiquement lors de l'initialisation du composant
  ngOnInit(): void {
    // Appel de la méthode pour récupérer les articles du panier
    this.fetchCart();
  }

  // Méthode pour récupérer les données du panier depuis le backend
  fetchCart(): void {
    this.http.get<{produits: any[], total: number}>(
      `http://localhost:5000/Cart/fetch`, // URL de l’API pour récupérer le panier
      { withCredentials: true } // Envoie les cookies pour l’authentification
    ).subscribe(
      (response) => {
        // En cas de succès : on stocke les produits et le prix total
        this.cartItems = response.produits;
        this.totalPrice = response.total;
        console.log(response); // Affiche la réponse dans la console
      },
      (error) => {
        // En cas d’erreur lors de la requête
        console.error('Erreur lors de la récupération du panier :', error);
      }
    );
  }

  // Méthode déclenchée lorsqu'on modifie la quantité d’un article
  onQuantityChange(item: any, event: any): void {
    const newQuantity = parseInt(event.target.value, 10); // Conversion de la valeur saisie en entier

    // Vérification que la valeur saisie est valide
    if (isNaN(newQuantity) || newQuantity < 1) {
      // Si la quantité est invalide, on réinitialise à l’ancienne valeur
      event.target.value = item.quantite;
      return;
    }

    // Mise à jour de la quantité via l'API
    this.updateQuantity(item.produitID, newQuantity);
  }

  // Méthode pour envoyer une requête au backend afin de mettre à jour la quantité
  updateQuantity(produitID: number, quantite: number): void {
    this.http.put(
      `http://localhost:5000/Cart/update`, // URL de mise à jour
      { produitID, quantite }, // Données à envoyer
      { withCredentials: true } // Envoie les cookies
    ).subscribe(
      () => {
        console.log('Quantité mise à jour');
        this.fetchCart(); // Rechargement du panier après modification
      },
      (error) => {
        console.error('Erreur lors de la mise à jour de la quantité :', error);
        
        // Si l’erreur vient d’un problème de stock
        if (error.status === 400 && error.error?.error === "Quantité demandée dépasse le stock disponible.") {
          alert("La quantité demandée dépasse le stock disponible.");
        } else {
          // Autre type d’erreur
          alert("Une erreur est survenue lors de la mise à jour de la quantité.");
        }
      }
    );
  }

  // Méthode pour supprimer un article du panier
  removeFromCart(produitID: number): void {
    this.http.delete(
      `http://localhost:5000/Cart/remove`, // URL de suppression
      {
        body: { produitID }, // ID du produit à supprimer (envoyé dans le corps)
        withCredentials: true // Envoie les cookies
      }
    ).subscribe(
      () => {
        console.log('Article supprimé du panier');
        this.fetchCart(); // Rechargement du panier après suppression
      },
      (error) => {
        console.error('Erreur lors de la suppression de l’article :', error);
      }
    );
  }

}
