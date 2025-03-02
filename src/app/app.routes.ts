import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { MdpComponent } from './mdp/mdp.component';
import { RecupererPWComponent } from './recuperer-pw/recuperer-pw.component';
import { CartComponent } from './cart/cart.component';

export const routes: Routes = [
    {
        path:'',
        redirectTo:'login',
        pathMatch:'full',
    },

    {
        path:'login',
        component: LoginComponent
    },

    {
        path:'mdp',
        component:  MdpComponent 

    },

    {
        path:'RecupererPW',
        component:  RecupererPWComponent 

    },

    {
        path:'cart',
        component:  CartComponent

    },


    
    
];

