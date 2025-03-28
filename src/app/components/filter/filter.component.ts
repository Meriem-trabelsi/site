import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-filter',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './filter.component.html',
  styleUrl: './filter.component.css'
})
export class FilterComponent {
  categories = ['Electronics', 'NFT', 'Jewellery', 'Fashion', 'Furniture'];
  selectedCategory: string = '';

  genders = ['Men', 'Women', 'Unisex'];
  selectedGender: string = '';

  colors = ['#FF0000', '#000000', '#CCCCCC', '#0000FF', '#FFFF00']; // Red, Black, Gray, Blue, Yellow
  selectedColors: string[] = [];

  sizes = ['4XL', '3XL', 'XXL', 'XL', 'L', 'M', 'S', 'XS'];
  selectedSizes: string[] = [];

  prices = [50, 100, 200, 300, 400, 500];
  selectedPrices: number[] = [];

  toggleColor(color: string) {
    if (this.selectedColors.includes(color)) {
      this.selectedColors = this.selectedColors.filter(c => c !== color);
    } else {
      this.selectedColors.push(color);
    }
  }

  toggleSize(size: string) {
    if (this.selectedSizes.includes(size)) {
      this.selectedSizes = this.selectedSizes.filter(s => s !== size);
    } else {
      this.selectedSizes.push(size);
    }
  }

  togglePrice(price: number) {
    if (this.selectedPrices.includes(price)) {
      this.selectedPrices = this.selectedPrices.filter(p => p !== price);
    } else {
      this.selectedPrices.push(price);
    }
  }

  resetFilters() {
    this.selectedCategory = '';
    this.selectedGender = '';
    this.selectedColors = [];
    this.selectedSizes = [];
    this.selectedPrices = [];
  }
}
