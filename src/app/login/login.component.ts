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
import { of } from 'rxjs';


/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  constructor(private _snackBar: MatSnackBar, private url: AppComponent, private http: HttpClient) { }

  //vars
  email = new FormControl('', [Validators.required, Validators.email]);
  password = new FormControl('', [Validators.required]);
  hide = true;


  //userValidation
  getErrorMessage() {
    if (this.email.hasError('required')) {
      return 'Debes ingresar un valor';
    }
    return this.email.hasError('email') ? 'Tu correo electronico no es valido' : '';
  }


  //message
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action);
  }

  //service login
  login() {
    if (this.email.valid) {
      const credenciales = {
        idUser: this.email.value,
        password: this.password.value
      }
      this.loginRequest(credenciales).subscribe(
        (response: any) => this.loginResponse(response)
      )
    } else {
      this.openSnackBar("Credenciales invalidas", "Aceptar")
    }
  }

  loginRequest(data: any) {
    console.log(data);
    return this.http.post<any>(this.url + "/login", data).pipe(
      catchError((e) => {
        this.handleError(e);
        return of(null)
      })
    )
  }
  loginResponse(response: any) {
    console.log("error del login " + response);
  }


  //control de respuestas http
  handleError(error: any) {
    if (error.status === 400) {
      this.openSnackBar("Valores no validos", "Aceptar");
    } else if (error.status === 404) {
      // Manejar el código 204 (u otros códigos de error según sea necesario)
      this.openSnackBar("Credenciales invalidas", "Aceptar");
    } else {
      // Otro manejo de errores
      console.error("Error inesperado:", error);
      this.openSnackBar("Error inesperado", "Aceptar");
    }
  }




}
