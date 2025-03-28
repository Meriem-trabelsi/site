import { Component } from '@angular/core';
import { ProductCardComponent } from '../product-card/product-card.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-shop-grid',
  imports: [ProductCardComponent, CommonModule, FormsModule],
  standalone: true,
  templateUrl: './shop-grid.component.html',
  styleUrl: './shop-grid.component.css'
})
export class ShopGridComponent {
  products = [
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
  ];
}
