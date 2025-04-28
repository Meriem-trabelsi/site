import { Component, EventEmitter, Output } from '@angular/core';

export interface PetFilters {
  location: string;
  types: string[];
  ages: number;
}

@Component({
  selector: 'app-pet-filters',
  standalone: true,
  imports: [],
  templateUrl: './pet-filters.component.html',
  styleUrl: './pet-filters.component.css'
})
export class PetFiltersComponent {
  @Output() filtersChanged = new EventEmitter<PetFilters>();
  
onFilterChange() {
  this.filtersChanged.emit(this.filters);
}
  
  filters: { location: string, types: string[], ages: number } = {
    location: '',
    types: [],
    ages: 0
  };
  selectedLocation: string = '';
  selectedTypes: string[] = [];
  selectedAges: number = 25;


  onLocationChange(event: any) {
    this.selectedLocation = event.target.value;
    this.emitFilters();
  }

  onTypeChange(type: string, event: any): void {
    if (type === 'all-pets') {
      if (event.target.checked) {
        // Check all pet types when "All Pets" is checked
        this.selectedTypes = ['dog', 'cat', 'bird', 'other-pets'];
      } else {
        // Uncheck all pet types when "All Pets" is unchecked
        this.selectedTypes = [];
      }
    } else {
      // For other pet types (Dog, Cat, Other Pets), add/remove them from the selectedTypes array
      if (event.target.checked) {
        this.selectedTypes.push(type);
      } else {
        this.selectedTypes = this.selectedTypes.filter(t => t !== type);
      }
  
      // If a specific type is unchecked, ensure "All Pets" is unchecked as well
      if (this.selectedTypes.length < 3) {
        const allPetsIndex = this.selectedTypes.indexOf('all-pets');
        if (allPetsIndex !== -1) {
          this.selectedTypes.splice(allPetsIndex, 1);
        }
      }
    }
  
    this.emitFilters();
  }
  

  onAgeChange(event: any) {
    this.selectedAges = +event.target.value;
    this.emitFilters();
  }


  updateSelectionArray(array: string[], value: string, add: boolean) {
    const index = array.indexOf(value);
    if (add && index === -1) array.push(value);
    else if (!add && index !== -1) array.splice(index, 1);
  }

  resetFilters() {
    this.selectedLocation = '';
    this.selectedTypes = [];
    this.selectedAges = 25;
    this.emitFilters();
  }

  emitFilters() {
    this.filtersChanged.emit({
      location: this.selectedLocation,
      types: this.selectedTypes,
      ages: this.selectedAges
    });
  }
  

}
