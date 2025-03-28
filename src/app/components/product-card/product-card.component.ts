import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-product-card',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.css'
})
export class ProductCardComponent {
  @Input() title!: string;
  @Input() category!: string;
  @Input() price!: string;
  @Input() oldPrice?: string;
  @Input() image!: string;
  @Input() isNew?: boolean;
}
