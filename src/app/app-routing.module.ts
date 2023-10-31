import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { ProfileComponent } from './profile/profile.component';
import { PublicationComponent } from './publication/publication.component';

const routes: Routes = [
{ path:'login', component: LoginComponent},
{ path:'home', component: HomeComponent},
{ path:'profile', component: ProfileComponent},
{ path:'publication', component: PublicationComponent},
{ path: '', redirectTo: "/home", pathMatch: "full"},
{ path: '', redirectTo: "/login", pathMatch: "full"},
{ path: '**', redirectTo: 'not-found'},


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
