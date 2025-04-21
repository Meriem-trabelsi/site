import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component'; // Importation du composant d'en-tête
import { FooterComponent } from '../../components/footer/footer.component'; // Importation du composant de pied de page
import { PetCardComponent } from '../../components/petcard/petcard.component';
import { PethomeComponent } from '../../components/pethome/pethome.component';
import { RouterModule } from '@angular/router';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { Product, ProductService } from '../../services/product.service';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-homee',
  imports: [HeaderComponent, FooterComponent,PetCardComponent,PethomeComponent, RouterModule,
    ProductCardComponent, CommonModule],
  templateUrl: './homee.component.html',
  styleUrl: './homee.component.css'
  
})
export class HomeeComponent implements OnInit, AfterViewInit, OnDestroy {
  products: any[] = [];
  @ViewChild('carousel', { static: false }) carouselRef!: ElementRef;

  private autoScrollInterval: any;
  private scrollDirection: number = 1; // 1 = droite, -1 = gauche
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

  ngAfterViewInit(): void {
    this.startAutoScroll();
  }

  scrollCarousel(direction: number): void {
    const carousel = this.carouselRef.nativeElement;
    const scrollAmount = 320;
    carousel.scrollBy({ left: direction * scrollAmount, behavior: 'smooth' });
  }

  startAutoScroll(): void {
    const carousel = this.carouselRef.nativeElement;
  
    this.autoScrollInterval = setInterval(() => {
      const scrollAmount = 320; // combien de pixels avancer à chaque fois
      const maxScrollLeft = carousel.scrollWidth - carousel.clientWidth;
  
      // Si on atteint la fin, repartir au début doucement
      if (carousel.scrollLeft + scrollAmount >= maxScrollLeft) {
        carousel.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        carousel.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }
    }, 5000); // toutes les 5 secondes
  }
  

  ngOnDestroy(): void {
    clearInterval(this.autoScrollInterval);
  } 


}
