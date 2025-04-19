import { Component } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component'; // Importation du composant d'en-tête
import { FooterComponent } from '../../components/footer/footer.component'; // Importation du composant de pied de page
import { PetCardComponent } from '../../components/petcard/petcard.component';
import { PethomeComponent } from '../../components/pethome/pethome.component';
import { RouterModule } from '@angular/router';
import { FeaturedComponentsComponent } from '../../components/featured-components/featured-components.component';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { Product, ProductService } from '../../services/product.service';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-homee',
  imports: [HeaderComponent, FooterComponent,PetCardComponent,PethomeComponent, RouterModule,FeaturedComponentsComponent,
    ProductCardComponent, CommonModule],
  templateUrl: './homee.component.html',
  styleUrl: './homee.component.css'
  
})
export class HomeeComponent {
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
