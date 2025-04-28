import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductCardComponent } from '../product-card/product-card.component';
import { Product, ProductService } from '../../services/product.service';


@Component({
  selector: 'app-featured-components',
  standalone: true,
  imports: [ProductCardComponent, CommonModule],
  templateUrl: './featured-components.component.html',
  styleUrl: './featured-components.component.css'
})


export class FeaturedComponentsComponent {

  products: any[] = [];

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.productService.getProducts().subscribe(
      (data) => {
        this.products = data;
      },
      (error) => {
        console.error('Error fetching products:', error);
      }
    );
  }
}
