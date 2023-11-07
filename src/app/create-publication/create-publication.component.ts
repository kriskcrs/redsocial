import {Component, ViewChild} from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AppComponent } from '../app.component';
import { HttpClient } from "@angular/common/http";
import { catchError } from "rxjs/operators";
import { Router } from "@angular/router";
import { throwError } from 'rxjs';
@Component({
  selector: 'app-create-publication',
  templateUrl: './create-publication.component.html',
  styleUrls: ['./create-publication.component.css']
})
export class CreatePublicationComponent {
  constructor(private _snackBar: MatSnackBar, private url: AppComponent, private router: Router, private http: HttpClient) { }

  ngOnInit() {
    // this.validateSession(); habilitar a futuro
    this.userService()
  }

  //vars
  dataUser: any = {}
  path = this.url.url
  comments: any = []
  publication:any = {}
  publications: any = []
  users: any = []
  isFavorite = false;
  comentario: string = ""
  comentarioModificado:string =""
  idP: number = 1
  messageErroServer:string = "No existe conexion con el servidor"
  messageErrorParametros:string = "Parametros invalidos"
  editingCommentIndex: number = -1;
  file: any
  imageSrc: string | ArrayBuffer | null = null;
  @ViewChild('fileInput') fileInput: any;
  urlImages: any = "C:\\Users\\josue\\WebstormProjects\\redsocial\\src\\assets"
  serve:any=10.10
  hide = true;
  dataCreate:any ={}

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
    this._snackBar.open(message, '', { duration: 1000 });
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
          this.openSnackBar(this.messageErrorParametros, "Aceptar")
        } else {
          // error de conexion o un 500
          this.openSnackBar(this.messageErroServer, "Aceptar")
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



  //retorna todas las publicaciones

  publicationsService() {
    console.log("paso acua publi")
    this.publicationsRequest().subscribe((response: any) => this.publicationsResponse(response))
  }
  publicationsRequest() {
    console.log("entraicion en el request")
    return this.http.get<any>(this.path + "/consult/publications").pipe(
      catchError((error: any) => {
          if (error.status === 400) {
            // error para parametros invalidos
            this.openSnackBar(this.messageErrorParametros, "Aceptar")
          } else {
            // error de conexion o un 500
            this.openSnackBar(this.messageErroServer, "Aceptar");
          }
          return throwError(error);
        }
      ))
  }
  publicationsResponse(response: any) {
    console.log(response)
    this.publications = response
    this.idP = this.publications[0].idPublication
    this.publication = this.publications[0]
  }


  //usuarios
  userService() {
    this.userRequest().subscribe((response: any) => this.userResponset(response))
  }
  userRequest() {
    return this.http.get<any>(this.path + "/users").pipe(
      catchError((error: any) => {
          if (error.status === 400) {
            // error para parametros invalidos
            this.openSnackBar(this.messageErrorParametros, "Aceptar")
          } else {
            // error de conexion o un 500
            this.openSnackBar(this.messageErroServer, "Aceptar");
          }
          return throwError(error);
        }
      ))
  }
  userResponset(response: any) {
    this.users = response
    this.publicationsService()
  }



  //obtiene nombre de usuario
  getNameUser(id: any): string {
    for (const publication of this.publications) {
      if (publication.idPublication === id) {
        for (const user of this.users) {
          if (user.idUser === publication.userIdUser) {
            return user.name + " " + user.lastName;
          }
        }
      }
    }
    return '';
  }


//imagenes
  onFileSelected(event: any) {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imageSrc = reader.result;
      };
      reader.readAsDataURL(selectedFile);
      this.file = selectedFile
      console.log(this.file)
    }
  }

  selectImage() {
    // Hacer clic en el input de tipo archivo para abrir el cuadro de diálogo de selección de archivo
    this.fileInput.nativeElement.click();
  }
  imagenService() {

    this.imagenRequest(this.file, this.urlImages, this.users, this.serve).subscribe((response: any) => this.imagenResponse(response))

  }
  imagenRequest(file: File,path:any,user:any,server:any) {
    let dato:any =this.publications.photoIdPhoto
    console.log(this.publications.photoIdPhoto);


    return this.http.post<any>(this.path + "/fileUp", dato, { observe: 'response' }).pipe(
      catchError((error: any) => {
          if (error.status === 400) {
            // error para parametros invalidos
            this.openSnackBar(this.messageErrorParametros, "Aceptar")
          } else {
            // error de conexion o un 500
            this.openSnackBar(this.messageErroServer, "Aceptar");
          }
          return throwError(error);
        }
      ))
  }
  imagenResponse(response: any) {
    console.log("aca rut ")
    console.log(response);
  }

}
