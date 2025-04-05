import { Component, Input, OnInit } from '@angular/core';
import { HeaderComponent } from "../../components/header/header.component";
import { FooterComponent } from "../../components/footer/footer.component";
import { Product, ProductService } from '../../services/product.service';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, CommonModule, FormsModule],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.css'
})
export class ProductDetailsComponent implements OnInit {
  product!: Product;
  specifications: any[] = [];
  produitID!: number;
  selectedQuantity: number = 1;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private http: HttpClient
  ) {}

    ngOnInit(): void {
      this.produitID = Number(this.route.snapshot.paramMap.get('id'));

      this.productService.getProductById(this.produitID).subscribe(
        (data) => this.product = data,
        (error) => console.error('Error fetching product:', error)
      );
    
      this.productService.getProductSpecifications(this.produitID).subscribe(
        (data) => this.specifications = data,
        (error) => console.error('Error fetching specifications:', error)
      );
    } 

    // Update quantity via API
    addToCart(): void {
      this.http.post(
        `http://localhost:5000/Cart/add`,
        { produitID: this.produitID, quantite: this.selectedQuantity },
        { withCredentials: true }
      ).subscribe(
        () => {
          alert('Produit ajouté au panier !');
        },
        (error) => {
          console.error('Error updating quantity:', error);
          if (error.status === 400) {
            alert("La quantité demandée dépasse le stock disponible.");
          } else if (error.status === 401) {
              alert("Veuillez vous authentifier");} 
            else {
            alert("Une erreur est survenue lors de la mise à jour de la quantité.");
          }
        }
      );
    }
  }