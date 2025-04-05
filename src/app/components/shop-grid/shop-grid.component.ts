import { Component, OnInit } from '@angular/core';
import { ProductCardComponent } from '../product-card/product-card.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Product, ProductService } from '../../services/product.service';
import { FilterComponent } from "../filter/filter.component";
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-shop-grid',
  imports: [ProductCardComponent, CommonModule, FormsModule, FilterComponent],
  standalone: true,
  templateUrl: './shop-grid.component.html',
  styleUrl: './shop-grid.component.css'
})
export class ShopGridComponent implements OnInit {
  products: any[] = [];
  currentCategoryId: number | null = null;
  selectedPrice: number = 0;
  
  constructor(private productService: ProductService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      const categoryIdParam = params['categoryID'];
      this.currentCategoryId = categoryIdParam ? +categoryIdParam : null;
      this.fetchProducts();
    });
  } 

  fetchProducts(): void {
    const categoryID = this.currentCategoryId !== null ? this.currentCategoryId : undefined;
    const maxPrice = this.selectedPrice > 0 ? this.selectedPrice : undefined; 

    this.productService.getProducts(categoryID, maxPrice).subscribe(
      (data) => {
        this.products = data;
      },
      (error) => {
        console.error('Error fetching products:', error);
      }
    );
  }
onCategoryChange(categoryID: number | null): void {
  this.currentCategoryId = categoryID;
  this.fetchProducts();
}

onPriceChange(price: number) {
  this.selectedPrice = price;
  this.fetchProducts();
}

}
