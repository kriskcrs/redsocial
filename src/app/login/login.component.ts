import { Component } from '@angular/core';
import { ErrorStateMatcher } from '@angular/material/core';
import { FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AppComponent } from '../app.component';
import { HttpClient, HttpResponse } from "@angular/common/http";
import { catchError } from "rxjs/operators";
import { Router } from "@angular/router";
import { throwError } from 'rxjs';



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
  constructor(private _snackBar: MatSnackBar, private url: AppComponent, private router: Router, private http: HttpClient) { }
  //procesos al iniciar el componente
  ngOnInit() {
    this.clearSession()
  }

  //vars
  email = new FormControl('', [Validators.required, Validators.email]);
  password = new FormControl('', [Validators.required]);
  hide = true;
  path = this.url.url
  dataUser: any = {}
  credenciales: any = {}

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
      this.login();
    }
  }


  //message
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action);
  }

  //service login
  login() {
    if (this.email.valid) {
      this.credenciales = {
        idUser: this.email.value,
        password: this.password.value
      }
      this.loginRequest(this.credenciales).subscribe((response: any) => this.loginResponse(response))
    }
  }
  loginRequest(data: any) {
    return this.http.post<any>(this.path + "/login", data, { observe: 'response' }).pipe(
      catchError((error: any) => {
        if (error.status === 400) {
          // error para parámetros inválidos          
          this.openSnackBar(error.error.message, "Aceptar");
        } else {
          // error de conexión o un 500
          this.openSnackBar("No existe conexión con el servidor", "Aceptar");
        }
        return throwError("error");
      })
    )
  }

  loginResponse(response: any) {
    if (response.status === 202) {
      localStorage.setItem("data", JSON.stringify(response.body));
      this.router.navigateByUrl("/set-password");
    } else if (response.status === 200) {
      localStorage.setItem("data", JSON.stringify(response.body));
      this.router.navigateByUrl("/home");
    }
    else if (response.status === 204) {
      this.openSnackBar("Usuario o contraseña incorrecta", "Aceptar");
    }
    else {
      console.log(`Recibí un código de estado inesperado: ${response.status}`);
    }

  }




  //revoke
  revokeService() {
    this.RequestRevoke().subscribe(
      (response: any) => this.ResponseRevoke(response)
    )
  }
  RequestRevoke() {
    return this.http.get<any>(this.path + "/revoke/" + this.dataUser.session).pipe(
      catchError(e => e)
    )
  }
  ResponseRevoke(response: any) {
    if (response == null) {
      localStorage.clear()
      this.router.navigateByUrl("/")
    } else {
      localStorage.clear()
      this.router.navigateByUrl("/")
    }
  }

  //limpia localStorage
  clearSession() {
    this.dataUser = localStorage.getItem("data");
    if (this.dataUser != null) {
      this.dataUser = JSON.parse(this.dataUser)
      this.revokeService()
    }
  }


  //para registrar al usuario
  registryService() {
    this.router.navigateByUrl("/createUser")
  }

  //metodo diego
  recoverService() {
    this.router.navigateByUrl("/recover")
  }
}
