import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
<<<<<<< HEAD
import { ProfileComponent } from './profile/profile.component';

=======
>>>>>>> master

const routes: Routes = [
{ path:'login', component: LoginComponent},
{ path:'home', component: HomeComponent},
<<<<<<< HEAD
{ path:'profile', component: ProfileComponent},
{ path: '', redirectTo: "/home", pathMatch: "full"},
=======
{ path: '', redirectTo: "/login", pathMatch: "full"},
>>>>>>> master
{ path: '**', redirectTo: 'not-found'},


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
