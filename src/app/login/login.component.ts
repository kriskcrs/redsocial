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
      this.loginRequest(credenciales).subscribe((response: any) => this.loginResponse(response))
    }
  }
  loginRequest(data: any) {
    return this.http.post<any>(this.path + "/login", data).pipe(
      catchError((error: any) => {
        if (error.status === 400) {
          // error para parametros invalidos 
          this.openSnackBar("Valores no válidos", "Aceptar");
        } else {
          // error de conexion o un 500
          this.openSnackBar("No existe conexión con el servidor", "Aceptar");
        }
        return throwError(error);
      })
    )
  }
  loginResponse(response: any) {
    if (response == null) {
      this.openSnackBar("Credenciales no validas", "Aceptar");
    } else {
      //login exitoso

      localStorage.setItem("data", JSON.stringify(response))
      this.router.navigateByUrl("/home")
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
    console.log(response);
    
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

}
