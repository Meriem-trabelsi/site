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
  /*products = [
    {
      title: "3D™ Wireless Headset",
      category: "Electronics",
      price: "$400",
      oldPrice: "$500",
      image: "assets/images/headset.png",
      isNew: true
    },
    {
      title: "PS2 DualShock 2 Wireless Controller",
      category: "Gaming",
      price: "$29.99",
      oldPrice: "$49.99",
      image: "assets/images/controller.png",
      isNew: false
    },
    {
      title: "Wired Keyboard & Mouse Combo Pack",
      category: "Accessories",
      price: "$32.99",
      oldPrice: "$55.99",
      image: "assets/images/keyboard.png",
      isNew: false
    },
    {
      title: "3D™ Wireless Headset",
      category: "Electronics",
      price: "$400",
      oldPrice: "$500",
      image: "assets/images/headset.png",
      isNew: true
    },
    {
      title: "PS2 DualShock 2 Wireless Controller",
      category: "Gaming",
      price: "$29.99",
      oldPrice: "$49.99",
      image: "assets/images/controller.png",
      isNew: false
    },
    {
      title: "Wired Keyboard & Mouse Combo Pack",
      category: "Accessories",
      price: "$32.99",
      oldPrice: "$55.99",
      image: "assets/images/keyboard.png",
      isNew: false
    },
    {
      title: "3D™ Wireless Headset",
      category: "Electronics",
      price: "$400",
      oldPrice: "$500",
      image: "assets/images/headset.png",
      isNew: true
    },
    {
      title: "PS2 DualShock 2 Wireless Controller",
      category: "Gaming",
      price: "$29.99",
      oldPrice: "$49.99",
      image: "assets/images/controller.png",
      isNew: false
    },
    {
      title: "Wired Keyboard & Mouse Combo Pack",
      category: "Accessories",
      price: "$32.99",
      oldPrice: "$55.99",
      image: "assets/images/keyboard.png",
      isNew: false
    },
    {
      title: "3D™ Wireless Headset",
      category: "Electronics",
      price: "$400",
      oldPrice: "$500",
      image: "assets/images/headset.png",
      isNew: true
    },
    {
      title: "PS2 DualShock 2 Wireless Controller",
      category: "Gaming",
      price: "$29.99",
      oldPrice: "$49.99",
      image: "assets/images/controller.png",
      isNew: false
    },
    {
      title: "Wired Keyboard & Mouse Combo Pack",
      category: "Accessories",
      price: "$32.99",
      oldPrice: "$55.99",
      image: "assets/images/keyboard.png",
      isNew: false
    }
  ];*/
  products: any[] = [];
  currentCategoryId: number | null = null;
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
    this.productService.getProducts(categoryID).subscribe(
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
}
