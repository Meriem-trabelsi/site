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

  @Input() produitID!: number; // input from parent, ensure it's passed
  selectedQuantity: number = 1;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private http: HttpClient
  ) {}

  /*ngOnInit(): void {
    const productId = Number(this.route.snapshot.paramMap.get('id'));
    this.productService.getProductById(productId).subscribe(
      (data) => (this.product = data),
      (error) => console.error('Error fetching product:', error)
    );
  }*/

    ngOnInit(): void {
      const productId = Number(this.route.snapshot.paramMap.get('id'));
    
      this.productService.getProductById(productId).subscribe(
        (data) => this.product = data,
        (error) => console.error('Error fetching product:', error)
      );
    
      this.productService.getProductSpecifications(productId).subscribe(
        (data) => this.specifications = data,
        (error) => console.error('Error fetching specifications:', error)
      );
    } 

    addToCart() {
      const token = localStorage.getItem('token'); // or use cookies if you store it there

      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      });
  
      this.http.post('http://localhost:5000/cart/add', {
        produitID: this.produitID,
        quantite: this.selectedQuantity,
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        withCredentials: true  // This should be outside the headers object
      }).subscribe({
        next: (res) => {
          console.log('Produit ajouté au panier:', res);
          alert('Produit ajouté au panier !');
        },
        error: (err) => {
          console.error('Erreur:', err);
          alert('Erreur lors de l\'ajout au panier');
        }
      });
    }
   
}
