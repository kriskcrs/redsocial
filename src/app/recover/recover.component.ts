import { Component } from '@angular/core';
import {
  FormControl,
  Validators
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AppComponent } from '../app.component';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { catchError } from "rxjs/operators";
import { Router } from "@angular/router";
import { throwError } from 'rxjs';


@Component({
  selector: 'app-recover',
  templateUrl: './recover.component.html',
  styleUrls: ['./recover.component.css']
})
export class RecoverComponent {
  constructor(private _snackBar: MatSnackBar, private url: AppComponent, private router: Router, private http: HttpClient) { }


  //vars
  email = new FormControl('', [Validators.required, Validators.email]);
  password = new FormControl('', [Validators.required]);
  hide = true;
  path = this.url.url
  dataUser: any = {}
  credenciales: any = {}
  messageOK:string = ""
  alertaOK:boolean = false
  spinner:boolean = false
  form:boolean = true

  //userValidation
  getErrorMessage() {
    if (this.email.hasError('required')) {
      return 'Debes ingresar un valor';
    }
    return this.email.hasError('email') ? 'Tu correo electronico no es valido' : '';
  }

  // Evitar el envío del formulario al presionar "Enter" en el campo de contraseña
  onPasswordKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      event.preventDefault();
      //this.login();
    }
  }

  //message
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action);
  }

  //service recover
  recover() {
    this.form = false
    this.spinner = true

    if (this.email.valid) {
      this.credenciales = {
        idUser: this.email.value,
      }
      this.recoverRequest(this.credenciales).subscribe((response: any) => this.recoverResponse(response))
    }
  }
  recoverRequest(data: any) {
    return this.http.post<any>(this.path + "/recover", data).pipe(
      catchError((error: any) => {
        if (error.status === 400) {
          // error para parametros invalidos 
          this.openSnackBar(error.error.message, "Aceptar");
        } else {
          // error de conexion o un 500
          this.openSnackBar("No existe conexión con el servidor", "Aceptar");
        }
        return  throwError(error);
      })
    )
  }
  recoverResponse(response: any) {
    this.messageOK = response.message
    this.spinner = false
    this.alertaOK = true
  
    setTimeout(()=>{
      this.router.navigateByUrl("/login")  
    }, 3000);
    
    
  }

}
