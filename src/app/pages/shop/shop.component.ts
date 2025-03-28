import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShopTitleComponent } from "../../components/shop-title/shop-title.component";
import { FilterComponent } from "../../components/filter/filter.component";
import { ShopGridComponent } from "../../components/shop-grid/shop-grid.component";
import { HeaderComponent } from "../../components/header/header.component";
import { FooterComponent } from "../../components/footer/footer.component";

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [CommonModule, ShopTitleComponent, FilterComponent, ShopGridComponent, HeaderComponent, FooterComponent],
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.css']
})
export class ShopComponent { }
