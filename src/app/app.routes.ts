import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { CartComponent } from './cart/cart.component';
import { CommanderComponent } from './commander/commander.component';
import { RecupererMdpComponent } from './recuperer-mdp/recuperer-mdp.component';
import { HomeComponent } from './pages/home/home.component';
import { ShopComponent } from './pages/shop/shop.component';
import { ProductDetailsComponent } from './pages/product-details/product-details.component';
import { SimpleAuthGuard } from './auth-guard';  // Import the SimpleAuthGuard
import { HomeeComponent } from './pages/homee/homee.component';
import { AdoptionComponent } from './adoption/adoption.component';
import { PostAdoptionComponent } from './post-adoption/post-adoption.component';
import { PostLostComponent } from './post-lost/post-lost.component';
import { LostComponent } from './lost/lost.component';

export const routes: Routes = [
  
  {path: '',redirectTo: 'homee',pathMatch: 'full',},
  { path: 'homee', component: HomeeComponent },
  { path: 'login', component: LoginComponent },
  {path: 'cart',component: CartComponent,canActivate: [SimpleAuthGuard],  },
  {path: 'commander',component: CommanderComponent,canActivate: [SimpleAuthGuard],  },
  { path: 'recuperer-mdp', component: RecupererMdpComponent },
  { path: 'home', component: HomeComponent },
  { path: 'shop', component: ShopComponent },
  { path: 'product', component: ProductDetailsComponent },
  { path: 'product/:id', component: ProductDetailsComponent },
  { path: 'adoption', component: AdoptionComponent },
  { path: 'post', component: PostAdoptionComponent },
  { path: 'plost', component: PostLostComponent },
  { path: 'lost', component: LostComponent },
];
