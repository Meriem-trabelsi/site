import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { Login2Component } from './login2/login2.component';

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
        path:'login2',
        component: Login2Component
    },

    
];

