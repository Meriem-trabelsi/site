import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-ads-carousel',
  standalone: true, // Ensures it's a standalone component
  imports: [CommonModule],
  templateUrl: './ads-carousel.component.html',
  styleUrl: './ads-carousel.component.css'
})
export class AdsCarouselComponent {
  slides = [
    {
      image: 'assets/images/promo1.jpg',
      title: 'Offre Spéciale PC Gamer',
      description: 'Profitez de -20% sur notre sélection de PC Gamer.',
      button: 'Voir l\'offre',
      link: '/pc-gamer'
    },
    {
      image: 'assets/images/promo2.jpg',
      title: 'Promo Smartphone',
      description: 'Réductions incroyables sur les derniers smartphones.',
      button: 'Acheter maintenant',
      link: '/smartphones'
    },
    {
      image: 'assets/images/promo3.jpg',
      title: 'Téléviseurs 4K en promo',
      description: 'Des prix imbattables sur les TV 4K et OLED.',
      button: 'Découvrir',
      link: '/tvs'
    }
  ];
}
