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
import { MatSnackBar } from '@angular/material/snack-bar';
import { AppComponent } from '../app.component';
import { HttpClient } from "@angular/common/http";
import { catchError } from "rxjs/operators";
import { Router } from "@angular/router";
import { throwError } from 'rxjs';

interface Photo {
  urlPhoto: string;
  alt: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']

})


export class HomeComponent {


  modulos: any = []
  constructor(private _snackBar: MatSnackBar, private url: AppComponent, private router: Router, private http: HttpClient) { }

  ngOnInit() {
   // this.validateSession();
    this.dataUserService();
  }

  //vars

  dataUser: any = {}
  path = this.url.url
  photos: any = {}
  messageErroServer:string = "No existe conexion con el servidor"
  messageErrorParametros:string = "Parametros invalidos"
  publications: any = []
  publicationId: any = {}


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
      console.log(this.dataUser);
    }
  this.publication();
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

  loadPhotos() {
    this.fetchPhotos()
      .subscribe(
        (photos: Photo[]) => {
          this.photos = photos;
        },
        (error) => {
          console.error('Error al cargar las fotos:', error);
        }
      );
  }

  fetchPhotos() {
    return this.http.get<Photo[]>(this.path);
  }

  //retorna todos los comentarios
  publication() {
    this.publicationRequest().subscribe((response: any) => this.publicationResult(response))
  }
  publicationRequest() {
    return this.http.get<any>(this.path + "/consult/publications").pipe(
      catchError((error: any) => {
          if (error.status === 400) {
            // error para parametros invalidos
            this.openSnackBar(this.messageErrorParametros, "Aceptar")
          } else {
            // error de conexion o un 500
            this.openSnackBar(this.messageErroServer, "Aceptar")
          }
          return throwError(error);
        }
      ))
  }
  publicationResult(response: any) {
    this.publications = response
    console.log(this.publications)
  }

publicationSet(id:any){
  console.log('ID de la imagen clickeada: ' + id);
  localStorage.setItem("idPublication", JSON.stringify(id));
  this.router.navigateByUrl("/publication");

}



}
