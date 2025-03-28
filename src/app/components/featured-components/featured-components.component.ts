import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductCardComponent } from '../product-card/product-card.component';

@Component({
  selector: 'app-featured-components',
  standalone: true,
  imports: [ProductCardComponent, CommonModule],
  templateUrl: './featured-components.component.html',
  styleUrl: './featured-components.component.css'
})
export class FeaturedComponentsComponent {
  products = [
    { title: "4K Smart Monitor Vantablack Expo GPS-5377536", category: "Gadgets", price: "1,150", image: "assets/images/monitor.jpg", isNew: true },
    { title: "SX-2357 Closed-Back Wireless Headphones", category: "Gadgets", price: "630", image: "assets/images/headphones.jpg" },
    { title: "BX-2357 Closed-Back Wireless Headphones", category: "Gadgets", price: "700", image: "assets/images/headphones2.jpg" },
    { title: "Fixed-Wing Hybrid VTOL Surveillance Drone", category: "Gadgets", price: "1,100", oldPrice: "1,450", image: "assets/images/drone.jpg" },
    { title: "Business Inkjet All In One Printer 752-DLW-888", category: "Gadgets", price: "750", image: "assets/images/printer.jpg" },
    { title: "Led 4K Smart TV Vantablack Expo GSM-8573643", category: "Gadgets", price: "990", image: "assets/images/tv.jpg" },
    { title: "Electric Scooter B&W TIP9521XM Prisma XT Series", category: "Gadgets", price: "450", image: "assets/images/scooter.jpg" },
    { title: "Optical Mouse Pro XS-85477PQT Carbon Black", category: "Gadgets", price: "120", image: "assets/images/mouse.jpg" }
  ];
}
