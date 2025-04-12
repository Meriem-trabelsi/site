// Importe le décorateur Component d'Angular pour définir un composant
import { Component } from '@angular/core';
// Importe le module commun d'Angular contenant des directives de base comme *ngIf, *ngFor, etc.
import { CommonModule } from '@angular/common';
// Importe un composant personnalisé représentant une carte produit
import { ProductCardComponent } from '../product-card/product-card.component';
// Importe le type Product et le service ProductService pour gérer les produits
import { Product, ProductService } from '../../services/product.service';

// Déclare le composant Angular avec ses métadonnées
@Component({
  // Le sélecteur utilisé pour insérer ce composant dans un template HTML
  selector: 'app-featured-components',
  // Indique que ce composant est autonome (standalone) et peut être utilisé sans module Angular
  standalone: true,
  // Liste des modules ou composants importés par ce composant
  imports: [ProductCardComponent, CommonModule],
  // Chemin vers le fichier HTML contenant la structure du composant
  templateUrl: './featured-components.component.html',
  // Chemin vers le fichier CSS qui contient les styles spécifiques à ce composant
  styleUrl: './featured-components.component.css'
})

// Définition de la classe du composant
export class FeaturedComponentsComponent {
  // Déclaration d’un tableau pour stocker les produits à afficher
  products: any[] = [];

  // Le constructeur injecte le service ProductService pour récupérer les produits
  constructor(private productService: ProductService) {}

  // Méthode appelée automatiquement à l'initialisation du composant
  ngOnInit(): void {
    // Appelle la méthode getProducts du service pour obtenir les produits depuis l'API
    this.productService.getProducts().subscribe(
      (data) => {
        // Si la requête réussit, les données sont stockées dans le tableau products
        this.products = data;
      },
      (error) => {
        // En cas d'erreur, un message est affiché dans la console
        console.error('Error fetching products:', error);
      }
    );
  }
}
