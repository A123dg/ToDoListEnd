import { provideRouter, Routes } from '@angular/router';
import { HomeComponent } from './components/home.component/home.component';
import { LoginComponent } from './components/login/login';
import { Register } from './components/register/register';
import { TasksComponent } from './components/tasks/tasks';

export const routes: Routes = [
    {
        path:'login', component: LoginComponent
    },
    {path:'tasks', component: TasksComponent},
    {path:'home', component: HomeComponent},
    {path:'login', redirectTo:'/login', pathMatch: 'full'},
    {path:'', redirectTo:'/home',pathMatch:'full'},
    {path:'register', component: Register}
];
export const appRouter = provideRouter(routes);