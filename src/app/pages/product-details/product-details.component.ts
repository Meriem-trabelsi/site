import { Component, Input, OnInit } from '@angular/core'; // Importation des décorateurs nécessaires pour le composant
import { HeaderComponent } from "../../components/header/header.component"; // Importation du composant Header
import { FooterComponent } from "../../components/footer/footer.component"; // Importation du composant Footer
import { Product, ProductService } from '../../services/product.service'; // Importation des types et services pour gérer les produits
import { ActivatedRoute } from '@angular/router'; // Importation du service ActivatedRoute pour récupérer les paramètres de l'URL
import { CommonModule } from '@angular/common'; // Importation de CommonModule pour utiliser des fonctionnalités Angular communes
import { HttpClient, HttpHeaders } from '@angular/common/http'; // Importation d'HttpClient pour effectuer des requêtes HTTP
import { FormsModule } from '@angular/forms'; // Importation de FormsModule pour gérer les formulaires

@Component({
  selector: 'app-product-details', // Définition du sélecteur pour ce composant
  standalone: true, // Le composant est autonome, il peut être utilisé seul sans module parent
  imports: [HeaderComponent, FooterComponent, CommonModule, FormsModule], // Déclaration des composants et modules importés dans ce composant
  templateUrl: './product-details.component.html', // Spécification du fichier HTML associé
  styleUrl: './product-details.component.css' // Spécification du fichier CSS associé
})
export class ProductDetailsComponent implements OnInit { // Déclaration du composant ProductDetailsComponent qui implémente OnInit
  product!: Product; // Déclaration de la variable pour stocker le produit récupéré
  specifications: any[] = []; // Déclaration de la variable pour stocker les spécifications du produit
  produitID!: number; // Déclaration de la variable pour stocker l'ID du produit
  selectedQuantity: number = 1; // Initialisation de la quantité sélectionnée à 1

  constructor(
    private route: ActivatedRoute, // Injection du service ActivatedRoute pour accéder aux paramètres de l'URL
    private productService: ProductService, // Injection du service ProductService pour gérer les produits
    private http: HttpClient // Injection du service HttpClient pour effectuer des requêtes HTTP
  ) {}

  ngOnInit(): void { // Méthode appelée lors de l'initialisation du composant
    this.produitID = Number(this.route.snapshot.paramMap.get('id')); // Récupération de l'ID du produit depuis l'URL

    // Récupération des informations du produit à partir du service ProductService
    this.productService.getProductById(this.produitID).subscribe(
      (data) => this.product = data, // Si la requête réussit, assigner le produit récupéré à la variable 'product'
      (error) => console.error('Error fetching product:', error) // En cas d'erreur, afficher un message dans la console
    );
    
    // Récupération des spécifications du produit à partir du service ProductService
    this.productService.getProductSpecifications(this.produitID).subscribe(
      (data) => this.specifications = data, // Si la requête réussit, assigner les spécifications récupérées à la variable 'specifications'
      (error) => console.error('Error fetching specifications:', error) // En cas d'erreur, afficher un message dans la console
    );
  } 

  // Méthode pour ajouter un produit au panier en envoyant une requête POST
  addToCart(): void {
    this.http.post(
      `http://localhost:5000/Cart/add`, // URL de l'API pour ajouter un produit au panier
      { produitID: this.produitID, quantite: this.selectedQuantity }, // Données envoyées dans la requête (ID du produit et quantité)
      { withCredentials: true } // Indication que les informations d'authentification (cookies, session) doivent être envoyées avec la requête
    ).subscribe(
      () => {
        alert('Produit ajouté au panier !'); // Message de succès si la requête est réussie
      },
      (error) => {
        console.error('Error updating quantity:', error); // Affichage de l'erreur dans la console en cas d'échec
        if (error.status === 400) { // Si l'erreur est due à une quantité incorrecte
          alert("La quantité demandée dépasse le stock disponible."); // Affichage d'un message d'erreur spécifique
        } else if (error.status === 401) { // Si l'erreur est liée à l'authentification
            alert("Veuillez vous authentifier"); // Demande à l'utilisateur de se connecter
        } else {
          alert("Une erreur est survenue lors de la mise à jour de la quantité."); // Message d'erreur générique pour d'autres problèmes
        }
      }
    );
  }
}
