import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { ProfileComponent } from './profile/profile.component';


const routes: Routes = [
{ path:'login', component: LoginComponent},
{ path:'home', component: HomeComponent},
{ path:'profile', component: ProfileComponent},
{ path: '', redirectTo: "/home", pathMatch: "full"},
{ path: '**', redirectTo: 'not-found'},


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
