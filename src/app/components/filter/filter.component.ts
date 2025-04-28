import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Category, CategoryService } from '../../services/categorie.service';

@Component({
  selector: 'app-filter',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './filter.component.html',
  styleUrl: './filter.component.css'
})
export class FilterComponent implements OnInit {
  selectedPrice: number = 50; // Valeur initiale du prix (peut être modifiée selon les besoins)
  minPrice: number = 0; // Prix minimum
  maxPrice: number = 100; // Prix maximum
  categories: any[] = [];
  selectedCategoryId: number | null = null;

  @Output() categoryChanged = new EventEmitter<number | null>();
  @Output() priceChanged = new EventEmitter<number>();

  constructor(private categoryService: CategoryService) {}
  
  ngOnInit(): void {
      this.categoryService.getCategories().subscribe(
        (data) => {
          this.categories = data;
        },
        (error) => {
          console.error('Error fetching categories:', error);
        }
      );
      
  }
    
  onCategoryChange(categoryID: number | null): void {
      this.selectedCategoryId = categoryID !== null ? +categoryID : null;
      this.categoryChanged.emit(this.selectedCategoryId);
  }

  // Fonction pour mettre à jour la valeur du prix
  onPriceChange(event: any) {
    this.selectedPrice = +event.target.value;
    this.priceChanged.emit(this.selectedPrice);
  }

  resetFilters() {
    this.selectedCategoryId = null;
    this.categoryChanged.emit(null);
    this.selectedPrice = 50;
    this.priceChanged.emit(this.selectedPrice);
  }
}