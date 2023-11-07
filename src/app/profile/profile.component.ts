import { Component } from '@angular/core';
import {
  FormControl,
  FormGroupDirective,
  NgForm,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AppComponent } from '../app.component';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { catchError } from "rxjs/operators";
import { Router } from "@angular/router";
import { throwError } from 'rxjs';



@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {
  modulos: any = []
  constructor(private _snackBar: MatSnackBar, private url: AppComponent, private router: Router, private http: HttpClient) { }

  ngOnInit() {
    this.validateSession();
  }

  //boolean
  modify: boolean = false
  view: boolean = false
  btnAdd: boolean = false
  btnUpdate: boolean = false
  add: boolean = false
  tab: boolean = true
  header: boolean = true

  //vars
  path = this.url.url


  //objetos
  perfilData: any = []
  perfilDataModify: any = []
  dataUser: any = {}
  photos: any = {}
  options: any = {}

  //url
  pageUrl = "profile"


  //bandera de botones
  optionsValidate() {
    this.options = localStorage.getItem("options");
    this.options = JSON.parse(this.options)

    let permisos: any = {}
    this.options.forEach((item: any) => {
      if (item.page === this.pageUrl) {
        permisos = item.permisos
      }
    })
    permisos.forEach((item: any) => {
      this.btnAdd = item.up == 1 ? true : false
      this.btnUpdate = item.update == 1 ? true : false
    })
  }

  //banderas
  Modify(id: any) {
    console.log("modifica")
    this.perfilDataModify = id
    this.add = false
    this.tab = false
    this.modify = true
    this.header = false

  }

  back() {
    console.log("back")
    this.modify = false
    this.add = false
    this.header = true
    this.perfilDataModify = {}
    this.ngOnInit()
  }


  backWelcome() {
    this.router.navigateByUrl("/home")
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
  //message
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action);
  }

  openSnackBarTime(message: string) {
    this._snackBar.open(message, '', { duration: 3000 });
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
     // this.revokeService()
    } else {
      this.dataUser = response
      
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




  //obtener datos del perfil
  perfil() {
    this.requestPerfil().subscribe(
      (response: any) => this.responsePerfil(response)
    )

  }
  requestPerfil() {
    var httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this.http.get<any>(this.url + "/consult/profile/" + this.perfilData.idProfile, httpOptions).pipe(
      catchError((error: any) => {
        if (error.status === 400) {
          // error para parametros invalidos 
          this.openSnackBar("valores invalidos", "Aceptar")
        } else {
          // error de conexion o un 500
          this.openSnackBar("No existe conexión con el servidor", "Aceptar");
        }
        return throwError(error);
      }
      ))
  }
  responsePerfil(response: any) {
    this.perfilData = response
    
  }

   //modificacion de perfil

   modForm() {
    let formularioValido: any = document.getElementById("modForm");
    if (formularioValido.reportValidity()) {
      this.perfilDataModify.userModification = this.dataUser.user
      console.log(this.perfilDataModify);
      this.requestProfileUpdate().subscribe(
        (response: any) => this.responseProfileUpdate(response)
      )
      
    }
  }
  requestProfileUpdate() {
    return this.http.put<any>(this.path + "/updateProfile/" + this.perfilDataModify.idUser, this.perfilDataModify).pipe(
      catchError((error: any) => {
        if (error.status === 400) {
          // error para parametros invalidos 
          this.openSnackBar("valores invalidos", "Aceptar")
        } else {
          // error de conexion o un 500
          this.openSnackBar("No existe conexión con el servidor", "Aceptar");
        }
        return throwError(error);
      }
      ))
  }
  responseProfileUpdate(response: any) {
    this.openSnackBarTime(response.message)
    this.dataUserService()
    this.modify = false;
  }
}
