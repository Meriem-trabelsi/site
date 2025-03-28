import { Component } from '@angular/core';
import { AdsCarouselComponent } from "../../components/ads-carousel/ads-carousel.component";
import { CategoryCardComponent } from '../../components/category-card/category-card.component';
import { FeaturedComponentsComponent } from "../../components/featured-components/featured-components.component";
import { HeaderComponent } from "../../components/header/header.component";
import { FooterComponent } from "../../components/footer/footer.component";
@Component({
  selector: 'app-home',
  imports: [AdsCarouselComponent, CategoryCardComponent, FeaturedComponentsComponent, HeaderComponent, FooterComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  
}
