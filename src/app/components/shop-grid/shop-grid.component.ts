
import { Component, OnInit } from '@angular/core'; 
import { ProductCardComponent } from '../product-card/product-card.component'; 
import { CommonModule } from '@angular/common'; 
import { FormsModule } from '@angular/forms'; 
import { Product, ProductService } from '../../services/product.service'; 
import { FilterComponent } from "../filter/filter.component"; 
import { ActivatedRoute } from '@angular/router'; 

// Déclaration du composant
@Component({
  selector: 'app-shop-grid', 
  imports: [ProductCardComponent, CommonModule, FormsModule, FilterComponent], 
  standalone: true, 
  templateUrl: './shop-grid.component.html', 
  styleUrl: './shop-grid.component.css' 
})
export class ShopGridComponent implements OnInit {
  // Tableau pour stocker les produits affichés
  products: any[] = [];

  // ID de la catégorie sélectionnée (ou null si aucune)
  currentCategoryId: number | null = null;

  // Prix maximal sélectionné pour le filtre
  selectedPrice: number = 0;

  // Injection des services nécessaires via le constructeur
  constructor(
    private productService: ProductService, // Service pour récupérer les produits depuis l'API
    private route: ActivatedRoute // Permet d'accéder aux paramètres de la route (ex: categoryID)
  ) {}

  // Fonction appelée à l'initialisation du composant
  ngOnInit(): void {
    // On s'abonne aux paramètres de la route pour détecter les changements (comme categoryID)
    this.route.queryParams.subscribe((params) => {
      const categoryIdParam = params['categoryID']; // Récupère le paramètre de catégorie
      this.currentCategoryId = categoryIdParam ? +categoryIdParam : null; // Convertit en nombre ou null
      this.fetchProducts(); // Récupère les produits filtrés
    });
  }

  // Fonction pour récupérer les produits depuis le service
  fetchProducts(): void {
    // Si une catégorie est sélectionnée, on l'inclut dans la requête, sinon undefined
    const categoryID = this.currentCategoryId !== null ? this.currentCategoryId : undefined;

    // Si un prix est sélectionné (> 0), on l'utilise comme filtre
    const maxPrice = this.selectedPrice > 0 ? this.selectedPrice : undefined;

    // Appel au service pour récupérer les produits filtrés
    this.productService.getProducts(categoryID, maxPrice).subscribe(
      (data) => {
        // Si la requête réussit, on stocke les produits reçus
        this.products = data;
      },
      (error) => {
        // En cas d'erreur, on l'affiche dans la console
        console.error('Erreur lors de la récupération des produits :', error);
      }
    );
  }

  // Méthode appelée quand l'utilisateur change la catégorie dans le filtre
  onCategoryChange(categoryID: number | null): void {
    this.currentCategoryId = categoryID; // Met à jour la catégorie sélectionnée
    this.fetchProducts(); // Récupère les produits filtrés
  }

  // Méthode appelée quand l'utilisateur change le prix maximal dans le filtre
  onPriceChange(price: number) {
    this.selectedPrice = price; // Met à jour le prix sélectionné
    this.fetchProducts(); // Récupère les produits filtrés
  }
}
