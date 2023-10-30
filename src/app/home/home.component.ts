import { Component } from '@angular/core';
import { ErrorStateMatcher } from '@angular/material/core';
import {
  FormControl,
  FormGroupDirective,
  NgForm,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AppComponent } from '../app.component';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { catchError } from "rxjs/operators";
import { Router } from "@angular/router";
import { throwError } from 'rxjs';
import { LoginComponent } from '../login/login.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  
constructor(private _snackBar: MatSnackBar, private url: AppComponent, private router: Router,private http: HttpClient) { }

ngOnit(){
  this.validateSession()
  this.prueba()
}

  //vars
  dataUser:any ={}
  path = this.url.url

prueba(){
  console.log("test");
  
}

validateSession(){
  console.log("entro en validar sesion");
  console.log(this.dataUser);
  
  this.dataUser =  localStorage.getItem("session")
  if(this.dataUser != null){
    this.dataUser = JSON.parse(this.dataUser)
    console.log(this.dataUser);
    
  }else{
    console.log("no entro");
    
  }
}  

dataUserService(){

} 

dataUserRequest(){

}

dataUserResponse(){

}


}
