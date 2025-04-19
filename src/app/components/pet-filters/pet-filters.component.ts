import { Component, EventEmitter, Output } from '@angular/core';

export interface PetFilters {
  location: string;
  types: string[];
  ages: string[];
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
  
  filters: { location: string, types: string[], ages: string[] } = {
    location: '',
    types: [],
    ages: []
  };
  selectedLocation: string = '';
  selectedTypes: string[] = [];
  selectedAges: string[] = [];


  onLocationChange(event: any) {
    this.selectedLocation = event.target.value;
    this.emitFilters();
  }

  onTypeChange(type: string, event: any) {
    if (type === 'all-pets') {
      // If "All Pets" is checked, we reset the types and include all pet types
      if (event.target.checked) {
        this.filters.types = ['dog', 'cat', 'other-pets'];  // All pet types
      } else {
        this.filters.types = [];  // If unchecked, clear all types
      }
    } else {
      // Handle other types (dog, cat, etc.)
      if (event.target.checked) {
        // Add the selected type
        this.filters.types.push(type);
      } else {
        // Remove the unselected type
        const index = this.filters.types.indexOf(type);
        if (index !== -1) {
          this.filters.types.splice(index, 1);
        }
      }
  
      // If "All Pets" is unchecked, make sure we don't add any conflicting types
      if (this.filters.types.length === 0) {
        // If no other types are selected, we should uncheck "All Pets"
        const allPetsCheckbox = document.getElementById('all-pets') as HTMLInputElement;
        if (allPetsCheckbox) {
          allPetsCheckbox.checked = false;
        }
      }
    }
  
    console.log('Selected types:', this.filters.types);
  }
  

onAgeChange(age: string, event: Event) {
  const checked = (event.target as HTMLInputElement).checked;
  this.updateSelectionArray(this.selectedAges, age, checked);
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
    this.selectedAges = [];
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
