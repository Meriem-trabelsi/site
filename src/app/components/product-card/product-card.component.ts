import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Product } from '../../services/product.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-product-card',
  imports: [CommonModule, RouterModule],
  standalone: true,
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.css'
})
export class ProductCardComponent {

  @Input() product!: Product;
}
