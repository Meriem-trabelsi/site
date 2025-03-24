import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { CartComponent } from './cart/cart.component';
import { CommanderComponent } from './commander/commander.component';
import { RecupererMdpComponent } from './recuperer-mdp/recuperer-mdp.component';
import { Cart1Component } from './cart-1/cart-1.component';


export const routes: Routes = [
    {
        path:'',
        redirectTo:'login',
        pathMatch:'full',
    },
    
    {path:'login',component: LoginComponent},

    {path:'cart', component:  CartComponent},

    {path:'commander',component:  CommanderComponent},

    {path:'recuperer-mdp',component:  RecupererMdpComponent },

    {path:'cart-1',component:  Cart1Component },


    



    
    
];

