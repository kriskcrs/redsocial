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

@Component({
  selector: 'app-set-password',
  templateUrl: './set-password.component.html',
  styleUrls: ['./set-password.component.css']
})
export class SetPasswordComponent {
  constructor(private _snackBar: MatSnackBar, private url: AppComponent, private router: Router, private http: HttpClient) { }

  ngOnInit() {
    this.validateSession();
  }

  //vars
  password = new FormControl('', [Validators.required]);
  passwordNew = new FormControl('', [Validators.required]);
  passwordConfirm = new FormControl('', [Validators.required]);
  hide = true;
  path = this.url.url
  dataUser: any = {}
  credenciales: any = {}
  messageOK:string = ""
  alertaOK:boolean = false
  spinner:boolean = false
  form:boolean = true


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

  //valida si la sesion esta vigente
  validateSession() {
    this.dataUser = localStorage.getItem("data")
    if (this.dataUser != null) {
      this.dataUser = JSON.parse(this.dataUser)
      this.dataUserService();
    } else {
      this.router.navigateByUrl("/")

    }
  }

  //obtiene data del usuario
  dataUserService() {
    this.dataUserRequest().subscribe((response: any) => this.dataUserResponse(response))
  }
  dataUserRequest() {
    let session = this.dataUser.session
    return this.http.get<any>(this.path + "/dataUser/" + session).pipe(
      catchError((error: any) => {
        if (error.status === 400) {
          // error para parametros invalidos 
          this.openSnackBar("valores invalidos", "Aceptar")
        } else {
          // error de conexion o un 500
          this.openSnackBar("No existe conexión con el servidor", "Aceptar");
        }
        return throwError(error);
      })
    )
  }
  dataUserResponse(response: any) {
    if (response == null) {
      this.revokeService()
    } else {
      this.dataUser = response
      console.log(this.dataUser);
      
    }

  }

  //service set password
  setPassword() {
    this.form = false
    this.spinner = true

    this.credenciales = {
      idUser: this.dataUser.idUser,
      password: this.password.value,
      passwordNew: this.passwordNew.value,
      passwordConfirm: this.passwordConfirm.value
    }
      this.setPasswordRequest(this.credenciales).subscribe((response: any) => this.setPasswordResponse(response))

  }
  setPasswordRequest(data: any) {
    return this.http.post<any>(this.path + "/setPassword", data).pipe(
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
  setPasswordResponse(response: any) {
    console.log("respondio ok");
    console.log(response);
    
    if(response != null){
      this.messageOK = response.message
      this.spinner = false
      this.alertaOK = true
      setTimeout(()=>{
        this.router.navigateByUrl("/login")  
      }, 3000);
    }else {
      this.openSnackBar("Contraseña incorrecta", "Aceptar");
      this.spinner = false
      this.form = true
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
  
}
