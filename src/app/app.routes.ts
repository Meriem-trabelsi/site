import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { CartComponent } from './cart/cart.component';
import { CommanderComponent } from './commander/commander.component';
import { RecupererMdpComponent } from './recuperer-mdp/recuperer-mdp.component';
import { HomeComponent } from './pages/home/home.component';
import { ShopComponent } from './pages/shop/shop.component';
import { ProductDetailsComponent } from './pages/product-details/product-details.component';
import { SimpleAuthGuard } from './auth-guard';  // Import the SimpleAuthGuard

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  { path: 'login', component: LoginComponent },
  {
    path: 'cart',
    component: CartComponent,
    canActivate: [SimpleAuthGuard],  // Protect the cart route with the simple guard
  },
  {
    path: 'commander',
    component: CommanderComponent,
    canActivate: [SimpleAuthGuard],  // Protect the commander route with the simple guard
  },
  { path: 'recuperer-mdp', component: RecupererMdpComponent },
  { path: 'home', component: HomeComponent },
  { path: 'shop', component: ShopComponent },
  { path: 'product', component: ProductDetailsComponent },
];
