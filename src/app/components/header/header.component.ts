import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CategoryService } from '../../services/categorie.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
  categories: any[] = [];

  constructor(private categoryService: CategoryService, private router: Router) {}

  ngOnInit(): void {
    this.categoryService.getCategories().subscribe(
      (data) => {
        this.categories = data.slice(0, 7); // Limit to 7 max
      },
      (error) => {
        console.error('Error fetching categories:', error);
      }
    );
  }

  goToCategory(categoryId: number): void {
    this.router.navigate(['/shop'], {
      queryParams: { categoryID: categoryId }
    });
  }
  
  goToPage() {
    this.router.navigate(['/login']);
  }
}