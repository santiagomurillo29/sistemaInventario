import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './Components/login/login.component';
import { LayoutComponent } from './Components/layout/layout.component';
import { isLoggedIncGuard } from './auth/is-logged-inc.guard';


export const routes: Routes = [
    {
        path: '',
        component: LoginComponent,
        pathMatch: 'full'
    },
    {
        path: 'login',
        component: LoginComponent,
        pathMatch: 'full'
    },
    {
        path: 'pages',
        loadChildren: () => import('./Components/layout/layout.module').then(m => m.LayoutModule),
        canMatch: [isLoggedIncGuard]
    },
    {
        path: '**',
        redirectTo: 'login',
        pathMatch: "full"
    }
];
